import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../src/services/firebase";

type ProcessData = {
  title: string;
  description: string;
  clientId: string;
};

export default function ClientProcessDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const processId = useMemo(() => {
    const value = params.processId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.processId]);

  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcess();
  }, [processId]);

  const fetchProcess = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      if (!processId) {
        Alert.alert("Erro", "ID do processo não encontrado.");
        return;
      }

      const processRef = doc(db, "processes", processId);
      const processSnap = await getDoc(processRef);

      if (!processSnap.exists()) {
        Alert.alert("Erro", "Processo não encontrado.");
        return;
      }

      const data = processSnap.data();

      if (data.clientId !== currentUser.uid) {
        Alert.alert("Erro", "Você não tem acesso a este processo.");
        router.back();
        return;
      }

      setProcessData({
        title: data.title ?? "",
        description: data.description ?? "",
        clientId: data.clientId ?? "",
      });
    } catch (error: any) {
      console.log("Erro ao carregar processo do cliente:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar o processo.");
    } finally {
      setLoading(false);
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

  if (!processData) {
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
        <Text style={{ color: "#475569" }}>Processo não encontrado.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f5f9",
        padding: 20,
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
        Meu Processo
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#0f172a",
            marginBottom: 10,
          }}
        >
          {processData.title}
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#475569",
            lineHeight: 22,
          }}
        >
          {processData.description || "Sem descrição."}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#334155",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
        onPress={() => router.back()}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Voltar
        </Text>
      </TouchableOpacity>
    </View>
  );
}