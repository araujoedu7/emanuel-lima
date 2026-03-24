import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
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

  useFocusEffect(() => {
    fetchClients();
  });

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

  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      "Excluir cliente",
      `Deseja excluir ${client.name}? Os processos desse cliente também serão removidos.`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const batch = writeBatch(db);

              // Remove o documento do cliente
              batch.delete(doc(db, "users", client.id));

              // Busca e remove os processos vinculados ao cliente
              const processesRef = collection(db, "processes");
              const processesQuery = query(
                processesRef,
                where("clientId", "==", client.id)
              );
              const processSnapshot = await getDocs(processesQuery);

              processSnapshot.forEach((processDoc) => {
                batch.delete(doc(db, "processes", processDoc.id));
              });

              await batch.commit();

              Alert.alert("Sucesso", "Cliente excluído com sucesso.");
              fetchClients();
            } catch (error: any) {
              console.log("Erro ao excluir cliente:", error);
              Alert.alert(
                "Erro",
                error.message || "Não foi possível excluir o cliente."
              );
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Client }) => (
    <View
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
    >
      <TouchableOpacity
        onPress={() => router.push(`/lawyer/clients/${item.id}` as any)}
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
            marginTop: 4,
            marginBottom: 12,
          }}
        >
          {item.email}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#dbeafe",
            width: 40,
            height: 40,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() =>
            router.push(
              {
                pathname: "/lawyer/clients/edit",
                params: { clientId: item.id },
              } as any
            )
          }
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            ✏️
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#fee2e2",
            width: 40,
            height: 40,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => handleDeleteClient(item)}
        >
          <Text
            style={{
              fontSize: 18,
            }}
          >
            🗑️
          </Text>
        </TouchableOpacity>
      </View>
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
        👥 Clientes
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={() => router.push("/lawyer/clients/create" as any)}
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