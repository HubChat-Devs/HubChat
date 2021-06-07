import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { FAB } from 'react-native-paper';
import { AntDesign as Icon } from '@expo/vector-icons';

const data = [
  { id: 1, name_issue: 'Issue Title #1', repo: 'Repo name', status: 'Closed' },
  { id: 2, name_issue: 'Issue Title #2', repo: 'Repo name', status: 'Open' },
  { id: 3, name_issue: 'Issue Title #3', repo: 'Repo name', status: 'Open' },
  { id: 4, name_issue: 'Issue Title #4', repo: 'Repo name', status: 'Closed' },
  { id: 5, name_issue: 'Issue Title #5', repo: 'Repo name', status: 'Open' },
  { id: 6, name_issue: 'Issue Title #6', repo: 'Repo name', status: 'Open' },
  { id: 7, name_issue: 'Issue Title #7', repo: 'Repo name', status: 'Open' },
  { id: 8, name_issue: 'Issue Title #8', repo: 'Repo name', status: 'Open' },
  { id: 9, name_issue: 'Issue Title #9', repo: 'Repo name', status: 'Open' },
  { id: 10, name_issue: 'Issue Title #10', repo: 'Repo name', status: 'Open' },
  { id: 11, name_issue: 'Issue Title #11', repo: 'Repo name', status: 'Open' },
];

const Issues = ({ navigation, route }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <View style={styles.row}>
        <Icon name="exclamationcircleo" size={30} color="black" />
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
              {item.name_issue}
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
        <Text style={styles.txtAlertBottom}>- Issues Assigneds -</Text>
      </View>
      <FAB
        style={styles.fab}
        icon="magnify"
        onPress={() => navigation.navigate('IssueSearch')}
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
