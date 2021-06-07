import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { Octicons as Icon } from '@expo/vector-icons';

function iconChange(item){
    if(!item.merged_at){
      if(item.state != "open"){
        return (<Icon name="git-pull-request" size={30} color="red" />)
        
      }else{
        return (<Icon name="git-pull-request" size={30} color="green" />)
      }
     }else{
       return (<Icon name="git-merge" size={30} color="#a371f7" />)
     }
}
const data = [
  { id: 1, title: 'Pull Request #1', repo: 'master -> teste', state:"closed" ,merged_at:"not null"},
  { id: 2, title: 'Pull Request #2', repo: 'master -> teste', state:"open" ,merged_at:"not null"},
  { id: 3,  title: 'Pull Request #3', repo: 'master -> teste', state:"open" ,merged_at:null},
  { id: 4, title: 'Pull Request #4', repo: 'master -> teste', state:"closed"  ,merged_at:null},
];

const Issues = ({ navigation, route }) => {
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
            <Text style={styles.msgTxt}>{item.repo}</Text>
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
        <Text style={styles.txtAlertBottom}>- Repo Pull Requests-</Text>
      </View>
      <FAB
        style={styles.fab}
        icon="magnify"
        onPress={() => navigation.navigate('RepoPullRequestSearch')}
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
