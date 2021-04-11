import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBXaw21N29ckyIiBf_AOvupS6qHvOmczVk",
    authDomain: "instagram-clone-f94ea.firebaseapp.com",
    databaseURL: "https://instagram-clone-f94ea-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-f94ea",
    storageBucket: "instagram-clone-f94ea.appspot.com",
    messagingSenderId: "420490878104",
    appId: "1:420490878104:web:690bea8cf89aced21204ed",
    measurementId: "G-FFMMJPTGNG"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export { db, auth, storage };
