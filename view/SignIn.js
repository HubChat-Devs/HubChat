import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import IconButton from '../components/IconButton';
import signInAsync from '../firebase/signIn';

const SignIn = ({ route, navigation }) => (
  <View style={styles.container}>
    <Text style={styles.logo}>HubChat</Text>

    <TouchableOpacity  >
      <IconButton style={styles.loginBtn}
        name="github"
        onPress={() => signInAsync()}>
        Entrar Com GitHub
      </IconButton>
    </TouchableOpacity>
  </View>
);

SignIn.navigationOptions = {
  title: 'SignIn',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#3485E4",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },

});

export default SignIn;
