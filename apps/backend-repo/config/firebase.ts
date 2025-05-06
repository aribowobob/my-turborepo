import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // pakai default credential saat pakai emulator
  });
}

export const db = admin.firestore();
export const auth = admin.auth();
