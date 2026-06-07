import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.warn("⚠️ Firebase Admin warning: FIREBASE_PRIVATE_KEY or FIREBASE_CLIENT_EMAIL is missing. Auth middleware will fail.");
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase Admin Initialized successfully.");
    } catch (error) {
      console.error("Firebase Admin Initialization Error:", error);
    }
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null as any;
export default admin;
