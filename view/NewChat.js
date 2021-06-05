import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { AntDesign as Icon } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';
import Loading from '../components/Loading';
import firebase from '../firebase/fire';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

const Issues = ({ route, navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [chatName, setChatName] = useState('');
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const db = firebase.firestore();
  const [currentUserGit, setCurrentUserGit] = useState({});

  /**
   * Create a new Firestore collection to save threads
   */
  async function UserData(setCurrentUserGit) {
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
          setCurrentUserGit(data);
        })
        .catch((err) => console.error(err));
    }
  }
  function createGroup() {
    if (chatName.length > 0) {
      db.collection('Groups')
        .add({
          name: chatName,
          latestMessage: {
            text: `You have joined the room ${chatName}.`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: `You have joined the room ${chatName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
          navigation.navigate('Chat');
        });
    }
  }
  async function createChat(user) {
    const currentUser = await UserData(setCurrentUserGit);
    db.collection('CHATS')
      .add({
        id: user.id,
        username: user.username,
        username2: currentUserGit.login,
        picture: user.profile_picture,
        picture2: currentUserGit.avatar_url,
        latestMessage: {
          text: `Nova Conversa com ${user.name ? user.name : user.username}.`,
          createdAt: new Date().getTime(),
        },
        members: [user.uid, firebase.auth().currentUser.uid],
      })
      .then((docRef) => {
        docRef.collection('MESSAGES').add({
          text: `Nova Conversa com ${user.name ? user.name : user.username}.`,
          createdAt: new Date().getTime(),
          system: true,
        });
        navigation.navigate('Chats');
      });
  }
  async function fetchUSERS() {
    db.collection('USERS')
      .where('uid', '!=', firebase.auth().currentUser.uid)
      .get()
      .then(function (querySnapshot) {
        const allUsers = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          allUsers.push(user);
        });
        setFilteredDataSource(allUsers);
        setMasterDataSource(allUsers);
        if (loading) {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('Error getting documents: ', error);
      });
  }

  useEffect(() => {
    fetchUSERS();
  }, []);

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => createChat(item)}>
      <View style={styles.row}>
        <Image source={{ uri: item.profile_picture }} style={styles.pic} />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.name ? item.name : item.username}
            </Text>
          </View>
          <View style={styles.msgContainer}>
            <Text style={styles.msgTxt}>{item.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <FlatList
        data={filteredDataSource}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={renderItem}
      />
      <Input
        placeholder="Pesquisar Novo Usuario"
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        leftIcon={<Icon name="search1" size={24} color="black" />}
      />
    </View>
  );
};

Issues.navigationOptions = {
  title: 'Chat',
};
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#777',
    fontSize: 12,
    marginLeft: 15,
  },
});

export default Issues;
