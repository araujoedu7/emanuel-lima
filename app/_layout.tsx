import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function RootLayout() {
  const router = useRouter();

  const renderBackButton = (navigation: any, fallbackRoute: string) => (
    <TouchableOpacity
      onPress={() => {
        if (navigation?.canGoBack?.()) {
          navigation.goBack();
          return;
        }

        router.replace(fallbackRoute as any);
      }}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: 4,
      }}
    >
      <Text
        style={{
          fontSize: 26,
          color: "#0f172a",
          fontWeight: "600",
        }}
      >
        ←
      </Text>
    </TouchableOpacity>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f8fafc",
        },
        headerTintColor: "#0f172a",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerBackTitle: "Voltar",
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="login"
        options={{
          title: "Login",
        }}
      />

      <Stack.Screen
        name="client"
        options={{
          title: "Área do Cliente",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="client/[processId]"
        options={({ navigation }) => ({
          title: "Meu Processo",
          headerLeft: () => renderBackButton(navigation, "/client"),
        })}
      />

      <Stack.Screen
        name="lawyer"
        options={{
          title: "Área do Advogado",
          gestureEnabled: false,
        }}
      />

      <Stack.Screen
        name="lawyer/clients/index"
        options={({ navigation }) => ({
          title: "Clientes",
          headerLeft: () => renderBackButton(navigation, "/lawyer"),
        })}
      />

      <Stack.Screen
        name="lawyer/clients/create"
        options={({ navigation }) => ({
          title: "Novo Cliente",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients"),
        })}
      />

      <Stack.Screen
        name="lawyer/clients/[clientId]"
        options={({ navigation }) => ({
          title: "Cliente",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients"),
        })}
      />

      <Stack.Screen
        name="lawyer/clients/processes"
        options={({ navigation }) => ({
          title: "Processos do Cliente",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients"),
        })}
      />

      <Stack.Screen
        name="lawyer/processes/create"
        options={({ navigation }) => ({
          title: "Novo Processo",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients/processes"),
        })}
      />

      <Stack.Screen
        name="lawyer/processes/[processId]"
        options={({ navigation }) => ({
          title: "Detalhes do Processo",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients/processes"),
        })}
      />

      <Stack.Screen
        name="lawyer/processes/edit"
        options={({ navigation }) => ({
          title: "Editar Processo",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients/processes"),
        })}
      />

      <Stack.Screen
        name="lawyer/exams"
        options={({ navigation }) => ({
          title: "Perícias",
          headerLeft: () => renderBackButton(navigation, "/lawyer/clients"),
        })}
      />

      <Stack.Screen
        name="lawyer/exams/edit"
        options={{
          title: "Editar Perícia",
        }}
      />
      <Stack.Screen
        name="lawyer/exams/index"
        options={{
          title: "Perícias",
        }}
      />
<Stack.Screen
        name="lawyer/index"
        options={{
          title: "Home",
        }}
      />

    </Stack>


  );
}