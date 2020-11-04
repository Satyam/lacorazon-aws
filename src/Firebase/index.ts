import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/database';

import config from './firebase.config';

firebase.initializeApp(config);

export default firebase;

export const db = firebase.database();

export const auth = firebase.auth();
auth.useDeviceLanguage();
