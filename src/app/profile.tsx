import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  const meusProdutos = [
    { id: "1", nome: "Minha mochila", preco: "R$ 120" },
    { id: "2", nome: "Relógio antigo", preco: "R$ 300" },
    { id: "3", nome: "Cadeira de escritório", preco: "R$ 450" },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho com avatar e dados */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder} />
        <View>
          <Text style={styles.name}>usuario</Text>
          <Text style={styles.email}>usuario@email.com</Text>
        </View>
      </View>

      {/* Meus produtos */}
      <Text style={styles.sectionTitle}>Meus Produtos</Text>
      <FlatList
        data={meusProdutos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <Text style={styles.itemPrice}>{item.preco}</Text>
          </View>
        )}
      />

      {/* Botões de ação */}
      <TouchableOpacity style={styles.buttonSecondary}>
        <Text style={styles.buttonText}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/login")}>
        <Text style={styles.logoutText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ddd", marginRight: 15 },
  name: { fontSize: 20, fontWeight: "bold", color: "#333" },
  email: { fontSize: 14, color: "#555" },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#0066ff", marginVertical: 15 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  imagePlaceholder: { width: "100%", height: 120, backgroundColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: "bold", color: "#333" },
  itemPrice: { fontSize: 14, color: "#0066ff" },
  buttonSecondary: {
    backgroundColor: "#00c2a8",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: "80%",
    elevation: 3,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 15,
    width: "80%",
    elevation: 3,
  },
  logoutText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
