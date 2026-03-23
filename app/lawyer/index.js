import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../src/services/firebase";

export default function LawyerScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f1f5f9",
        padding: 20,
        justifyContent: "center",
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
        👨‍⚖️ Área do Advogado
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#334155",
          marginBottom: 30,
        }}
      >
        Gerencie clientes e processos
      </Text>

      {/* BOTÃO CLIENTES */}
      <TouchableOpacity
        style={{
          backgroundColor: "#3b82f6",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
        onPress={() => router.push("/lawyer/clients")}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Ver Clientes
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={{
          backgroundColor: "#ef4444",
          padding: 15,
          borderRadius: 10,
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