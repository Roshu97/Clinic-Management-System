import firebase_admin
from firebase_admin import credentials, firestore
import json
import os

# Replace with the path to your service account key file
# Make sure this file is kept secure and not committed to version control
SERVICE_ACCOUNT_KEY_PATH = r'd:\Internship Projects\Clinec-Management-System\backend\serviceAccountKey.json'
DB_JSON_PATH = r'd:\Internship Projects\Clinec-Management-System\backend\db.json'

# Initialize Firebase Admin SDK
try:
    cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"Error initializing Firebase Admin SDK: {e}")
    print("Please ensure your service account key path is correct and the file is valid.")
    exit()

def migrate_data():
    if not os.path.exists(DB_JSON_PATH):
        print(f"Error: {DB_JSON_PATH} not found.")
        return

    with open(DB_JSON_PATH, 'r') as f:
        data = json.load(f)

    # Migrate patients
    if "patients" in data:
        patients_ref = db.collection('patients')
        for patient in data["patients"]:
            try:
                # Use the 'id' field from your JSON as the document ID in Firestore
                doc_id = patient.get('id')
                if doc_id:
                    patients_ref.document(doc_id).set(patient)
                    print(f"Patient {patient.get('name')} (ID: {doc_id}) migrated successfully.")
                else:
                    print(f"Skipping patient due to missing 'id': {patient}")
            except Exception as e:
                print(f"Error migrating patient {patient.get('name')}: {e}")
    else:
        print("No 'patients' data found in db.json.")

    # Migrate queue
    if "queue" in data:
        queue_ref = db.collection('queue')
        for item in data["queue"]:
            try:
                # Use the 'id' field from your JSON as the document ID in Firestore
                doc_id = item.get('id')
                if doc_id:
                    queue_ref.document(doc_id).set(item)
                    print(f"Queue item (ID: {doc_id}) migrated successfully.")
                else:
                    print(f"Skipping queue item due to missing 'id': {item}")
            except Exception as e:
                print(f"Error migrating queue item (ID: {item.get('id')}): {e}")
    else:
        print("No 'queue' data found in db.json.")

if __name__ == "__main__":
    migrate_data()