import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { auth, db } from "../services/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // Login no Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      console.log("UID logado:", user.uid);

      // Buscar dados no Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();

        console.log("Dados do Firestore:", userData);
        console.log("Tipo do usuário:", userData.type);

        // 🔥 Tratamento mais seguro (remove espaços)
        const userType = userData.type.trim().toLowerCase();

        if (userType === "advogado") {
          router.replace("/lawyer");
        } else if (userType === "cliente") {
          router.replace("/client");
        } else {
          Alert.alert("Erro", "Tipo de usuário inválido");
        }
      } else {
        Alert.alert("Erro", "Usuário não encontrado no Firestore");
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#0f172a",
      }}
    >
      <Text
        style={{
          fontSize: 28,
          color: "#fff",
          marginBottom: 30,
          textAlign: "center",
        }}
      >
        Sistema Jurídico
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        style={{
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#1e293b",
          color: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}