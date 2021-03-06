import * as admin from 'firebase-admin';

try {
  admin.initializeApp({
    credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT),
    databaseURL: process.env.FIREBASE_DB_URL
  });
  console.log("\x1b[32m", "Firebase connected");
} catch (error) {
  console.log(error);
}


export default admin;