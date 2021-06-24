import React, { setState, useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';
import Wave from '../components/WaveProfile';


async function UserData(setUserGit) {
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

const Profile = ({ route, navigation }) => {
  const [userGit, setUserGit] = useState({});

  useEffect(() => {
    UserData(setUserGit);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <Wave/>
      <Image
        style={styles.avatar}
        source={{
          uri: userGit.avatar_url,
        }}
      />
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.name}>{userGit.name}</Text>
          <Text style={styles.info}>@{userGit.login}</Text>
          <Text style={styles.description}>{userGit.bio}</Text>
          <Text style={styles.description ,{marginBottom: 10}}><Icon name='users' size={15} />  {userGit.followers} followers - {userGit.following} following</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              Linking.openURL(userGit.html_url);
            }}>
            <Text style={{color:'white'}}>Abrir No GitHub</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

Profile.navigationOptions = {
  title: 'MyProfile',
};
const styles = StyleSheet.create({
  header: {
    height: 100,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 50,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
    marginTop: 7,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  info: {
    fontSize: 16,
    color: '#222',
    marginTop: 10,
  },
  description: {
    marginBottom: 10,
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor:"#3485E4"
  },
});
export default Profile;
