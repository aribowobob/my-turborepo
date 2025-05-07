import admin from "firebase-admin";

// Check if Firebase app is already initialized
if (!admin.apps.length) {
  // Simplified initialization for development
  admin.initializeApp({
    projectId: "demo-project",
    // Empty creadential for development/emulator
    credential: admin.credential.applicationDefault(),
  });

  // Connect to emulators in development mode
  if (process.env.NODE_ENV === "development") {
    // Set environment variables for emulators BEFORE initializing database/auth
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";

    console.log("Firebase initialized in emulator mode");
  } else {
    console.log("Firebase initialized in production mode");
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
