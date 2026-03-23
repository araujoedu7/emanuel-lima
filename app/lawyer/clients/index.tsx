import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type Client = {
  id: string;
  name: string;
  email: string;
  type: string;
};

export default function ClientsScreen() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const list: Client[] = [];

      querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.type === "cliente") {
          list.push({
            id: docItem.id,
            name: data.name ?? "",
            email: data.email ?? "",
            type: data.type ?? "",
          });
        }
      });

      setClients(list);
    } catch (error) {
      console.log("Erro ao buscar clientes:", error);
    }
  };

  const renderItem = ({ item }: { item: Client }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
      onPress={() => {
        console.log("Cliente clicado:", item.name);
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        {item.name}
      </Text>

      <Text
        style={{
          color: "#475569",
        }}
      >
        {item.email}
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
          marginBottom: 20,
          color: "#0f172a",
        }}
      >
        👥 Clientes
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={() => router.push("/lawyer/clients/create")}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          + Novo Cliente
        </Text>
      </TouchableOpacity>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            Nenhum cliente encontrado
          </Text>
        }
      />
    </View>
  );
}