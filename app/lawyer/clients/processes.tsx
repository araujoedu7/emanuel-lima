import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

type Process = {
  id: string;
  title: string;
  description: string;
  clientId: string;
};

export default function ClientProcessesListScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();

  const [processes, setProcesses] = useState<Process[]>([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      loadScreenData();
    }
  }, [clientId]);

  const loadScreenData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchClientData(), fetchProcesses()]);
    } catch (error) {
      console.log("Erro ao carregar dados da tela:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async () => {
    try {
      if (!clientId) return;

      const clientRef = doc(db, "users", String(clientId));
      const clientSnap = await getDoc(clientRef);

      if (clientSnap.exists()) {
        const data = clientSnap.data();
        setClientName(data.name ?? "Cliente");
      } else {
        setClientName("Cliente");
      }
    } catch (error) {
      console.log("Erro ao buscar cliente:", error);
      setClientName("Cliente");
    }
  };

  const fetchProcesses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "processes"));
      const list: Process[] = [];

      querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        if (String(data.clientId) === String(clientId)) {
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
      setProcesses([]);
    }
  };

  const renderItem = ({ item }: { item: Process }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e2e8f0",
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
          fontWeight: "700",
          color: "#0f172a",
          marginBottom: 6,
        }}
      >
        {item.title}
      </Text>

      <Text
        style={{
          color: "#475569",
          lineHeight: 20,
        }}
      >
        {item.description || "Sem descrição"}
      </Text>

      <Text
        style={{
          marginTop: 10,
          color: "#2563eb",
          fontWeight: "600",
          fontSize: 13,
        }}
      >
        Abrir processo
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f8fafc",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
        <Text
          style={{
            marginTop: 12,
            color: "#64748b",
          }}
        >
          Carregando processos...
        </Text>
      </View>
    );
  }

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
          marginTop: 40,
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
          Meus Processos
        </Text>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 8,
          }}
        >
          {clientName || "Cliente"}
        </Text>

        <Text
          style={{
            color: "#cbd5e1",
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          Visualize os processos cadastrados e adicione novos registros quando necessário.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#64748b",
            marginBottom: 6,
          }}
        >
          Total de processos
        </Text>

        <Text
          style={{
            fontSize: 28,
            fontWeight: "800",
            color: "#0f172a",
          }}
        >
          {processes.length}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#22c55e",
          padding: 15,
          borderRadius: 12,
          marginBottom: 18,
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
            color: "#ffffff",
            textAlign: "center",
            fontWeight: "700",
            fontSize: 15,
          }}
        >
          + Novo Processo
        </Text>
      </TouchableOpacity>

      <FlatList
        data={processes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View
            style={{
              backgroundColor: "#ffffff",
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#0f172a",
                marginBottom: 6,
              }}
            >
              Nenhum processo encontrado
            </Text>

            <Text
              style={{
                textAlign: "center",
                color: "#64748b",
                lineHeight: 20,
              }}
            >
              Cadastre o primeiro processo deste cliente para começar.
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}