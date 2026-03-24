import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function EditClientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const clientId = useMemo(() => {
    const value = params.clientId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.clientId]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClient();
  }, [clientId]);

  const fetchClient = async () => {
    try {
      if (!clientId) {
        Alert.alert("Erro", "Cliente não encontrado.");
        return;
      }

      const clientRef = doc(db, "users", clientId);
      const clientSnap = await getDoc(clientRef);

      if (!clientSnap.exists()) {
        Alert.alert("Erro", "Cliente não encontrado.");
        return;
      }

      const data = clientSnap.data();

      setName(data.name ?? "");
      setEmail(data.email ?? "");
    } catch (error: any) {
      console.log("Erro ao carregar cliente:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar o cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Erro", "Preencha nome e email.");
      return;
    }

    try {
      if (!clientId) {
        Alert.alert("Erro", "Cliente não encontrado.");
        return;
      }

      setSaving(true);

      await updateDoc(doc(db, "users", clientId), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      });

      Alert.alert("Sucesso", "Cliente atualizado com sucesso.");
      router.back();
    } catch (error: any) {
      console.log("Erro ao atualizar cliente:", error);
      Alert.alert("Erro", error.message || "Não foi possível atualizar o cliente.");
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
        <Text style={{ color: "#475569" }}>Carregando cliente...</Text>
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
        Editar Cliente
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
          marginBottom: 20,
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