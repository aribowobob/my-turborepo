import admin from "firebase-admin";

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  // Use service account or environment variables for initialization
  admin.initializeApp({
    // If using environment variables for Firebase config
    // credential: admin.credential.cert({
    //   projectId: process.env.FIREBASE_PROJECT_ID,
    //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    // }),
    // For local development, you can use the emulator
    // databaseURL: "http://localhost:8080",
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
