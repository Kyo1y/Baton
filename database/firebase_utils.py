import os
from .firebase_config import initialize_firebase
import time
import base64
from requests import post, get
import json
from dotenv import load_dotenv

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")
root = initialize_firebase()

def save_tokens(platform, user_id, access_token, refresh_token, expires_at):
    """
    Saves OAuth tokens for a user in Firebase.

    Args:
        platform (str): The platform name (spotify/youtube).
        user_id (str): The unique user ID.
        access_token (str): The OAuth access token.
        refresh_token (str): The refresh token.
        expires_at (int): Timestamp of when the token expires.
    """
    root.child('users').child(f"{user_id}").child(platform).set({
        'platform': platform,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_at': expires_at,
    })
    print(f"Tokens saved for user: {user_id}")

def sp_get_access_token(user_id):
    """
    Retrieves a valid Spotify access token, refreshing if needed.

    Args:
        user_id (str): The unique user ID.

    Returns:
        str: A valid Spotify access token or None if refresh fails.
    """
    current_expiration_stamp = root.child('users').child(f"{user_id}").child("spotify").child("expires_at").get()
    if int(time.time()) > current_expiration_stamp:
        refresh_token = root.child('users').child(f"{user_id}").child("spotify").child('refresh_token').get()
        
        auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
        auth_bytes = auth_string.encode("utf-8")
        auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

        url = "https://accounts.spotify.com/api/token"
        headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }

        response = post(url, headers=headers, data=data)

        if response.status_code == 200:
            json_res = response.json()
            expiration_stamp = int(time.time()) + json_res['expires_in']
            access_token = json_res["access_token"]
            save_tokens("spotify", user_id, access_token, refresh_token, expiration_stamp)
            return access_token
        else:
            print(f"Error refreshing token: {response.status_code}")
            return None
    else:
        return root.child('users').child(f"{user_id}").child("spotify").child("access_token").get()


def yt_get_access_token(user_id):
    current_expiration_stamp = root.child('users').child(f"{user_id}").child("youtube").child("expires_at").get()
    if int(time.time()) > current_expiration_stamp:
        refresh_token = root.child('users').child(f"{user_id}").child("youtube").child('refresh_token').get()

        url = "https://oauth2.googleapis.com/token"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "client_id": YOUTUBE_CLIENT_ID,
            "client_secret": YOUTUBE_CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }

        response = post(url, headers=headers, data=data)

        if response.status_code == 200:
            json_res = response.json()
            expiration_stamp = int(time.time()) + json_res['expires_in']
            access_token = json_res["access_token"]
            save_tokens("spotify", user_id, access_token, refresh_token, expiration_stamp)
            return access_token
        else:
            print(f"Error refreshing token: {response.status_code}")
            return None
    else:
        return root.child('users').child(f"{user_id}").child("youtube").child("access_token").get()