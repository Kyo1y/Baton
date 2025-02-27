from requests import get

def sp_get_all_tracks(sp, playlist_id):
    """
    Retrieves all tracks from a specified Spotify playlist.

    Args:
        sp (spotipy.Spotify): Authenticated Spotipy client.
        playlist_id (str): The Spotify playlist ID.

    Returns:
        list: A list of track items from the playlist.
    """
    all_tracks = []
    offset = 0

    while True:
        response = sp.playlist_tracks(playlist_id, offset=offset)
        all_tracks.extend(response['items'])

        if response['next'] is None:  # No more tracks
            break

        offset += len(response['items'])

    return all_tracks

def yt_get_all_tracks(yt_access_token, playlist_id):
    """
    Fetches all tracks from a given YouTube playlist.

    Args:
        yt_access_token (str): The YouTube OAuth access token.
        playlist_id (str): The YouTube playlist ID.

    Returns:
        list: A list of tuples containing (video title, artist name).
    """
    url = "https://www.googleapis.com/youtube/v3/playlistItems"
    next_page_token = None
    all_tracks = []

    while True:
        params = {
            "part": "snippet",
            "playlistId": playlist_id,
            "maxResults": 50,
            "pageToken": next_page_token,
        }

        headers = {
            "Authorization": f"Bearer {yt_access_token}"
        }

        response = get(url, headers=headers, params=params)
        if response.status_code == 200:
            data = response.json()
            for item in data.get("items", []):
                video_title = item['snippet']['title']
                artist = item['snippet']['videoOwnerChannelTitle']
                track = (video_title, artist)
                all_tracks.append(track)
            next_page_token = data.get("nextPageToken")

            if not next_page_token:
                break
        else:
            print(f"Error: {response.status_code}, {response.json()}")
            return None
    return all_tracks

def yt_fetch_playlists(yt_access_token):
    """
    Retrieves a list of the user's YouTube playlists.

    Args:
        yt_access_token (str): The YouTube OAuth access token.

    Returns:
        list: A list of playlist objects, or None if request fails.
    """
    url = "https://www.googleapis.com/youtube/v3/playlists"

    params = {
        "part": "snippet",
        "mine": "true",
        "maxResults": 7,
    }

    headers = {
        "Authorization": f"Bearer {yt_access_token}"
    }

    response = get(url, headers=headers, params=params)
    if response.status_code == 200:
        return response.json().get("items", [])
    else:
        return None

def search_spotify_track(query, access_token):
    """
    Searches for a track on Spotify.

    Args:
        query (str): Search query string in format "<optional keyword> track:<track name> artist:<artist name>"
        access_token (str): Spotify OAuth access token.

    Returns:
        str: The Spotify track ID, or None if not found.
    """
    url = "https://api.spotify.com/v1/search"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    params = {
        "q": query,
        "type": "track",
        "limit": 1
    }

    response = get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        print(data)
        return data['tracks']['items'][0]['id']
    else:
        print(f"Error: {response.status_code}, {response.json()}")
        return None
