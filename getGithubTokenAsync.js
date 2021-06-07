import * as AuthSession from 'expo-auth-session';
import {AsyncStorage } from '@react-native-async-storage/async-storage';

// Make an app https://github.com/settings/applications/new
// Firebase Docs: https://firebase.google.com/docs/auth/web/github-auth

// The github auth callback should be something like: https://auth.expo.io/@bacon/github
const REDIRECT_URL = AuthSession.getRedirectUrl(); //AuthSession.makeRedirectUri();
const GithubStorageKey = '@Expo:GithubToken';

// Add your API stuff here...
const github = {
  id: '9a007c4810bc6d66bb27',
  secret: 'f0857862e71cca9228195f82d84f3e99bec6ca37',
};

const githubFields = [
  'user',
  'public_repo',
  'repo',
  'repo_deployment',
  'repo:status',
  'read:repo_hook',
  'read:org',
  'read:public_key',
  'read:gpg_key',
];

function authUrlWithId(id, fields) {
  return (
    `https://github.com/login/oauth/authorize` +
    `?client_id=${id}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URL)}` +
    `&scope=${encodeURIComponent(fields.join(' '))}`
  );
}

async function createTokenWithCode(code) {
  const url =
    `https://github.com/login/oauth/access_token` +
    `?client_id=${github.id}` +
    `&client_secret=${github.secret}` +
    `&code=${code}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}
async function teste() {
  let token = await AsyncStorage.getItem(GithubStorageKey);
  const url =
    `https://api.github.com/user`;

  const res = await fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Authorization': 'token '+ token,
    },
  });

  return res.json();
}

async function getGithubTokenAsync() {
  try {
    const { type, params } = await AuthSession.startAsync({
      authUrl: authUrlWithId(github.id, githubFields),
    });
    console.log('getGithubTokenAsync: A: ', { type, params });
    if (type !== 'success') {
      // type === 'cancel' = if you cancel out of the modal
      // type === 'error' = if you click "no" on the redirect page
      return null;
    }
    // this is different to `type === 'error'`
    if (params.error) {
      const { error, error_description, error_uri } = params;
      /*
        If you didn't set the URI to match `REDIRECT_URL` in `https://github.com/settings/applications/...`
        error: "redirect_uri_mismatch",
        error_description: "The redirect_uri MUST match the registered callback URL for this application.",
      */
      if (error === 'redirect_uri_mismatch') {
        console.warn(
          `Please set the "Authorization callback URL" in your Github application settings to ${REDIRECT_URL}`
        );
      }
      throw new Error(`Github Auth: ${error} ${error_description}`);
    }

    const { token_type, scope, access_token } = await createTokenWithCode(
      params.code
    );
    // { token_type, scope, access_token }
    console.log('getGithubTokenAsync: B: ', {
      token_type,
      scope,
      access_token,
    });
    console.log(teste(access_token))
    return access_token;
  } catch ({ message }) {
    throw new Error(`Github Auth: ${message}`);
  }
}

export default getGithubTokenAsync;
