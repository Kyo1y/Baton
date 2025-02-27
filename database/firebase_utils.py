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
# Initialize the database
root = initialize_firebase()

def save_tokens(platform, user_id, access_token, refresh_token, expires_at):
    """Save tokens to the database."""
    root.child('users').child(f"{user_id}").child(platform).set({
        'platform': platform,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'expires_at': expires_at,
    })
    print(f"Tokens saved for user: {user_id}")

def sp_get_access_token(user_id):
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
            save_tokens(user_id, access_token, refresh_token, expiration_stamp)
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
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_secret": YOUTUBE_CLIENT_SECRET,
            "client_id": YOUTUBE_CLIENT_ID
        }

        response = post(url, headers=headers, data=data)

        if response.status_code == 200:
            tokens = response.json()
            new_access_token = tokens["access_token"]
            expiration_stamp = int(time.time()) + tokens["expires_in"]
            save_tokens("youtube", user_id, new_access_token, refresh_token, expiration_stamp)
            return new_access_token
        else:
            return f"Error: {response.status_code}, {response.content}"
    else:
        return  root.child('users').child(f"{user_id}").child("youtube").child("access_token").get()
        
def get_tokens(user_id):
    """Retrieve tokens from the database."""
    tokens = root.child('users').child(f"{user_id}").get()
    if tokens:
        print(f"Retrieved tokens for user: {user_id}")
        return tokens
    else:
        print(f"No tokens found for user: {user_id}")
        return None

def delete_tokens(user_id):
    """Delete tokens for a user."""
    root.child('users').child(f"{user_id}").delete()
    print(f"Deleted tokens for user: {user_id}")
