import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Octicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

import Issues from './RepoIssues';
import PullRequest from './RepoPullRequests';
import IssueSearch from './RepoIssueSearch';
import IssueCreate from './RepoCreateIssue';
import RepoPullRequestSearch from './RepoPullRequestSearch';

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
function TabStack({route}) {
  const { repo } = route.params;
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
        initialParams={{repo}}
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
        initialParams={{repo}}
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
  const { repo } = route.params;
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
        initialParams={{repo: repo}}
        options={{
          headerTitle: (props) => (
            <View {...props} style={styles.row} >
              {iconChange(repo)}
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {repo.name}
                  </Text>
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.msgTxt}>{repo.full_name}</Text>
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
                  <Text style={styles.msgTxt}>{repo.full_name}</Text>
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
              <Octicons name="git-pull-request" size={30}  color="white" />
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
                  <Text style={styles.msgTxt}>{repo.full_name}</Text>
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
                  <Text style={styles.msgTxt}>{repo.full_name}</Text>
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
