import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { FontAwesome as Icon } from '@expo/vector-icons';
import firebase from '../firebase/fire';

export default function RoomScreen({ route, navigation }) {
  const { chat } = route.params;
  const currentUser = firebase.auth().currentUser;
  const [messages, setMessages] = useState([]);
  async function handleSend(messages) {
    const text = messages[0].text;

    firebase.firestore()
      .collection('CHATS')
      .doc(chat._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
          avatar: currentUser.photoURL
        }
      });

    await firebase.firestore()
      .collection('CHATS')
      .doc(chat._id)
      .set(
        {
          latestMessage: {
            _id: currentUser.uid,
            text,
            createdAt: new Date().getTime()
          }
        },
        { merge: true }
      );
  }

  useEffect(() => {
    console.log(chat._id)
    const messagesListener = firebase.firestore()
      .collection('CHATS')
      .doc(chat._id)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messages = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email
            };
          }

          return data;
        });

        setMessages(messages);
      });

    // Stop listening for updates whenever the component unmounts
    return () => messagesListener();
  }, [chat._id]);

  return (
    <GiftedChat
      messages={messages}
      onSend={handleSend}
      user={{ _id: currentUser.uid }}
      scrollToBottom
      placeholder="Escreva uma mensagem..."
      renderSend={(props) => {
        //Add the extra styles via containerStyle
        return (
          <Send {...props}>
            <View
              style={{
                alignitems: 'center',
                marginRight: 5,
                marginBottom: 10,
              }}>
              <Icon name="send-o" size={30} color="black" />
            </View>
          </Send>
        );
      }}
    />
  );
}
