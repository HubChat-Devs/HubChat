import firebase,{ initializeApp, apps } from "@firebase/app";
import {auth} from "@firebase/auth";
import {firestore} from "@firebase/firestore";
import "@firebase/database";

const firebaseConfig = {
  apiKey: 'AIzaSyAkp1OzZwGEOZtCoIKhxiJ0sRtbm7SgRcE',
  authDomain: 'hubchat-mobile.firebaseapp.com',
  projectId: 'hubchat-mobile',
  storageBucket: 'hubchat-mobile.appspot.com',
  messagingSenderId: '1068573708201',
  appId: '1:1068573708201:web:908d336959b5d0a9287eb8',
  measurementId: 'G-L21631EGW2',
  databaseURL: 'https://hubchat-mobile-default-rtdb.firebaseio.com/',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  console.log('firebase apps already running...');
}

export default firebase;
