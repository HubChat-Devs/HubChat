import React, { setState, useState, useEffect } from 'react';
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
import Loading from '../components/Loading';
import { AntDesign as Icon } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import moment from 'moment';
import firebase from '../firebase/fire';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';
const db = firebase.firestore();

function LastmessageDate(DateLastMessage) {
  //console.log(DateLastMessage)
  var m1 = moment(DateLastMessage, 'YYYY-MM-DDThh:mm');
  var m2 = moment(moment().format());

  var m3 = m2.diff(m1, 'minutes');

  var numdays = Math.floor(m3 / 1440);
  var numhours = Math.floor((m3 % 1440) / 60);
  var numminutes = Math.floor((m3 % 1440) % 60);

  if (numminutes == 0 && numhours == 0 && numdays == 0) {
    return 'Agora';
  } else if (numhours == 0 && numdays == 0) {
    return numminutes + ' Minutos Atrás';
  } else if (numdays == 0) {
    return moment(DateLastMessage).format('HH:mm');
  } else if (numdays == 1) {
    return 'Ontem';
  } else if (numdays == 2) {
    return 'Anteontem';
  } else {
    return numdays + ' Dias Atrás';
  }
}

const Chats = ({ route, navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserGit, setCurrentUserGit] = useState({});

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
          console.log(data.login);
          setUserGit(data);
        })
        .catch((err) => console.error(err));
    }
  }

  async function fetchChats() {
    const unsubscribe = db
      .collection('CHATS')
      .where('members', 'array-contains', firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const chatsQuery = querySnapshot.docs.map((documentSnapshot) => {
          console.log(
            'teste ',
            documentSnapshot.data().id,
            ' : ',
            currentUserGit.id," -  ",
            documentSnapshot.id
          );
          return {
            _id:
              documentSnapshot.id,
            // give defaults
            name:
              documentSnapshot.data().id != currentUserGit.id
                ? documentSnapshot.data().username
                : documentSnapshot.data().username2,

            profile_picture:
              documentSnapshot.data().id != currentUserGit.id
                ? documentSnapshot.data().picture
                : documentSnapshot.data().picture2,
            latestMessage: {
              text: '',
            },
            members: [],
            ...documentSnapshot.data(),
          };
        });

        setChats(chatsQuery);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }
  useEffect(() => {
    if (currentUserGit.login == null) {
      console.log('Atualizando User');
      UserData(setCurrentUserGit);
    } else {
      fetchChats(currentUserGit);
    }
  }, [currentUserGit]);

  if (loading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat',{chat: item})}>
        <View style={styles.row}>
          <Image source={{ uri: item.profile_picture }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text
                style={styles.nameTxt}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.mblTxt} numberOfLines={1}>
                {LastmessageDate(moment(item.latestMessage.createdAt).format())}
              </Text>
            </View>

            <View style={styles.msgContainer}>
              <Text
                style={[styles.msgTxt, { width: 160 }]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.latestMessage.text}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <FlatList
        data={chats}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
      <FAB
        style={styles.fab}
        icon="message-plus-outline"
        onPress={() => navigation.navigate('NewChat')}
      />
    </View>
  );
};

Chats.navigationOptions = {
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
    flex: 1,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#71e7f0',
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
});

export default Chats;