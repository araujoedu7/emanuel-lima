import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function EditExamScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const examId = useMemo(() => {
    const value = params.examId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.examId]);

  const clientId = useMemo(() => {
    const value = params.clientId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.clientId]);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      fetchExam();
    }
  }, [examId]);

  const fetchExam = async () => {
    try {
      setLoading(true);

      if (!examId) {
        Alert.alert("Erro", "Perícia não encontrada.");
        return;
      }

      const examRef = doc(db, "pericias", String(examId));
      const examSnap = await getDoc(examRef);

      if (!examSnap.exists()) {
        Alert.alert("Erro", "Perícia não encontrada.");
        return;
      }

      const data = examSnap.data();

      setTitle(data.title ?? "");
      setType(data.type ?? "");
      setDate(data.date ?? "");
      setTime(data.time ?? "");
      setLocation(data.location ?? "");
    } catch (error: any) {
      console.log("Erro ao buscar perícia:", error);
      Alert.alert("Erro", "Não foi possível carregar a perícia.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExam = async () => {
    if (!examId) {
      Alert.alert("Erro", "Perícia não encontrada.");
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

      await updateDoc(doc(db, "pericias", String(examId)), {
        title: title.trim(),
        type: type.trim(),
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
      });

      Alert.alert("Sucesso", "Perícia atualizada com sucesso.");

      router.replace({
        pathname: "/lawyer/exams",
        params: { clientId: String(clientId) },
      } as any);
    } catch (error: any) {
      console.log("Erro ao atualizar perícia:", error);
      Alert.alert(
        "Erro",
        error.message || "Não foi possível atualizar a perícia."
      );
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
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: "#475569",
          }}
        >
          Carregando perícia...
        </Text>
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
        Editar Perícia
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
        onPress={handleUpdateExam}
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