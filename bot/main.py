import os
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Updater, CommandHandler, CallbackQueryHandler,
    ConversationHandler, MessageHandler, filters, CallbackContext, Application
)
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
import threading
from database import firebase_utils
from requests import get
from bot import bot_utils
import json
from dotenv import load_dotenv

load_dotenv()

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

# Telegram Bot Token
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# Spotify Credentials
SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
SPOTIFY_REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

# YouTube Credentials
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
YOUTUBE_SCOPES = os.getenv("YOUTUBE_SCOPES")

sp_oauth = SpotifyOAuth(
    client_id=SPOTIFY_CLIENT_ID,
    client_secret=SPOTIFY_CLIENT_SECRET,
    redirect_uri=SPOTIFY_REDIRECT_URI,
    scope="playlist-read-private playlist-modify-public",
)
# Conversation states
CHOOSING, YOUTUBE_PLAYLIST_CHOSEN, SPOTIFY_PLAYLIST_CHOSEN, YOUTUBE_PLAYLISTS, SPOTIFY_PLAYLISTS, SPOTIFY_AUTH, YOUTUBE_AUTH, ADDING = range(8)

async def start(update: Update, context: CallbackContext):
    keyboard = [
        [InlineKeyboardButton("Spotify to YTMusic", callback_data='s_to_y')],
        [InlineKeyboardButton("YTMusic to Spotify", callback_data='y_to_s')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text(
        "Welcome! From which app would you like to export your music?",
        reply_markup=reply_markup
    )
    return CHOOSING

async def choice_handler(update: Update, context: CallbackContext):
    query = update.callback_query
    await query.answer()
    choice = query.data
    print(f'Button clicked: {choice}')
    context.user_data['choice'] = choice
    return YOUTUBE_AUTH

async def youtube_auth(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    flow = Flow.from_client_secrets_file(
        "client_secret_yt.json",
        scopes=["https://www.googleapis.com/auth/youtube.force-ssl"],
        redirect_uri="http://localhost:8888/callback"
    )
    
    auth_url, _ = flow.authorization_url(prompt='consent',state = f"youtube|{user_id}")
    keyboard = [[InlineKeyboardButton("Done", callback_data='youtube_auth_done')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.callback_query.message.reply_text(
        text=f"Please authorize YouTube access by visiting this URL: {auth_url}",
        reply_markup=reply_markup,
    )
    return YOUTUBE_PLAYLISTS
    

async def youtube_playlists(update: Update, context: CallbackContext):
    # ask if you can call function like this
    yt_access_token = firebase_utils.yt_get_access_token(update.effective_user.id)
    playlists = bot_utils.yt_fetch_playlists(yt_access_token)
    print(f"Playlists: {playlists}")
    if playlists is not None:
        keyboard = [
            [InlineKeyboardButton(p['snippet']['title'], callback_data=p['id'])] for p in playlists
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.callback_query.message.reply_text(
            "Select a playlist to transfer:",
            reply_markup=reply_markup
        )

        return YOUTUBE_PLAYLIST_CHOSEN
    else:
        await update.message.reply_text("Playlist retrieve failed. Please try again.")
        return ConversationHandler.END

async def youtube_playlist_chosen(update: Update, context: CallbackContext):
    query = update.callback_query
    await query.answer()
    youtube_playlist_id = query.data
    context.user_data['youtube_playlist_id'] = youtube_playlist_id
    return SPOTIFY_AUTH

async def spotify_auth(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    auth_url = sp_oauth.get_authorize_url(state=f"spotify|{user_id}")
    keyboard = [[InlineKeyboardButton("Done", callback_data='spotify_auth_done')]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.callback_query.message.reply_text(
        f"Please authorize Spotify access by visiting this URL: {auth_url}",
        reply_markup=reply_markup,
    )

    return SPOTIFY_PLAYLISTS

async def spotify_playlists(update: Update, context: CallbackContext):
    access_token = firebase_utils.sp_get_access_token(update.effective_user.id)
    if access_token is None:
        update.callback_query.message.reply_text("Authorization failed. Please try again.")
        return ConversationHandler.END
    else:
        sp = spotipy.Spotify(auth=access_token)
        playlists = sp.current_user_playlists()['items']
        if not playlists:
            await update.callback_query.message.reply_text("You don't have any playlists.")
            return ConversationHandler.END

        keyboard = [
            [InlineKeyboardButton(p['name'], callback_data=p['id'])] for p in playlists
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        await update.callback_query.message.reply_text(
            "Select a playlist to transfer:",
            reply_markup=reply_markup
        )
        return SPOTIFY_PLAYLIST_CHOSEN

async def spotify_playlist_chosen(update: Update, context: CallbackContext):
    query = update.callback_query
    await query.answer()
    playlist_id = query.data
    context.user_data['spotify_playlist_id'] = playlist_id
    return ADDING

async def add_songs_to_spotify(update: Update, context: CallbackContext):
    await update.callback_query.message.reply_text("Adding songs to your Spotify playlist...")
    yt_playlist_id = context.user_data['youtube_playlist_id']
    sp_playlist_id = context.user_data['spotify_playlist_id']
    sp_access_token = firebase_utils.sp_get_access_token(update.effective_user.id)
    yt_access_token = firebase_utils.yt_get_access_token(update.effective_user.id)
    tracks = bot_utils.yt_get_all_tracks(yt_access_token, yt_playlist_id)

    tracks_ids = []

    for track in tracks:
        print(track)
        sp_track_id = bot_utils.search_spotify_track(f"track:{track[0]} artist:{track[1].replace(" - Topic", "")}", sp_access_token)
        if sp_track_id is not None:
            tracks_ids.append(sp_track_id)
        else:
            continue
    
    sp = spotipy.Spotify(auth=sp_access_token)

    for track in tracks_ids:
        sp.playlist_add_items(sp_playlist_id, f"spotify:track:{track}")

    await update.callback_query.message.reply_text("Songs have been added to your Spotify playlist!")
    return ConversationHandler.END

async def add_songs_to_youtube(update: Update, context: CallbackContext):
    # Fetch songs from Spotify playlist
    playlist_id = context.user_data['spotify_playlist_id']
    sp_access_token = firebase_utils.sp_get_access_token(update.effective_user.id)
    yt_access_token = firebase_utils.yt_get_access_token(update.effective_user.id)

    sp = spotipy.Spotify(auth=sp_access_token)
    tracks = bot_utils.sp_get_all_tracks(sp, playlist_id)

    creds = Credentials(token=yt_access_token)
    youtube = build('youtube', 'v3', credentials=creds)
    # Add songs to YouTube playlist
    await update.callback_query.message.reply_text("Adding songs to your YouTube playlist...")
    for track in tracks:
        track_name = track['track']['name']
        artists= [artist['name'] for artist in track['track']['artists']]
        search_response = youtube.search().list(
            q=f'{track_name} {', '.join(artists)}',
            part='snippet',
            maxResults=1,
            type='video'
        ).execute()
        if search_response['items']:
            video_id = search_response['items'][0]['id']['videoId']
            youtube.playlistItems().insert(
                part='snippet',
                body={
                    'snippet': {
                        'playlistId': context.user_data['youtube_playlist_id'],
                        'resourceId': {
                            'kind': 'youtube#video',
                            'videoId': video_id
                        }
                    }
                }
            ).execute()
    await update.callback_query.message.reply_text("Songs have been added to your YouTube playlist!")
    return ConversationHandler.END

async def cancel(update: Update, context: CallbackContext):
    await update.callback_query.message.reply_text('Operation cancelled.')
    return ConversationHandler.END

def main():
    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

    # Define the conversation handler
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            CHOOSING: [
                CallbackQueryHandler(choice_handler),  
            ],
            YOUTUBE_AUTH: [
                CallbackQueryHandler(youtube_auth),  
            ],
            YOUTUBE_PLAYLISTS: [
                CallbackQueryHandler(youtube_playlists, pattern='youtube_auth_done'),  
            ],
            YOUTUBE_PLAYLIST_CHOSEN: [
                CallbackQueryHandler(youtube_playlist_chosen)
            ],
            SPOTIFY_AUTH: [
                CallbackQueryHandler(spotify_auth),  
            ],
            SPOTIFY_PLAYLISTS: [
                CallbackQueryHandler(spotify_playlists, pattern='spotify_auth_done'),
            ],
            SPOTIFY_PLAYLIST_CHOSEN: [
                CallbackQueryHandler(spotify_playlist_chosen)
            ],
            ADDING: [
                CallbackQueryHandler(
                    lambda update, context: add_songs_to_spotify(update, context)
                    if context.user_data['choice'] == 'y_to_s'
                    else add_songs_to_youtube(update, context)
                ),  # Perform song transfer
            ],
        },
        fallbacks=[CommandHandler('cancel', cancel)]
    )

    # Add the conversation handler to the application
    app.add_handler(conv_handler)

    # Start polling
    app.run_polling()

if __name__ == '__main__':
    main()
