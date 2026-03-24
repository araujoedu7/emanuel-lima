import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type ProcessData = {
  title: string;
  description: string;
  clientId: string;
};

export default function ProcessDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const processId = useMemo(() => {
    const value = params.processId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.processId]);

  const clientId = useMemo(() => {
    const value = params.clientId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.clientId]);

  const [processData, setProcessData] = useState<ProcessData | null>(null);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProcess();
  }, [processId]);

  const fetchClientName = async (id: string) => {
    try {
      const clientRef = doc(db, "users", id);
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        const data = clientSnap.data();
        setClientName(data.name ?? "Cliente");
      }
    } catch (error) {
      console.log("Erro ao buscar nome do cliente:", error);
    }
  };

  const fetchProcess = async () => {
    try {
      if (!processId) {
        Alert.alert("Erro", "ID do processo não encontrado.");
        return;
      }

      const processRef = doc(db, "processes", processId);
      const processSnap = await getDoc(processRef);

      if (processSnap.exists()) {
        const data = processSnap.data();

        const loadedProcess = {
          title: data.title ?? "",
          description: data.description ?? "",
          clientId: data.clientId ?? "",
        };

        setProcessData(loadedProcess);

        if (loadedProcess.clientId) {
          fetchClientName(loadedProcess.clientId);
        }
      } else {
        Alert.alert("Erro", "Processo não encontrado.");
      }
    } catch (error: any) {
      console.log("Erro ao buscar processo:", error);
      Alert.alert("Erro", error.message || "Não foi possível carregar o processo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProcess = async () => {
    try {
      if (!processId) {
        Alert.alert("Erro", "ID do processo não encontrado.");
        return;
      }

      setDeleting(true);

      const processRef = doc(db, "processes", processId);
      await deleteDoc(processRef);

      Alert.alert("Sucesso", "Processo deletado com sucesso.");

      if (clientId) {
        router.replace(`/lawyer/clients/${clientId}` as any);
      } else {
        router.back();
      }
    } catch (error: any) {
      console.log("Erro ao deletar processo:", error);
      Alert.alert("Erro ao deletar", error.message || "Não foi possível deletar o processo.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEditProcess = () => {
    router.push(
      {
        pathname: "/lawyer/processes/edit",
        params: {
          processId,
          clientId,
        },
      } as any
    );
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
          marginBottom: 6,
          color: "#0f172a",
        }}
      >
        Detalhes do Processo
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#475569",
          marginBottom: 20,
        }}
      >
        {clientName || "Carregando cliente..."}
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 12,
          marginBottom: 20,
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
          backgroundColor: "#3b82f6",
          padding: 15,
          borderRadius: 10,
          marginBottom: 12,
        }}
        onPress={handleEditProcess}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Editar Processo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: deleting ? "#fca5a5" : "#ef4444",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={handleDeleteProcess}
        disabled={deleting}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {deleting ? "Deletando..." : "Deletar Processo"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}