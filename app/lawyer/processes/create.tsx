import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function CreateProcessScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProcess = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do processo");
      return;
    }

    try {
      await addDoc(collection(db, "processes"), {
        title: title.trim(),
        description: description.trim(),
        clientId: clientId,
        createdAt: new Date(),
      });

      Alert.alert("Sucesso", "Processo criado com sucesso");

      router.replace(`/lawyer/clients/${clientId}` as any);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
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
        Novo Processo
      </Text>

      <TextInput
        placeholder="Título do processo"
        value={title}
        onChangeText={setTitle}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
          height: 120,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleCreateProcess}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Criar Processo
        </Text>
      </TouchableOpacity>
    </View>
  );
}