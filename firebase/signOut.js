import React from 'react';
import firebase from './fire';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';
const AfterLog = '@Expo:AfterLog';

async function signOutAsync() {
  try {
    await AsyncStorage.removeItem(GithubStorageKey);
    console.log("Removendo : " , await AsyncStorage.getItem(AfterLog))
    await AsyncStorage.removeItem(AfterLog);
    console.log("Removido : " , await AsyncStorage.getItem(AfterLog))
    await firebase.auth().signOut();
  } catch ({ message }) {
    alert('Error: ' + message);
  }
}
export default signOutAsync;
