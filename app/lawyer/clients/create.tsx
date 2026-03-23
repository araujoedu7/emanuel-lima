import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

import { initializeApp, getApps, getApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "../../../src/services/firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDQlECIYTEhh-pfRJC7UVMD_YYVGUBtY28",
  authDomain: "emanuel-lima.firebaseapp.com",
  projectId: "emanuel-lima",
  storageBucket: "emanuel-lima.firebasestorage.app",
  messagingSenderId: "1075341465658",
  appId: "1:1075341465658:web:f419f07882fc27d0213d03",
};

export default function CreateClientScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getSecondaryApp = () => {
    const existingApp = getApps().find((app) => app.name === "Secondary");

    if (existingApp) {
      return getApp("Secondary");
    }

    return initializeApp(firebaseConfig, "Secondary");
  };

  const handleCreateClient = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha nome, email e senha.");
      return;
    }

    try {
      setLoading(true);

      const secondaryApp = getSecondaryApp();
      const secondaryAuth = getAuth(secondaryApp);

      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        type: "cliente",
        createdAt: new Date(),
      });

      Alert.alert("Sucesso", "Cliente criado com sucesso!");

      setName("");
      setEmail("");
      setPassword("");

      router.replace("/lawyer/clients/index");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f5f9",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: "#0f172a",
        }}
      >
        Novo Cliente
      </Text>

      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: loading ? "#94a3b8" : "#22c55e",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleCreateClient}
        disabled={loading}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {loading ? "Criando..." : "Criar Cliente"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}