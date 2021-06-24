import React, { useState, useEffect , useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { AntDesign as Icon } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';
import Loading from '../components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

function iconChange(item) {
  if (!item.private) {
    if (!item.fork) {
      return <Octicons name="repo" size={30} color="black" />;
    } else {
      return <Octicons name="repo-forked" size={30} color="black" />;
    }
  } else {
    return <Octicons name="lock" size={30} color="orange" />;
  }
}

const ReposSearch = ({ route, navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const ReposData = useCallback(async () => {
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
      const repos = fetch('https://api.github.com/user/repos?sort=updated', {
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
              owner: repo.owner.login,
            })
          );
          setFilteredDataSource(repos);
          setMasterDataSource(repos);
           if (loading) {
          setLoading(false);
        }
        })
        .catch((err) => console.error(err));
    }
  },[loading])

  useEffect(() => {
    ReposData();
  }, [ReposData]);

    if (loading) {
    return <Loading />;
  }

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.full_name
          ? item.full_name.toUpperCase()
          : ''.toUpperCase();
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
    <TouchableOpacity
      onPress={() => navigation.navigate('RepoRotas', { repo: item  })}>
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
        placeholder="Pesquisar Repositório"
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        leftIcon={<Icon name="search1" size={24} color="black" />}
      />
    </View>
  );
};

ReposSearch.navigationOptions = {
  title: 'ReposSearch',
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
});

export default ReposSearch;
