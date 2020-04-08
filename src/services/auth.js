import { goto } from '@sapper/app';
import firebase from "firebase/app";
import { isAuthenticated } from "../stores/auth";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyB_TcTOhn-7jStU9bAv67Rp_YVBZklRWiY",
  authDomain: "testing-auth-c1e75.firebaseapp.com",
  databaseURL: "https://testing-auth-c1e75.firebaseio.com",
  projectId: "testing-auth-c1e75",
  storageBucket: "testing-auth-c1e75.appspot.com",
  messagingSenderId: "842231170614",
  appId: "1:842231170614:web:6b2dc262797e8ff7de7a97"
};

export const initFirebase = () => firebase.initializeApp(config);

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