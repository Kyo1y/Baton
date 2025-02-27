import os
from flask import Flask, request
from database import firebase_utils
import base64
from requests import post
import json
import time
from dotenv import load_dotenv

load_dotenv()

SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
YOUTUBE_CLIENT_ID = os.getenv("YOUTUBE_CLIENT_ID")
YOUTUBE_CLIENT_SECRET = os.getenv("YOUTUBE_CLIENT_SECRET")

app = Flask(__name__)

def sp_exchange(platform, auth_code, user_id):
    if (user_id is None):
        return 'Error: State mismatch'
    else:
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
        if response.status_code == 200:
            json_res = response.json()
            access_token = json_res["access_token"]
            refresh_token = json_res["refresh_token"]
            expiration_stamp = int(time.time()) + json_res["expires_in"]
            firebase_utils.save_tokens(platform, user_id, access_token, refresh_token, expiration_stamp)
            print("successful exchange")
        else:
            error_message = f"Error exchanging auth code: {response.status_code}, {response.content}, aaa"
            print(error_message)
        
def yt_exchange(platform, auth_code, user_id):
    if (user_id is None):
        return 'Error: State mismatch'
    else:
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

        if response.status_code == 200:
            tokens = response.json()
            access_token = tokens["access_token"]
            refresh_token = tokens["refresh_token"]
            expiration_stamp = int(time.time()) + tokens["expires_in"]
            firebase_utils.save_tokens(platform, user_id, access_token, refresh_token, expiration_stamp)
        else:
            error_message = f"Error exchanging auth code: {response.status_code}, {response.content}, auth code used: {auth_code}"
            print(error_message)



@app.route('/callback')

def callback():
    # Capture the authorization code from the URL
    auth_code = request.args.get('code')
    state= request.args.get('state')
    platform, user_id = state.split('|')
    print(f"Received auth code: {auth_code}, state: {state}")
    if state:
        if platform == "spotify":
            sp_exchange(platform, auth_code, user_id)
            return "Thank you for authorizing access! Return to the bot to continue."
        elif platform == "youtube":
            yt_exchange(platform, auth_code, user_id)
            return "Thank you for authorizing access! Return to the bot to continue."


if __name__ == '__main__':
    # Run the server on localhost:8888
    app.run(port=8888)