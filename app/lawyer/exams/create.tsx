import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function CreateExamScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [clientId, setClientId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    resolveClientId();
  }, []);

  const resolveClientId = async () => {
    try {
      const paramId = Array.isArray(params.clientId)
        ? params.clientId[0]
        : params.clientId;

      if (!paramId) {
        Alert.alert("Erro", "Cliente não encontrado.");
        return;
      }

      // 🔥 Se já for ID válido do documento → usa direto
      const clientRef = doc(db, "clients", String(paramId));
      const snapshot = await getDoc(clientRef);

      if (snapshot.exists()) {
        setClientId(snapshot.id);
        return;
      }

      // 🔁 fallback (casos antigos)
      setClientId(String(paramId));
    } catch (error) {
      console.log("Erro ao resolver clientId:", error);
      Alert.alert("Erro", "Falha ao identificar cliente.");
    }
  };

  const handleCreateExam = async () => {
    if (!clientId) {
      Alert.alert("Erro", "Cliente não encontrado.");
      return;
    }

    if (
      !title.trim() ||
      !type.trim() ||
      !date.trim() ||
      !time.trim() ||
      !location.trim()
    ) {
      Alert.alert("Erro", "Preencha todos os campos da perícia.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        clientId: String(clientId), // 🔥 agora padronizado
        title: title.trim(),
        type: type.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        createdAt: new Date(),
      };

      console.log("Salvando perícia:", payload);

      await addDoc(collection(db, "pericias"), payload);

      Alert.alert("Sucesso", "Perícia cadastrada com sucesso.");

      setTitle("");
      setType("");
      setDate("");
      setTime("");
      setLocation("");

      router.replace({
        pathname: "/lawyer/exams",
        params: { clientId: String(clientId) },
      } as any);
    } catch (error: any) {
      console.log("Erro ao criar perícia:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível cadastrar a perícia."
      );
    } finally {
      setSaving(false);
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
        Nova Perícia
      </Text>

      <TextInput
        placeholder="Título da perícia"
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
        placeholder="Tipo de perícia"
        value={type}
        onChangeText={setType}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Data (ex: 10/04/2026)"
        value={date}
        onChangeText={setDate}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Horário (ex: 14:00)"
        value={time}
        onChangeText={setTime}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
      />

      <TextInput
        placeholder="Local"
        value={location}
        onChangeText={setLocation}
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: saving ? "#c4b5fd" : "#8b5cf6",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleCreateExam}
        disabled={saving}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {saving ? "Salvando..." : "Cadastrar Perícia"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}