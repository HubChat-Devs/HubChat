import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Image, Text, StyleSheet } from 'react-native';
import IconButton from '../components/IconButton';
import signOutAsync from '../firebase/signOut';
import firebase from '../firebase/fire';
//import saveUserToFirestore from '../App';
const AfterLog = '@Expo:AfterLog';
const GithubStorageKey = '@Expo:GithubToken';

async function logon(setAfterLogon,userGit) {
  await AsyncStorage.setItem(AfterLog, 'AfterLogStorage');
  setAfterLogon(true);
  try {
      const db = firebase.firestore();
      const userRef = db.collection('USERS')
      userRef.doc(firebase.auth().currentUser.uid).set({
        uid: firebase.auth().currentUser.uid,
        id: userGit.id ,
        name: firebase.auth().currentUser.displayName == '' ? firebase.auth().currentUser.displayName :  userGit.login,
        username: userGit.login,
        email: firebase.auth().currentUser.email,
        profile_picture: firebase.auth().currentUser.photoURL,
        emailVerified: firebase.auth().currentUser.emailVerified
      })
    } catch (error) {
      alert(error);
    } finally {
      console.log('Cadastrado');
    }
}
async function UserData(setUserGit){
  let token = await AsyncStorage.getItem(GithubStorageKey);
  if (token) {
    fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'token ' + token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserGit(data);
      })
      .catch((err) => console.error(err));
  }
}
const Home = ({ route, navigation }) => {
    const [userGit, setUserGit] = useState({});

 
  useEffect(() => {
    UserData(setUserGit)
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: route.params.user.photoURL }}
        style={styles.image}
      />
      <Text style={styles.paragraph}>{userGit.login}</Text>
      {userGit.login && 
      <>
      <IconButton
        name="check"
        style={styles.paragraph}
        onPress={() => logon(route.params.setAfterLogon, userGit)}>
        Entrar Com Essa Conta
      </IconButton>
      <Text style={styles.paragraph}></Text>
      <IconButton name="close" style={styles.paragraph} onPress={signOutAsync}>
        Não é Você ?
      </IconButton> 
      </>
      }
    </View>
  );
};

Home.navigationOptions = {
  title: 'Home',
};
const styles = StyleSheet.create({
  image: {
    width: 128,
    height: 128,
    borderRadius: 64,
    overflow: 'hidden',
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#34495e',
  },
});

export default Home;
