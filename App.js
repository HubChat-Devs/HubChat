import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from './firebase/fire';
import AfterLogin from './view/AfterLogin';
import Rotas from './Rotas';
import SignInScreen, { signInAsync } from './view/SignIn';
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();
const GithubStorageKey = '@Expo:GithubToken';
const AfterLog = '@Expo:AfterLog'; //lolz whatever you want.



async function attemptToRestoreAuthAsync() {
  let token = await AsyncStorage.getItem(GithubStorageKey);
  if (token) {
    
    return signInAsync(token);
  }
}
async function logonAsync(setAfterLogon) {
  let logon = await AsyncStorage.getItem(AfterLog);
  if (logon) {
    
    setAfterLogon(true);
  } else {
    
    setAfterLogon(false);
  }
}

function MyComponent(props) {
  const [isSignedIn, setisSignedIn] = useState(false);
  const [afterLogon, setAfterLogon] = useState(false);

  useEffect(() => {
    
    firebase.auth().onAuthStateChanged(async (auth) => {
      const authen = !!auth;
      setisSignedIn(authen);
      if (!isSignedIn) {
        attemptToRestoreAuthAsync(setAfterLogon);
      }
    });
    logonAsync(setAfterLogon);
  }, [isSignedIn, setAfterLogon, afterLogon]);
  
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        {isSignedIn ? (
          <>
            {afterLogon ? (
              
              <Stack.Screen name="Rotas" component={Rotas} />
            ) : (
              <Stack.Screen
                name="AfterLogin"
                component={AfterLogin}
                  initialParams={{
                  user: firebase.auth().currentUser,
                  firebase,
                  setAfterLogon,
                }}
              />
            )}
          </>
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} initialParams={{ setisSignedIn }}/>
        )}
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
    
  );
}
export default MyComponent;
