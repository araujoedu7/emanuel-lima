import { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type Exam = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  clientId: string;
};

export default function ClientExamsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const clientId = useMemo(() => {
    const value = params.clientId;
    return Array.isArray(value) ? value[0] : value;
  }, [params.clientId]);

  const [exams, setExams] = useState<Exam[]>([]);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    if (clientId) {
      fetchClientData();
      fetchExams();
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

  const fetchExams = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "pericias"));

      const list: Exam[] = [];

      querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.clientId === clientId) {
          list.push({
            id: docItem.id,
            title: data.title ?? "",
            date: data.date ?? "",
            time: data.time ?? "",
            location: data.location ?? "",
            type: data.type ?? "",
            clientId: data.clientId ?? "",
          });
        }
      });

      setExams(list);
    } catch (error) {
      console.log("Erro ao buscar perícias:", error);
    }
  };

  const renderItem = ({ item }: { item: Exam }) => (
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
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>

      <Text style={{ color: "#475569", marginBottom: 4 }}>
        Tipo: {item.type}
      </Text>

      <Text style={{ color: "#475569", marginBottom: 4 }}>
        Data: {item.date}
      </Text>

      <Text style={{ color: "#475569", marginBottom: 4 }}>
        Horário: {item.time}
      </Text>

      <Text style={{ color: "#475569" }}>
        Local: {item.location}
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
          marginBottom: 6,
          color: "#0f172a",
        }}
      >
        Perícias do Cliente
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
          backgroundColor: "#8b5cf6",
          padding: 15,
          borderRadius: 10,
          marginBottom: 20,
        }}
        onPress={() =>
          router.push(
            {
              pathname: "/lawyer/exams/create",
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
          + Nova Perícia
        </Text>
      </TouchableOpacity>

      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#64748b" }}>
            Nenhuma perícia encontrada
          </Text>
        }
      />
    </View>
  );
}