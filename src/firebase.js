import firebase from 'firebase/app';
import config from './config/firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const Firebase = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

export default Firebase;