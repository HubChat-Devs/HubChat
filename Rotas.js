import React from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { Octicons,Entypo,EvilIcons} from '@expo/vector-icons';
import 'react-native-gesture-handler';

import Chats from './view/Chats';
import Chat from './view/Chat';
import NewChat from './view/NewChat';
import Issues from './view/Issues';
import Repos from './view/Repos';
import Calendario from './view/Calendario'
import ReposSearch from './view/ReposSearch';
import ReposRotas from './view/Repo/RepoRotas'
import IssueSearch from './view/IssueSearch';
import Minha_Conta from './view/MyAccountList';
import MyProfile from './view/MyProfile';
import signOutAsync from './view/AfterLogin';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName="Chats"
      tabBarOptions={{
        activeTintColor: '#FFFFFF',
        inactiveTintColor: '#F8F8F8',
        style: {
          backgroundColor: '#000000',
        },
        labelStyle: {
          textAlign: 'center',
        },
        indicatorStyle: {
          borderBottomColor: '#71e7f0',
          borderBottomWidth: 2,
        },
      }}>
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarLabel:({ color, size }) => <><Entypo name="chat" size={30} color={color} /><Text style={{color:'white', padding: 0}} >Chats</Text></>,
        }}
      />
      <Tab.Screen
        name="Repositorios"
        component={Repos}
        options={{
          tabBarLabel: ({ color, size }) => <><Octicons name="repo" size={30} color={color} /><Text style={{color:'white', padding: 0,marginLeft:-6}} >Repos</Text></>,
        }}
      />
      <Tab.Screen
        name="Issues"
        component={Issues}
        options={{
          tabBarLabel: ({ color, size }) => <><Octicons name="issue-opened" size={30} color={color} /><Text style={{color:'white', padding: 0,marginLeft:-5}} >Issues</Text></>,
        }}
      />
      <Tab.Screen
        name="Minha Conta"
        component={Minha_Conta}
        options={{
          tabBarLabel: ({ color, size }) => <><EvilIcons name="gear" size={30} color={color}/><Text style={{color:'white', padding: 0}} >Tools</Text></>,
        }}
      />
    </Tab.Navigator>
  );
}

function Rotas() {
  return (
    <Stack.Navigator
      initialRouteName="TabStack"
      screenOptions={{
        headerStyle: { backgroundColor: '#000000' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}>
      <Stack.Screen
        name="TabStack"
        component={TabStack}
        options={{ title: 'HubChat' }}
      />

      <Stack.Screen name="NewChat" component={NewChat} headerMode="none" />
      <Stack.Screen name="IssueSearch" component={IssueSearch} headerMode="none" />
      <Stack.Screen name="Repositorio Search" component={ReposSearch} headerMode="none" />
      <Stack.Screen name="RepoRotas" component={ReposRotas} options={{headerShown: false}} />
      <Stack.Screen name="My Profile" component={MyProfile}  options={{ title: 'Meu Perfil' }} />
      <Stack.Screen name="Calendario" component={Calendario} />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          headerTitle: (props) => (
            <View  style={styles.row} >
              <Image source={{ uri: route.params.chat.profile_picture }} style={styles.pic} />
                <View style={[styles.nameContainer,{}]}>
                  <Text
                    style={[styles.nameTxt,{}]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {route.params.chat.name}
                  </Text>
              </View>
            </View>
          )
        })}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
    row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  nameTxt: {
    paddingLeft:8 ,
    fontWeight: '600',
    color: 'white',
    fontSize: 18,
  },
  pic: {
    borderRadius: 30,
    width: 40,
    height: 40,
    marginRight:8,
  },
});

export default Rotas;
