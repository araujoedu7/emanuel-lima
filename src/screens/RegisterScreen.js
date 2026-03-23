import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";

import { auth, db } from "../services/firebase";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("cliente"); // padrão

  const handleRegister = async () => {
    try {
      // Cria usuário no Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Salva no Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        type: userType,
        createdAt: new Date(),
      });

      Alert.alert("Sucesso", "Usuário cadastrado!");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <View style={{ padding: 20, marginTop: 50 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Cadastro
      </Text>

      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Text>Tipo de usuário:</Text>

      <Button
        title="Sou Cliente"
        onPress={() => setUserType("cliente")}
      />

      <Button
        title="Sou Advogado"
        onPress={() => setUserType("advogado")}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Cadastrar" onPress={handleRegister} />
      </View>
    </View>
  );
}