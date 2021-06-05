import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import * as yup from 'yup';
import { Button, Colors } from 'react-native-paper';

const TextInputBorder = (props) => {
  return (
    <View>
      <Text style={[styles.baseText, { fontSize: 20, marginBottom: 8 }]}>
        {props.title}
      </Text>
      <TextInput
        {...props}
        editable
        maxLength={300}
        style={{ borderWidth: 2, borderRadius: 10, padding: 15 }}
      />
    </View>
  );
};

const CreateIssue = ({ route, navigation }) => {
  const [title, onChangeTitle] = React.useState('');
  const [body, onChangeBody] = React.useState('');

  // If you type something in the text box that is a color, the background will change to that
  // color.
  return (
    <View>
      <View
        style={{
          padding: 10,
        }}>
        <TextInputBorder
          autoFocus
          numberOfLines={1}
          onChangeText={(text) => onChangeTitle(text)}
          value={title}
          placeholder="- Title -"
          title="Nome da Nova issue: "
        />
      </View>
      <View
        style={{
          padding: 10,
        }}>
        <TextInputBorder
          multiline
          numberOfLines={14}
          onChangeText={(text) => onChangeBody(text)}
          value={body}
          placeholder="- Body -"
          title="Descrição : "
        />
      </View>
      <View
        style={{
          padding: 10,
        }}>
        <Button
          icon="plus"
          mode="contained"
          color="#3485E4"
          uppercase={false}
          onPress={() => navigation.navigate('RepoIssues')}>
          Criar Issue
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontWeight: 'bold',
  },
});

export default CreateIssue;
