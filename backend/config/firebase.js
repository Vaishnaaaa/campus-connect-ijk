// backend/config/firebase.js
const admin = require("firebase-admin");

const initFirebase = () => {
  if (admin.apps.length) return; // already initialised

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key string from .env has literal \n — convert them
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });

  console.log("✅ Firebase Admin initialised");
};

module.exports = { admin, initFirebase };
