import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function EditProcessScreen() {
  const router = useRouter();
  const { processId, clientId } = useLocalSearchParams<{
    processId: string;
    clientId: string;
  }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProcess();
  }, [processId]);

  const fetchProcess = async () => {
    try {
      if (!processId) return;

      const processRef = doc(db, "processes", processId);
      const processSnap = await getDoc(processRef);

      if (processSnap.exists()) {
        const data = processSnap.data();

        setTitle(data.title ?? "");
        setDescription(data.description ?? "");
      } else {
        Alert.alert("Erro", "Processo não encontrado.");
      }
    } catch (error) {
      console.log("Erro ao carregar processo:", error);
      Alert.alert("Erro", "Não foi possível carregar o processo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Erro", "Informe o título do processo.");
      return;
    }

    try {
      setSaving(true);

      if (!processId) return;

      await updateDoc(doc(db, "processes", processId), {
        title: title.trim(),
        description: description.trim(),
      });

      Alert.alert("Sucesso", "Processo atualizado com sucesso.");

      router.replace(`/lawyer/clients/${clientId}` as any);
    } catch (error) {
      console.log("Erro ao atualizar processo:", error);
      Alert.alert("Erro", "Não foi possível atualizar o processo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f1f5f9",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ color: "#475569" }}>Carregando processo...</Text>
      </View>
    );
  }

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
        Editar Processo
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
          textAlignVertical: "top",
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: saving ? "#94a3b8" : "#3b82f6",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleSave}
        disabled={saving}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}