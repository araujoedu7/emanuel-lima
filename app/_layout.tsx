import { Stack } from "expo-router";

export default function RootLayout() {
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
        options={{
          title: "Meu Processo",
        }}
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
        options={{
          title: "Clientes",
        }}
      />

      <Stack.Screen
        name="lawyer/clients/create"
        options={{
          title: "Novo Cliente",
        }}
      />

      <Stack.Screen
        name="lawyer/clients/[clientId]"
        options={{
          title: "Processos do Cliente",
        }}
      />

      <Stack.Screen
        name="lawyer/processes/create"
        options={{
          title: "Novo Processo",
        }}
      />

      <Stack.Screen
        name="lawyer/processes/[processId]"
        options={{
          title: "Detalhes do Processo",
        }}
      />

      <Stack.Screen
        name="lawyer/processes/edit"
        options={{
          title: "Editar Processo",
        }}
      />
    </Stack>
  );
}