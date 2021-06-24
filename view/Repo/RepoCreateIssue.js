import React from 'react';
import { View, Text } from 'react-native';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
const GithubStorageKey = '@Expo:GithubToken';

const createIssueSchema = yup.object().shape({
  title: yup.string().required('Titulo é Obrigatório !'),
  body: yup.string(),
});

const TextInputBorder = (props) => {
  return (
    <View>
      <TextInput {...props} editable maxLength={300} />
    </View>
  );
};

const CreateIssue = ({ route, navigation }) => {
  const { repo , onRefresh} = route.params;

  async function createIssue(repo, title, body) {
    const data = {
      title,
      body,
    };
    let token = await AsyncStorage.getItem(GithubStorageKey);
    if (token) {
      const repos = fetch(
        'https://api.github.com/repos/' +
          repo.owner +
          '/' +
          repo.name +
          '/issues',
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: 'token ' + token,
          },
        }
      )
        .then(async (response) => {
          const isJson = response.headers
            .get('content-type')
            ?.includes('application/json');
          const data = isJson && (await response.json());

          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            navigation.goBack();
            route.params.onRefresh();
          }
        })
        .catch((error) => {
          this.setState({ errorMessage: error.toString() });
          console.error('There was an error!', error);
        });
    }
  }

  return (
    <Formik
      validationSchema={createIssueSchema}
      initialValues={{ title: '', body: '' }}
      onSubmit={(values) => {
        console.log('Title :' + values.title, 'Body: ' + values.body);
        createIssue(repo, values.title, values.body);
      }}>
      {({ handleChange, handleSubmit, values, errors, isValid }) => (
        <View>
          <View
            style={{
              padding: 10,
            }}>
            <TextInputBorder
              autoFocus
              mode="outlined"
              numberOfLines={1}
              onChangeText={handleChange('title')}
              value={values.title}
              error={errors.title}
              placeholder="- Title -"
              name="title"
              label="Nome da Nova issue"
              title="Nome da Nova issue: "
            />
            {errors.title && (
              <Text style={{ fontSize: 17, color: 'red' }}>{errors.title}</Text>
            )}
          </View>
          <View
            style={{
              padding: 10,
            }}>
            <TextInputBorder
              multiline
              mode="outlined"
              numberOfLines={14}
              onChangeText={handleChange('body')}
              error={errors.body}
              value={values.body}
              placeholder="- Body -"
              name="body"
              label="Descrição"
              title="Descrição : "
            />
            {errors.body && (
              <Text style={{ fontSize: 17, color: 'red' }}>{errors.body}</Text>
            )}
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
              disabled={!isValid}
              onPress={handleSubmit}>
              Criar Issue
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};
export default CreateIssue;
