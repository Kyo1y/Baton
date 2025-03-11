import os
from .firebase_config import initialize_firebase
import time
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

class FirebaseUtils:
    """
    A utility class for managing OAuth token storage and retrieval using Firebase.
    Handles authentication for Spotify and YouTube.
    """

    def __init__(self):
        """
        Initializes FirebaseUtils, setting up the Firebase connection and loading API credentials
        for Spotify and YouTube from environment variables.
        """
        self.root = initialize_firebase()
        self.spotify_client_id = os.getenv("SPOTIFY_CLIENT_ID")
        self.spotify_client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        self.youtube_client_id = os.getenv("YOUTUBE_CLIENT_ID")
        self.youtube_client_secret = os.getenv("YOUTUBE_CLIENT_SECRET")

    def save_tokens(self, platform, user_id, access_token, refresh_token, expires_at):
        """
        Stores OAuth tokens for a user in Firebase under the specified platform.

        Args:
            platform (str): The platform name (e.g., "spotify" or "youtube").
            user_id (str): The user's unique identifier.
            access_token (str): The access token for API authentication.
            refresh_token (str): The refresh token used to obtain new access tokens.
            expires_at (int): The UNIX timestamp indicating when the access token expires.
        """
        self.root.child('users').child(f"{user_id}").child(platform).set({
            'platform': platform,
            'access_token': access_token,
            'refresh_token': refresh_token,
            'expires_at': expires_at,
        })

    def get_access_token(self, user_id, platform):
        """
        Retrieves a valid access token for a user. If the token has expired, it will be refreshed.

        Args:
            user_id (str): The user's unique identifier.
            platform (str): The platform name (e.g., "spotify" or "youtube").

        Returns:
            str: A valid access token, either retrieved from Firebase or obtained via token refresh.
        """
        current_expiration_stamp = self.root.child('users').child(f"{user_id}").child(platform).child("expires_at").get()
        if int(time.time()) > current_expiration_stamp:
            refresh_token = self.root.child('users').child(f"{user_id}").child(platform).child('refresh_token').get()
            return self._refresh_token(platform, refresh_token, user_id)
        else:
            return self.root.child('users').child(f"{user_id}").child(platform).child("access_token").get()

    def _refresh_token(self, platform, refresh_token, user_id):
        """
        Refreshes the OAuth access token for a given platform using the stored refresh token.

        Args:
            platform (str): The platform name (e.g., "spotify" or "youtube").
            refresh_token (str): The refresh token used to obtain a new access token.
            user_id (str): The user's unique identifier.

        Returns:
            str or None: The new access token if the refresh is successful, otherwise None.
        """
        url, client_id, client_secret = {
            "spotify": ("https://accounts.spotify.com/api/token", self.spotify_client_id, self.spotify_client_secret),
            "youtube": ("https://oauth2.googleapis.com/token", self.youtube_client_id, self.youtube_client_secret)
        }[platform]
        
        auth_bytes = f"{client_id}:{client_secret}".encode("utf-8")
        auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")
        
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        if platform == "spotify":
            headers["Authorization"] = f"Basic {auth_base64}" 
        
        data = {"grant_type": "refresh_token", "refresh_token": refresh_token}
        response = requests.post(url, headers=headers, data=data)
        
        if response.status_code == 200:
            json_res = response.json()
            expiration_stamp = int(time.time()) + json_res['expires_in']
            access_token = json_res["access_token"]
            self.save_tokens(platform, user_id, access_token, refresh_token, expiration_stamp)
            return access_token
        else:
            print(f"Error refreshing {platform} token: {response.status_code}")
            return None
