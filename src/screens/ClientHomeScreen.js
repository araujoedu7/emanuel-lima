import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function ClientHomeScreen() {
  const router = useRouter();

  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProcesses();
  }, []);

  const fetchMyProcesses = async () => {
    try {
      const currentUser = auth.currentUser;

      console.log("Entrou na área do cliente");
      console.log("Usuário atual:", currentUser?.uid);

      if (!currentUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const querySnapshot = await getDocs(collection(db, "processes"));

      const list = [];

      querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.clientId === currentUser.uid) {
          list.push({
            id: docItem.id,
            title: data.title ?? "",
            description: data.description ?? "",
            clientId: data.clientId ?? "",
          });
        }
      });

      console.log("Processos do cliente:", list);

      setProcesses(list);
    } catch (error) {
      console.log("Erro ao buscar processos do cliente:", error);
      Alert.alert("Erro", "Não foi possível carregar os processos.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair.");
    }
  };

  const handleOpenProcess = (processId) => {
    router.push(`/client/${processId}`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleOpenProcess(item.id)}
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
          fontSize: 28,
          fontWeight: "bold",
          color: "#0f172a",
          marginBottom: 10,
        }}
      >
        👤 Área do Cliente
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#334155",
          marginBottom: 20,
        }}
      >
        Aqui você pode acompanhar seus processos.
      </Text>

      {loading ? (
        <Text
          style={{
            color: "#64748b",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Carregando processos...
        </Text>
      ) : (
        <FlatList
          data={processes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
                marginTop: 20,
              }}
            >
              Nenhum processo encontrado
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#ef4444",
          padding: 15,
          borderRadius: 10,
          marginTop: 10,
        }}
        onPress={handleLogout}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}