import { View, Text, StyleSheet } from "react-native";
import AppHeader from "../../components/ui/AppHeader";
import colors from "../../theme/colors";

export default function LawyerHomeScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Área do Advogado"
        subtitle="Gerencie seus clientes, processos e perícias com eficiência"
        image={require("../../assets/images/law.jpg")}
      />

      <View style={styles.content}>
        <Text style={styles.welcome}>
          Bem-vindo ao seu painel jurídico 👨‍⚖️
        </Text>

        <Text style={styles.description}>
          Aqui você pode acompanhar seus clientes, processos e perícias de forma organizada e profissional.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },

  content: {
    marginTop: 10,
  },

  welcome: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});