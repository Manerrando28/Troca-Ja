import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ícone central */}
      <Text style={styles.icon}>🔑</Text>

      <Text style={styles.title}>TrocaJá</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#0066ff" // fundo azul moderno
  },
  icon: { fontSize: 72, marginBottom: 20, color: "#fff" },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { fontSize: 16, color: "#e0e0e0", marginVertical: 20 },
  button: {
    backgroundColor: "#00c2a8",
    paddingVertical: 15,
    borderRadius: 25,
    width: "80%",
    elevation: 3,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});


