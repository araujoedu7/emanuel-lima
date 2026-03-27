import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { signOut } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function ClientHomeScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("processos");
  const [processes, setProcesses] = useState([]);
  const [exams, setExams] = useState([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClientArea();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadClientArea();
    }, [])
  );

  const loadClientArea = async () => {
    try {
      setLoading(true);

      const currentUser = auth.currentUser;

      if (!currentUser) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      let foundName = "";
      let linkedClientDocId = "";
      const possibleClientIds = new Set();

      possibleClientIds.add(String(currentUser.uid));

      const usersSnapshot = await getDocs(collection(db, "users"));
      usersSnapshot.forEach((docItem) => {
        if (docItem.id === currentUser.uid) {
          const data = docItem.data();
          foundName = data.name ?? "";

          possibleClientIds.add(String(docItem.id));

          if (data.clientId) {
            possibleClientIds.add(String(data.clientId));
          }
        }
      });

      setClientName(foundName);

      const clientsSnapshot = await getDocs(collection(db, "clients"));
      clientsSnapshot.forEach((docItem) => {
        const data = docItem.data();

        const matchesCurrentUser =
          docItem.id === currentUser.uid ||
          data.userId === currentUser.uid ||
          data.uid === currentUser.uid ||
          data.authUid === currentUser.uid ||
          (currentUser.email && data.email === currentUser.email);

        if (matchesCurrentUser) {
          linkedClientDocId = docItem.id;
          possibleClientIds.add(String(docItem.id));

          if (data.clientId) {
            possibleClientIds.add(String(data.clientId));
          }
        }
      });

      const processesSnapshot = await getDocs(collection(db, "processes"));
      const processList = [];

      processesSnapshot.forEach((docItem) => {
        const data = docItem.data();
        const itemClientId = data.clientId ? String(data.clientId) : "";

        if (possibleClientIds.has(itemClientId)) {
          processList.push({
            id: docItem.id,
            title: data.title ?? "",
            description: data.description ?? "",
            clientId: itemClientId,
          });
        }
      });

      setProcesses(processList);

      const examsSnapshot = await getDocs(collection(db, "pericias"));
      const examList = [];

      examsSnapshot.forEach((docItem) => {
        const data = docItem.data();
        const itemClientId = data.clientId ? String(data.clientId) : "";

        if (possibleClientIds.has(itemClientId)) {
          examList.push({
            id: docItem.id,
            title: data.title ?? "",
            type: data.type ?? "",
            date: data.date ?? "",
            time: data.time ?? "",
            location: data.location ?? "",
            clientId: itemClientId,
          });
        }
      });

      examList.sort((a, b) => {
        const dateA = `${a.date || ""} ${a.time || ""}`.trim();
        const dateB = `${b.date || ""} ${b.time || ""}`.trim();
        return dateA.localeCompare(dateB);
      });

      setExams(examList);
    } catch (error) {
      console.log("Erro ao carregar área do cliente:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
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

  const renderProcessItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleOpenProcess(item.id)}
      style={{
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>

      <Text
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 20,
        }}
      >
        {item.description || "Sem descrição"}
      </Text>
    </TouchableOpacity>
  );

  const renderExamItem = ({ item }) => (
    <View
      style={{
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: 8,
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

  const renderContent = () => {
    if (loading) {
      return (
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, color: "#64748b" }}>
            Carregando informações...
          </Text>
        </View>
      );
    }

    if (activeTab === "processos") {
      return (
        <FlatList
          data={processes}
          keyExtractor={(item) => item.id}
          renderItem={renderProcessItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
                marginTop: 30,
              }}
            >
              Nenhum processo encontrado
            </Text>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      );
    }

    return (
      <FlatList
        data={exams}
        keyExtractor={(item) => item.id}
        renderItem={renderExamItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text
            style={{
              textAlign: "center",
              color: "#64748b",
              marginTop: 30,
            }}
          >
            Nenhuma perícia encontrada
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f8fafc",
        padding: 20,
      }}
    >
      <View
        style={{
          backgroundColor: "#0f172a",
          padding: 20,
          borderRadius: 18,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          Área do Cliente
        </Text>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 8,
          }}
        >
          Olá, {clientName || "Cliente"}
        </Text>

        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 14,
          }}
        >
          Acompanhe seus processos e perícias em um só lugar.
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#e2e8f0",
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setActiveTab("processos")}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor:
              activeTab === "processos" ? "#ffffff" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: activeTab === "processos" ? "#0f172a" : "#475569",
            }}
          >
            Processos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("pericias")}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor:
              activeTab === "pericias" ? "#ffffff" : "transparent",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "700",
              color: activeTab === "pericias" ? "#0f172a" : "#475569",
            }}
          >
            Perícias
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>{renderContent()}</View>

      <TouchableOpacity
        style={{
          backgroundColor: "#ef4444",
          padding: 15,
          borderRadius: 12,
          marginTop: 10,
        }}
        onPress={handleLogout}
      >
        <Text
          style={{
            color: "#ffffff",
            textAlign: "center",
            fontWeight: "700",
          }}
        >
          Sair
        </Text>
      </TouchableOpacity>
    </View>
  );
}