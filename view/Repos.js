import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { Octicons as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

function iconChange(item) {
  if (!item.private) {
    if (!item.fork) {
      return <Icon name="repo" size={30} color="black" />;
    } else {
      return <Icon name="repo-forked" size={30} color="black" />;
    }
  } else {
    return <Icon name="lock" size={30} color="orange" />;
  }
}
const Repos = ({ navigation, route }) => {
  const [reposData, setReposData] = useState([]);
  async function ReposData(setReposData) {
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
      const repos = fetch('https://api.github.com/user/repos', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token ' + token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let repos = [];
          data.forEach((repo) =>
            repos.push({
              id: repo.id,
              name: repo.name,
              full_name: repo.full_name,
              private: repo.private,
              fork: repo.fork,
            })
          );
          setReposData(repos);
        })
        .catch((err) => console.error(err));
    }
  }
  useEffect(() => {
    ReposData(setReposData);
  }, [setReposData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('RepoRotas', { item: item })}>
      <View style={styles.row}>
        {iconChange(item)}
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </View>
          <View style={styles.msgContainer}>
            <Text style={styles.msgTxt}>{item.full_name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          data={reposData}
          keyExtractor={(item) => {
            return item.id;
          }}
          renderItem={renderItem}
        />
        <Text style={styles.txtAlertBottom}>- Repos -</Text>
      </View>
      <FAB
        style={styles.fab}
        icon="magnify"
        onPress={() => navigation.navigate('Repositorio Search')}
      />
    </>
  );
};

Repos.navigationOptions = {
  title: 'Repos',
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
    backgroundColor: '#71e7f0',
  },
});

export default Repos;
