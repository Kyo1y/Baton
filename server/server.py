import os
from flask import Flask, request, render_template
from database import firebase_utils
import base64
from requests import post
import time
from dotenv import load_dotenv

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
firebase_utils_client = firebase_utils.FirebaseUtils()

app = Flask(__name__)

def sp_exchange(platform, auth_code, user_id):
    """
    Exchanges an authorization code for a Spotify access token.

    Args:
        platform (str): The platform name ("spotify").
        auth_code (str): The authorization code received from Spotify.
        user_id (str): The unique user ID.

    Returns:
        None
    """
    if user_id is None:
        return 'Error: State mismatch'
    
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    auth_base64 = base64.b64encode(auth_string.encode("utf-8")).decode("utf-8")

    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    url = "https://accounts.spotify.com/api/token"

    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": "http://localhost:8888/callback"
    }

    response = post(url, headers=headers, data=data)
    if response.ok:
        json_res = response.json()
        access_token = json_res["access_token"]
        refresh_token = json_res["refresh_token"]
        expiration_stamp = int(time.time()) + json_res["expires_in"]
        firebase_utils_client.save_tokens(platform, user_id, access_token, refresh_token, expiration_stamp)
        print("Spotify token exchange successful")
    else:
        error_message = f"Error exchanging auth code: {response.status_code}, {response.content}"
        print(error_message)

def yt_exchange(platform, auth_code, user_id):
    """
    Exchanges an authorization code for a YouTube access token.

    Args:
        platform (str): The platform name ("youtube").
        auth_code (str): The authorization code received from YouTube.
        user_id (str): The unique user ID.

    Returns:
        None
    """
    if user_id is None:
        return 'Error: State mismatch'
    
    url = "https://oauth2.googleapis.com/token"

    data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "client_id": YOUTUBE_CLIENT_ID,
        "client_secret": YOUTUBE_CLIENT_SECRET,
        "redirect_uri": "http://localhost:8888/callback",
    }

    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }

    response = post(url, headers=headers, data=data)

    if response.ok:
        tokens = response.json()
        access_token = tokens["access_token"]
        refresh_token = tokens["refresh_token"]
        expiration_stamp = int(time.time()) + tokens["expires_in"]
        firebase_utils_client.save_tokens(platform, user_id, access_token, refresh_token, expiration_stamp)
        print("YouTube token exchange successful")
    else:
        error_message = f"Error exchanging auth code: {response.status_code}, {response.content}, auth code used: {auth_code}"
        print(error_message)

@app.route('/')
def index():
    return render_template("index.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404

@app.route('/callback')
def callback():
    """
    Handles the OAuth callback for both Spotify and YouTube.

    Extracts the authorization code and state from the request,
    determines which platform the request is from, and exchanges
    the code for access and refresh tokens.

    Returns:
        str: A message indicating whether authentication was successful.
    """
    auth_code = request.args.get('code')
    state = request.args.get('state')

    if not state:
        return "Error: No state parameter provided."

    platform, user_id = state.split('|')

    if platform == "spotify":
        sp_exchange(platform, auth_code, user_id)
        return "Thank you for authorizing access! Return to the bot to continue."
    elif platform == "youtube":
        yt_exchange(platform, auth_code, user_id)
        return "Thank you for authorizing access! Return to the bot to continue."
    else:
        return "Error: Invalid platform specified."

if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)
