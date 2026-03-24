import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type Process = {
  id: string;
  title: string;
  description: string;
  clientId: string;
};

export default function ClientProcessesScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();

  const [processes, setProcesses] = useState<Process[]>([]);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    if (clientId) {
      fetchClientData();
      fetchProcesses();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      if (!clientId) return;

      const clientRef = doc(db, "users", clientId);
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        const data = clientSnap.data();
        setClientName(data.name ?? "Cliente");
      }
    } catch (error) {
      console.log("Erro ao buscar cliente:", error);
    }
  };

  const fetchProcesses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "processes"));

      const list: Process[] = [];

      querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.clientId === clientId) {
          list.push({
            id: docItem.id,
            title: data.title ?? "",
            description: data.description ?? "",
            clientId: data.clientId ?? "",
          });
        }
      });

      setProcesses(list);
    } catch (error) {
      console.log("Erro ao buscar processos:", error);
    }
  };

  const renderItem = ({ item }: { item: Process }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
      }}
      onPress={() =>
        router.push(
          {
            pathname: "/lawyer/processes/[processId]",
            params: {
              processId: item.id,
              clientId: item.clientId,
            },
          } as any
        )
      }
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>

      <Text
        style={{
          color: "#475569",
        }}
      >
        {item.description}
      </Text>
    </TouchableOpacity>
  );

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
        Processos do Cliente
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

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={() =>
          router.push(
            {
              pathname: "/lawyer/processes/create",
              params: { clientId },
            } as any
          )
        }
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          + Novo Processo
        </Text>
      </TouchableOpacity>

      <FlatList
        data={processes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            Nenhum processo encontrado
          </Text>
        }
      />
    </View>
  );
}