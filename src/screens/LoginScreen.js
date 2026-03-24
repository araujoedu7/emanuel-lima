import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;
      console.log("UID logado:", user.uid);

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Erro", "Usuário não encontrado no Firestore.");
        return;
      }

      const userData = userSnap.data();
      const userType = String(userData.type || "").trim().toLowerCase();

      console.log("Dados do Firestore:", userData);
      console.log("Tipo tratado:", userType);

      if (userType === "advogado") {
        console.log("Indo para /lawyer");
        router.replace("/lawyer");
        return;
      }

      if (userType === "cliente") {
        console.log("Indo para /client");
        router.replace("/client");
        return;
      }

      Alert.alert("Erro", "Tipo de usuário inválido.");
    } catch (error) {
      console.log("Erro no login:", error);
      Alert.alert("Erro", error.message || "Não foi possível entrar.");
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
        autoCapitalize="none"
        keyboardType="email-address"
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