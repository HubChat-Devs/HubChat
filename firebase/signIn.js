import React from 'react';
import firebase from './fire';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';
const AfterLog = '@Expo:AfterLog';
import getGithubTokenAsync from '../getGithubTokenAsync';

async function signInAsync(token,setAfterLogon) {
  try {
    if (!token) {
      console.log("tentando entrar")
      const token = await getGithubTokenAsync();
      if (token) {
        console.log("tem token depois de logar")
        await AsyncStorage.setItem(GithubStorageKey, token);
        console.log("token :",token)
        return signInAsync(token);
      } else {
        return;
      }
    }
    const credential = firebase.auth.GithubAuthProvider.credential(token);

    return firebase.auth().signInWithCredential(credential);
  } catch ({ message }) {
    alert(message);
  }
}
export default signInAsync;