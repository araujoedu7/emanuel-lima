// Firebase core
import { initializeApp } from "firebase/app";

// Serviços
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDQlECIYTEhh-pfRJC7UVMD_YYVGUBtY28",
  authDomain: "emanuel-lima.firebaseapp.com",
  projectId: "emanuel-lima",
  storageBucket: "emanuel-lima.firebasestorage.app",
  messagingSenderId: "1075341465658",
  appId: "1:1075341465658:web:f419f07882fc27d0213d03"
};

// Inicializa
const app = initializeApp(firebaseConfig);

// Serviços
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta
export { auth, db };