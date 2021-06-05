import React, { useState, useEffect } from 'react';
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
import { AntDesign as Icon } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';

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

const data = [
  {
    id: 1,
    name: 'Repo Name #1',
    full_name: 'user/Repo Name #1',
    private: false,
    fork: false,
  },
  {
    id: 2,
    name: 'Repo Name #2',
    full_name: 'user/Repo Name #2',
    private: true,
    fork: false,
  },
  {
    id: 3,
    name: 'Repo Name #3',
    full_name: 'user/Repo Name #3',
    private: false,
    fork: false,
  },
  {
    id: 4,
    name: 'Repo Name #4',
    full_name: 'user/Repo Name #4',
    private: false,
    fork: false,
  },
  {
    id: 5,
    name: 'Repo Name #5',
    full_name: 'user/Repo Name #5',
    private: false,
    fork: false,
  },
  {
    id: 6,
    name: 'Repo Name #6',
    full_name: 'user/Repo Name #6',
    private: false,
    fork: false,
  },
  {
    id: 7,
    name: 'Repo Name #7',
    full_name: 'user/Repo Name #7',
    private: false,
    fork: false,
  },
  {
    id: 8,
    name: 'Repo Name #8',
    full_name: 'user/Repo Name #8',
    private: false,
    fork: false,
  },
  {
    id: 9,
    name: 'Repo Name #9',
    full_name: 'user/Repo Name #9',
    private: false,
    fork: false,
  },
  {
    id: 10,
    name: 'Repo Name #10',
    full_name: 'user2/Repo Name #10',
    private: false,
    fork: true,
  },
  {
    id: 11,
    name: 'Repo Name #11',
    full_name: 'user2/Repo Name #11',
    private: false,
    fork: true,
  },
];

const IssuesSearch = ({ route, navigation }) => {
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    setFilteredDataSource(data);
    setMasterDataSource(data);
  }, []);

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
    <TouchableOpacity onPress={() => navigation.navigate('RepoRotas',{item: item })}>
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
        placeholder="Pesquisar Repositórios"
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        leftIcon={<Icon name="search1" size={24} color="black" />}
      />
    </View>
  );
};

IssuesSearch.navigationOptions = {
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

export default IssuesSearch;
