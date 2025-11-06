// src/firebase/firebaseConfig.js

// Importações do Firebase
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyCjjPcelpQgjd9_5P7WHCAKl6InZWfjubs",
  authDomain: "app-barbeqr.firebaseapp.com",
  projectId: "app-barbeqr",
  storageBucket: "app-barbeqr.appspot.com",
  messagingSenderId: "598398470149",
  appId: "1:598398470149:web:06a1a9d768082b4f87746c",
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth com persistência usando AsyncStorage (mantém login no app)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializa Firestore
const db = getFirestore(app);

// Exporta para usar em outras partes do app
export { auth, db };

