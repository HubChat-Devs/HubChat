import React, { useState, useEffect ,useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Input } from 'react-native-elements';
import { Octicons as Icon } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Loading from '../../components/Loading';
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

const IssuesSearch = ({ route, navigation }) => {
  const { repo } = route.params;
  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

const IssuesData = useCallback(async (repo,filter) => {
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
          setFilteredDataSource(pulls);
          setMasterDataSource(pulls);
          if (loading) {
            setLoading(false);
          }
        })
        .catch((err) => console.error(err));
    }
  },[loading])

  useEffect(() => {
    IssuesData(repo,filter);
  }, [IssuesData,repo, filter]);
  
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
        const itemData = item.title
          ? item.title.toUpperCase()
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
    <TouchableOpacity>
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
        placeholder="Pesquisar Pull Request"
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        leftIcon={<AntDesign name="search1" size={24} color="black" />}
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
});

export default IssuesSearch;
