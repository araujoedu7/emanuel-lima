import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../src/services/firebase";

export default function ClientDetailsScreen() {
  const router = useRouter();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();

  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={{ marginTop: 12, color: "#64748b" }}>
          Carregando cliente...
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
          Cliente
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
          Acesse os processos e as perícias deste cliente de forma organizada.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "#ffffff",
          padding: 18,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 14,
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
          Processos
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#475569",
            lineHeight: 20,
            marginBottom: 14,
          }}
        >
          Visualize todos os processos deste cliente e adicione novos quando necessário.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#22c55e",
            paddingVertical: 14,
            borderRadius: 12,
          }}
          onPress={() =>
            router.push(
              {
                pathname: "/lawyer/clients/processes",
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
            Ver Processos
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#ffffff",
          padding: 18,
          borderRadius: 16,
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
          Perícias
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#475569",
            lineHeight: 20,
            marginBottom: 14,
          }}
        >
          Consulte as perícias vinculadas a este cliente e acompanhe os registros.
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: "#8b5cf6",
            paddingVertical: 14,
            borderRadius: 12,
          }}
          onPress={() =>
            router.push(
              {
                pathname: "/lawyer/exams",
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
            Ver Perícias
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}