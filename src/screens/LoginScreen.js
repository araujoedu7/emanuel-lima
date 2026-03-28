import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { registerForPushNotificationsAsync } from "../services/notifications";
import colors from "../../theme/colors";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        Alert.alert("Erro", "Usuário não encontrado no Firestore.");
        return;
      }

      const userData = userSnap.data();
      const userType = String(userData.type || "").trim().toLowerCase();

      const expoPushToken = await registerForPushNotificationsAsync();

      if (expoPushToken) {
        try {
          await updateDoc(userRef, {
            expoPushToken,
          });
        } catch (error) {
          console.log(error);
        }
      }

      if (userType === "advogado") {
        router.replace("/lawyer");
        return;
      }

      if (userType === "cliente") {
        router.replace("/client");
        return;
      }

      Alert.alert("Erro", "Tipo de usuário inválido.");
    } catch (error) {
      Alert.alert("Erro", error.message || "Não foi possível entrar.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/images/law.jpg")}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.goldLine} />
              <Text style={styles.title}>Sistema Jurídico</Text>
              <Text style={styles.subtitle}>
                Plataforma profissional para gestão jurídica
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                style={styles.input}
              />

              <TextInput
                placeholder="Senha"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity
                onPress={handleLogin}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.75)",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  header: {
    marginBottom: 30,
  },

  goldLine: {
    width: 40,
    height: 4,
    backgroundColor: colors.gold,
    borderRadius: 999,
    marginBottom: 16,
  },

  title: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 6,
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
  },

  form: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },

  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 12,
    marginTop: 6,
  },

  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});