import { goto } from '@sapper/app';
import firebase from "firebase/app";
import { isAuthenticated } from "../stores/auth";
import "firebase/auth";

export let initialized = false;

export const initFirebase = async () => {
  try {
    await firebase.initializeApp(process.env.FIREBASE_CLIENT_CONFIG);
    console.log("Firebase initialized");
    initialized = true;
  } catch (error) {
    console.log(error);
    console.log("Failed to initialize firebase");
  }
};

const register = async ({ email, password }) => {
  try {
    const res = await firebase.auth().createUserWithEmailAndPassword(email, password);
    await fetch("api/user", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ firebaseId: res.user.uid, email })
    });
    goto(`auth/login?email=${email}`);
  } catch (error) {
    console.log(error);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await firebase.auth().signInWithEmailAndPassword(email, password);

    const idToken = await firebase.auth().currentUser.getIdToken(false);
    const csrfToken = "someCsrfToken";

    await fetch("/api/session", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken,
        csrfToken
      })
    });
    isAuthenticated.update(() => true);
    goto("/manage");
  } catch (error) {
    console.log(error);
    if ($isAuthenticated) {
      isAuthenticated.update(() => false);
    }
  }
};

export const logout = async () => {
  try {
    const res = await firebase.auth().signOut();
    await fetch("/api/clear_session", {
      method: "post",
    });
    isAuthenticated.update(() => false);
    goto("auth/login");
  } catch (error) {
    console.log(error);
  }
};

export default {
  register,
  login,
  logout
}