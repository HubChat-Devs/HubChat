import React, { setState, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
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
  const [membersChats, setMembersChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserGit, setCurrentUserGit] = useState({});

  async function excluirChat(chat) {
    db.collection('CHATS')
      .doc(chat)
      .collection('MESSAGES')
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });
    await db.collection('CHATS').doc(chat).delete();
  }
  const excluirChatButton = (chat) =>
    Alert.alert('Excluir Chat', 'Deseja Excluir o Chat ? ', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => excluirChat(chat) },
    ]);

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

  const fetchChats = useCallback(() => {
    const unsubscribe = db
      .collection('CHATS')
      .where('members', 'array-contains', firebase.auth().currentUser.uid)
      .onSnapshot((querySnapshot) => {
        const chatsQ = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
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
        setChats(
          chatsQ.sort((a, b) =>
            a.latestMessage.createdAt < b.latestMessage.createdAt ? 1 : -1
          )
        );

        let member = [];
        chatsQ.forEach((membersID) => {
          membersID.members.forEach((memberUID) => {
            if (memberUID != firebase.auth().currentUser.uid) {
              member.push(memberUID);
            }
          });
        });
        member.push(firebase.auth().currentUser.uid);
        setMembersChats(member);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, [loading, currentUserGit.id]);

  useEffect(() => {
    async function fetchData() {
      if (currentUserGit.login == null) {
        console.log('Atualizando User');
        await UserData(setCurrentUserGit);
      } else {
        await fetchChats(currentUserGit);
      }
    }
    fetchData();
  }, [fetchChats, currentUserGit]);

  if (loading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('Chat', { chat: item })}
        onLongPress={() => excluirChatButton(item._id)}>
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
      {!chats[0] ? (
        <View style={styles.noChats}>
          <Text style={styles.txtAlertBottom}>
            <Icon name="frowno" size={20} /> Seja Mais Sociável
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <FAB
        style={styles.fab}
        icon="message-plus-outline"
        onPress={() => navigation.navigate('NewChat', { membersChats })}
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
  noChats: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtAlertBottom: {
    fontWeight: '200',
    color: '#777',
    fontSize: 17,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
});

export default Chats;
