import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../src/services/firebase";
import colors from "../../../theme/colors";

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

  // ✅ TIPADO AQUI
  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      "Excluir cliente",
      `Deseja excluir ${client.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const batch = writeBatch(db);

              batch.delete(doc(db, "users", client.id));

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

              fetchClients();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Client }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => router.push(`/lawyer/clients/${item.id}`)}
      >
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() =>
            router.push({
              pathname: "/lawyer/clients/edit",
              params: { clientId: item.id },
            })
          }
        >
          <Text style={styles.icon}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDeleteClient(item)}
        >
          <Text style={styles.icon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/lawyer/clients/create")}
      >
        <Text style={styles.createText}>+ Novo Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum cliente encontrado
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceDark,
    padding: 20,
  },

  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 20,
  },

  createText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
  },

  card: {
    backgroundColor: "rgba(67, 81, 124, 0.87)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(241, 35, 35, 0.06)",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textOnDark,
  },

  email: {
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    marginBottom: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  editBtn: {
    backgroundColor: "rgba(37,99,235,0.15)",
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtn: {
    backgroundColor: "rgba(220,38,38,0.15)",
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    marginTop: 40,
  },
});