import os
import firebase_admin
from firebase_admin import credentials, db
from dotenv import load_dotenv

load_dotenv()

firebase_secrets_path = os.getenv("FIREBASE_CREDENTIALS")
firebase_database_url = os.getenv("FIREBASE_DATABASE_URL")

def initialize_firebase():
    """
    Initializes the Firebase database connection.

    Returns:
        firebase_admin.db.Reference: A reference to the Firebase database.
    """
    if not firebase_admin._apps:
        cred = credentials.Certificate(firebase_secrets_path)
        firebase_admin.initialize_app(cred, {'databaseURL': firebase_database_url})
        print("Firebase initialized")
    return db.reference()
