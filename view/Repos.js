import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { Octicons as Icon } from '@expo/vector-icons';

function iconChange(item){
    if(!item.private){
      if(!item.fork){
        return (<Icon name="repo" size={30} color="black" />)
        
      }else{
        return (<Icon name="repo-forked" size={30} color="black" />)
      }
     }else{
       return (<Icon name="lock" size={30} color="orange" />)
     }
}

const data = [
  { id: 1, name: 'Repo Name #1', full_name: 'user/Repo Name #1', private: false , fork: false },
  { id: 2, name: 'Repo Name #2', full_name: 'user/Repo Name #2', private: true , fork: false },
  { id: 3, name: 'Repo Name #3', full_name: 'user/Repo Name #3', private: false , fork: false },
  { id: 4, name: 'Repo Name #4', full_name: 'user/Repo Name #4', private: false , fork: false },
  { id: 5, name: 'Repo Name #5', full_name: 'user/Repo Name #5', private: false , fork: false },
  { id: 6, name: 'Repo Name #6', full_name: 'user/Repo Name #6', private: false , fork: false },
  { id: 7, name: 'Repo Name #7', full_name: 'user/Repo Name #7', private: false , fork: false },
  { id: 8, name: 'Repo Name #8', full_name: 'user/Repo Name #8', private: false , fork: false },
  { id: 9, name: 'Repo Name #9', full_name: 'user/Repo Name #9', private: false , fork: false },
  { id: 10, name: 'Repo Name #10', full_name: 'user2/Repo Name #10', private: false , fork: true },
  { id: 11, name: 'Repo Name #11', full_name: 'user2/Repo Name #11', private: false , fork: true },
];

const Repos = ({ navigation, route }) => {
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
    <>
      <View style={{ flex: 1 }}>
        <FlatList
          data={data}
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
    backgroundColor:"#71e7f0"
  },
});

export default Repos;
