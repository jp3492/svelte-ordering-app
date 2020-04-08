import firebase from 'firebase/app';

const request = async (url, options = {}) => {
  let idToken = "";

  const user = firebase.auth().currentUser;

  if (user) {
    idToken = await firebase.auth().currentUser.getIdToken(true);
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      authentication: idToken
    }
  });
}

export default request;