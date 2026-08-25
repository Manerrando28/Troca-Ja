import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Feed() {
  const router = useRouter();

  const produtos = [
    { id: "1", nome: "Celular usado", preco: "R$ 800" },
    { id: "2", nome: "Tênis esportivo", preco: "R$ 250" },
    { id: "3", nome: "Livro de programação", preco: "R$ 60" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed de Produtos</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imagePlaceholder} />
            <Text style={styles.itemTitle}>{item.nome}</Text>
            <Text style={styles.itemPrice}>{item.preco}</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>⬅️ Voltar para Início</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  title: { fontSize: 28, fontWeight: "bold", color: "#0066ff", marginBottom: 20 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  imagePlaceholder: { width: "100%", height: 150, backgroundColor: "#ddd", borderRadius: 8, marginBottom: 10 },
  itemTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  itemPrice: { fontSize: 16, color: "#0066ff" },
  button: {
    backgroundColor: "#0066ff",
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    width: "80%",
    elevation: 3,
  },
  buttonText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" },
});
