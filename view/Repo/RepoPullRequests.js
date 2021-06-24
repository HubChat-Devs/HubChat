import React, { useState, useEffect , useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  RefreshControl,
} from 'react-native';
import Loading from '../../components/Loading';
import { FAB } from 'react-native-paper';
import { Octicons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

function iconChange(item){
    if(!item.merged_at){
      if(item.status != "Open"){
        return (<Icon name="git-pull-request" size={30} color="red" />)
        
      }else{
        return (<Icon name="git-pull-request" size={30} color="green" />)
      }
     }else{
       return (<Icon name="git-merge" size={30} color="#a371f7" />)
     }
}

const Issues = ({ navigation, route }) => {
  const { repo } = route.params;
  const [pullsData, setPullsData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    PullsData(repo);
  }, [PullsData,repo]);
  const [loading, setLoading] = useState(true);


  const PullsData = useCallback(async (repo) => {
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
      const repos = fetch('https://api.github.com/repos/'+repo.owner+'/'+repo.name+'/pulls?state=all', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token ' + token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let pulls = [];
          data.forEach((pull) =>
            pulls.push({
              id: pull.id,
              title: pull.title,
              status: (pull.state.charAt(0).toUpperCase() + pull.state.slice(1)),
              branches: pull.head.ref +" -> "+ pull.base.ref,
              html_url: pull.html_url,
              merged_at: pull.merged_at
            })
          );
          setPullsData(pulls);
          setRefreshing(false);
           if (loading) {
          setLoading(false);
        }
        })
        .catch((err) => console.error(err));
    }
  },[loading])

  useEffect(() => {
    PullsData(repo);
  }, [PullsData,repo]);
  if (loading) {
    return <Loading />;
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.html_url)}>
      <View style={styles.row}>
        {iconChange(item)}
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.mblTxt}>{item.status}</Text>
          </View>
          <View style={styles.msgContainer}>
            <Text style={styles.msgTxt}>{item.branches}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          data={pullsData}
           refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderItem}
        />
        <Text style={styles.txtAlertBottom}>- Repo Pull Requests-</Text>
      </View>
      <FAB
        style={styles.fab}
        icon="magnify"
        onPress={() => navigation.navigate('RepoPullRequestSearch' , {repo})}
      />
    </>
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
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
  txtAlertBottom: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
    fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor:"#71e7f0"
  },
});

export default Issues;
