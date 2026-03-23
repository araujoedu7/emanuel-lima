import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type Process = {
  id: string;
  title: string;
  description: string;
  clientId: string;
};

export default function ClientProcessesScreen() {
  const { clientId } = useLocalSearchParams();

  const [processes, setProcesses] = useState<Process[]>([]);

  useEffect(() => {
    fetchProcesses();
  }, []);

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
    <View
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#0f172a",
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
    </View>
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
          marginBottom: 20,
          color: "#0f172a",
        }}
      >
        Processos do Cliente
      </Text>

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