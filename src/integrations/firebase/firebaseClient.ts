import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getEnvConfig } from '../../core/config/env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export const initializeFirebase = () => {
  const config = getEnvConfig();
  
  if (!config.firebase.apiKey || !config.firebase.projectId) {
    console.warn('Firebase configuration missing, using mock mode');
    return null;
  }

  try {
    app = initializeApp(config.firebase);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    return app;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return null;
  }
};

export const getFirebaseAuth = (): Auth | null => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseFirestore = (): Firestore | null => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

export const getFirebaseStorage = (): FirebaseStorage | null => {
  if (!storage) {
    initializeFirebase();
  }
  return storage;
};