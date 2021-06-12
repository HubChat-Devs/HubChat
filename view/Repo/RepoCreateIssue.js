import React from 'react';
import {
  View
} from 'react-native';
import * as yup from 'yup';
import { Button ,TextInput} from 'react-native-paper';

const TextInputBorder = (props) => {
  return (
    <View>
      <TextInput
        {...props}
        editable
        maxLength={300}
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
          mode='outlined'
          numberOfLines={1}
          onChangeText={(text) => onChangeTitle(text)}
          value={title}
          placeholder="- Title -"
          label="Nome da Nova issue"
          title="Nome da Nova issue: "
        />
      </View>
      <View
        style={{
          padding: 10,
        }}>
        <TextInputBorder
          multiline
          mode='outlined'
          numberOfLines={14}
          onChangeText={(text) => onChangeBody(text)}
          value={body}
          placeholder="- Body -"
          label="Descrição"
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
          color="rgb(113, 231, 240)"
          uppercase={false}
          onPress={() => navigation.navigate('RepoIssues')}>
          Criar Issue
        </Button>
      </View>
    </View>
  );
};
export default CreateIssue;
