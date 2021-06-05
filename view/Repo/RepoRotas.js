import React from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { HeaderBackButton } from '@react-navigation/stack';
import { Octicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

import Issues from './RepoIssues';
import PullRequest from './RepoPullRequests';
import IssueSearch from './RepoIssueSearch';
import IssueCreate from './RepoCreateIssue';
import RepoPullRequestSearch from './RepoPullRequestSearch';
import signOutAsync from '../AfterLogin';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
function iconChange(item){
    if(!item.private){
      if(!item.fork){
        return (<Octicons name="repo" size={30}  style={{marginLeft:20,marginRight:15}} color="white" />)
        
      }else{
        return (<Octicons name="repo-forked" size={30} style={{marginLeft:20,marginRight:15}}  color="white" />)
      }
     }else{
       return (<Octicons name="lock" size={30}  style={{marginLeft:20,marginRight:15}} color="orange" />)
     }
}
function TabStack() {
  return (
    <Tab.Navigator
      initialRouteName="RepoIssues"
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
        name="RepoIssues"
        component={Issues}
        options={{
          tabBarLabel: ({ color, size }) => (
            <>
              <Octicons name="issue-opened" size={30} color={color} />
              <Text style={{ color: 'white', padding: 0, marginLeft: -5 }}>
                Issues
              </Text>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="RepoPullRequest"
        component={PullRequest}
        options={{
          tabBarLabel: ({ color, size }) => (
            <>
              <Octicons name="git-pull-request" size={30} color={color} />
              <Text style={{ color: 'white', padding: 0 , marginLeft: -20}}>Pull Request</Text>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Rotas({ route, navigation }) {
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
        options={{
          headerTitle: (props) => (
            <View {...props} style={styles.row} >
              {iconChange(route.params.item)}
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {route.params.item.name}
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{route.params.item.full_name}</Text>
                </View>
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="RepoIssueSearch"
        component={IssueSearch}
        options={{
          headerTitle: (props) => (
            <View {...props} style={styles.row} >
              <Octicons name="issue-opened" size={30}  color="white" />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Issue Search
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{route.params.item.full_name}</Text>
                </View>
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="RepoPullRequestSearch"
        component={RepoPullRequestSearch}
        options={{
          headerTitle: (props) => (
            <View {...props} style={styles.row} >
              <Octicons name="issue-opened" size={30}  color="white" />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Repo Pull Request Search
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{route.params.item.full_name}</Text>
                </View>
              </View>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="RepoIssueCreate"
        component={IssueCreate}
         options={{
           headerTitle: (props) => (
            <View {...props} style={styles.row} >
              <Octicons name="issue-opened" size={30}  color="white" />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    Nova Issue
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{route.params.item.full_name}</Text>
                </View>
              </View>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
const styles = StyleSheet.create({
  msgContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
    row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  nameContainer: {
    marginLeft:8 ,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  nameTxt: {
    fontWeight: '600',
    color: 'white',
    fontSize: 18,
  },
});

export default Rotas;
