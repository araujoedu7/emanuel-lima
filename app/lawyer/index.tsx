import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../src/services/firebase";
import colors from "../../theme/colors";

export default function LawyerScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Bem-vindo, Emanuel</Text>
        </View>
      </View>

      <View style={styles.introBlock}>
        <Text style={styles.heading}>Painel do advogado</Text>
        <Text style={styles.description}>
          Acesse as áreas do sistema e gerencie as informações do escritório.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => router.push("/lawyer/clients")}
        activeOpacity={0.9}
      >
        <View style={styles.mainCardTop}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>👥</Text>
          </View>

          <View style={styles.arrowWrap}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>

        <Text style={styles.mainCardTitle}>Clientes</Text>
        <Text style={styles.mainCardText}>
          Visualize, edite e acompanhe os clientes cadastrados.
        </Text>

        <View style={styles.goldBar} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.9}
      >
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(8, 20, 46)",
    padding: 20,
  },

  badgeRow: {
    marginTop: 12,
    marginBottom: 14,
    alignItems: "flex-start",
  },

  badge: {
    backgroundColor: "rgba(204, 164, 31, 0.16)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(201,162,39,0.35)",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 0.3,
  },

  introBlock: {
    marginBottom: 20,
  },

  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.textOnDark,
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255,255,255,0.72)",
  },

  mainCard: {
    backgroundColor: "rgba(6, 25, 88, 0.58)",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(6, 25, 88, 0.58)",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },

  mainCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 24,
  },

  arrowWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  arrow: {
    color: colors.textOnDark,
    fontSize: 20,
    fontWeight: "700",
  },

  mainCardTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textOnDark,
    marginBottom: 8,
  },

  mainCardText: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255,255,255,0.76)",
    marginBottom: 18,
  },

  goldBar: {
    width: 64,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.gold,
  },

  logoutButton: {
    marginTop: "auto",
    backgroundColor: colors.danger,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  logoutButtonText: {
    textAlign: "center",
    color: colors.textOnDark,
    fontSize: 16,
    fontWeight: "700",
  },
});