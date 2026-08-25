import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Ícone central */}
      <Text style={styles.icon}>🏠</Text>

      <Text style={styles.title}>Bem-vindo ao TrocaJá 👋</Text>
      <Text style={styles.subtitle}>Escolha uma opção abaixo</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/feed")}>
        <Text style={styles.buttonText}>Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push("/explore")}>
        <Text style={styles.buttonText}>Explorar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/profile")}>
        <Text style={styles.buttonText}>Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/login")}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0066ff", // fundo azul moderno
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20 
  },
  icon: { fontSize: 72, marginBottom: 20, color: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#e0e0e0", marginBottom: 30 },
  button: {
    backgroundColor: "#00c2a8",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: "#ff9800",
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "80%",
    elevation: 3,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: "80%",
    elevation: 3,
  },
  logoutText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});

