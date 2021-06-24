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
import { AntDesign as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

const Issues = ({ navigation, route }) => {
  const { repo } = route.params;
  const [issuesData, setIssuesData] = useState([]);
  const [FABstate, setFABState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setFABState({ open });
  const { open } = FABstate;
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    IssuesData(repo);
  }, [IssuesData,repo]);
  const [loading, setLoading] = useState(true);


  const IssuesData = useCallback(async (repo) => {
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
      const repos = fetch('https://api.github.com/repos/'+repo.owner+'/'+repo.name+'/issues', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: 'token ' + token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let issues = [];
          data.forEach((issue) =>
          !issue.pull_request &&
            issues.push({
              id: issue.id,
              name_issue: issue.title,
              status: (issue.state.charAt(0).toUpperCase() + issue.state.slice(1)),
              number: issue.number,
              repo: repo.full_name,
              html_url: issue.html_url
            })
          );
          setIssuesData(issues);
          setRefreshing(false);
           if (loading) {
          setLoading(false);
        }
        })
        .catch((err) => console.error(err));
    }
  },[loading])

  useEffect(() => {
    IssuesData(repo);
  }, [IssuesData,repo]);
  if (loading) {
    return <Loading />;
  }
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => Linking.openURL(item.html_url)}>
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
          data={issuesData}
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
        <Text style={styles.txtAlertBottom}>- Repo Issues-</Text>
      </View>
      <FAB.Group
        open={open}
        fabStyle={styles.fab}
        icon={open ? 'close' : 'menu-open'}
        actions={[
          {
            icon: 'magnify',
            onPress: () => navigation.navigate('RepoIssueSearch' , {repo}),
          },
          {
            icon: 'plus',
            onPress: () => navigation.navigate('RepoIssueCreate',{onRefresh , repo}),
          },
        ]}
        onStateChange={onStateChange}
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
    backgroundColor:"#3485E4",
  },
});

export default Issues;
