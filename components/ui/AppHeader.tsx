import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../src/services/firebase";
import AppHeader from "../../components/ui/AppHeader";
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
                    <Text style={styles.badgeText}>ADVOCACIA PREMIUM</Text>
                </View>
            </View>

            <View style={styles.introBlock}>
                <Text style={styles.heading}>Controle do seu escritório</Text>
                <Text style={styles.description}>
                    Acesse sua área administrativa para acompanhar clientes e manter sua
                    operação jurídica com mais clareza e sofisticação.
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
                    Visualize, edite e acompanhe todos os clientes do seu escritório em um
                    único lugar.
                </Text>

                <View style={styles.goldBar} />
            </TouchableOpacity>

            <View style={styles.infoRow}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Gestão</Text>
                    <Text style={styles.infoValue}>Organizada</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoLabel}>Visual</Text>
                    <Text style={styles.infoValue}>Profissional</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.9}
            >
                <Text style={styles.logoutButtonText}>Sair da conta</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },

    badgeRow: {
        marginTop: 2,
        marginBottom: 14,
        alignItems: "flex-start",
    },

    badge: {
        backgroundColor: colors.goldLight,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "rgba(201,162,39,0.35)",
    },

    badgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: colors.gray900,
        letterSpacing: 0.8,
    },

    introBlock: {
        marginBottom: 20,
    },

    heading: {
        fontSize: 26,
        fontWeight: "700",
        color: colors.textPrimary,
        marginBottom: 8,
    },

    description: {
        fontSize: 15,
        lineHeight: 24,
        color: colors.textSecondary,
    },

    mainCard: {
        backgroundColor: colors.gray900,
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,
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
        backgroundColor: "rgba(255,255,255,0.08)",
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

    infoRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },

    infoCard: {
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    infoLabel: {
        fontSize: 13,
        color: colors.textSecondary,
        marginBottom: 6,
    },

    infoValue: {
        fontSize: 18,
        fontWeight: "700",
        color: colors.textPrimary,
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