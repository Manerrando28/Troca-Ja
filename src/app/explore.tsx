import { View, Text, FlatList, StyleSheet } from "react-native";

export default function Explore() {
  const categorias = {
    Eletrônicos: [
      { id: "1", nome: "Celular usado", preco: "R$ 800" },
      { id: "2", nome: "Fones Bluetooth", preco: "R$ 200" },
    ],
    Roupas: [
      { id: "3", nome: "Camiseta nova", preco: "R$ 80" },
      { id: "4", nome: "Tênis esportivo", preco: "R$ 250" },
    ],
    Livros: [
      { id: "5", nome: "Livro de programação", preco: "R$ 60" },
      { id: "6", nome: "Romance clássico", preco: "R$ 40" },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explorar Categorias</Text>
      {Object.entries(categorias).map(([categoria, itens]) => (
        <View key={categoria} style={styles.section}>
          <Text style={styles.sectionTitle}>{categoria}</Text>
          <FlatList
            data={itens}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.imagePlaceholder} />
                <Text style={styles.itemTitle}>{item.nome}</Text>
                <Text style={styles.itemPrice}>{item.preco}</Text>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f2f5" },
  title: { fontSize: 28, fontWeight: "bold", color: "#0066ff", marginBottom: 20 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginRight: 15, width: 150, elevation: 2 },
  imagePlaceholder: { width: "100%", height: 100, backgroundColor: "#ddd", borderRadius: 8, marginBottom: 5 },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#333" },
  itemPrice: { fontSize: 14, color: "#0066ff" },
});
