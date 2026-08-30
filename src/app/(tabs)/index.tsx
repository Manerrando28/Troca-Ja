import { useState } from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  products,
  users,
  categories,
  negotiations,
  CURRENT_USER_ID,
} from "@/data";

import type { Product, Negotiation } from "@/types";

import { Colors, Spacing, typography } from "@/tokens/theme";

import ProductCard from "@/components/ProductCard";
import ProductTradeModal from "@/components/ProductTradeModal";

type ProductFilter = "today" | "featured" | "trusted" | null;

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    null,
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [selectedFilter, setSelectedFilter] =
    useState<ProductFilter>(null);

  const [pendingNegotiations, setPendingNegotiations] =
    useState<Negotiation[]>(negotiations);

  const currentUser = users.find((u) => u.id === CURRENT_USER_ID)!;

  // Produtos de outros usuários disponíveis para troca
  const availableProducts = products.filter(
    (p) => p.availableForTrade && p.ownerId !== CURRENT_USER_ID,
  );

  console.log("Produtos disponíveis")
  console.log(availableProducts)

  // Produtos pertencentes ao usuário atual
  const myProducts = products.filter(
    (p) => p.ownerId === CURRENT_USER_ID,
  );

  /*
   * Filtra os produtos pela categoria e pelo filtro selecionado.
   */
  const filteredProducts = availableProducts.filter((product) => {
    // ─── Filtro por categoria ──────────────────────────────────────
    if (
      selectedCategoryId &&
      product.categoryId !== selectedCategoryId
    ) {
      return false;
    }

    // ─── Lançados hoje ─────────────────────────────────────────────
    if (selectedFilter === "today") {
      const today = new Date().toISOString().split("T")[0];

      const productDate = product.createdAt.split("T")[0];

      return productDate === today;
    }

    // ─── Destaques ─────────────────────────────────────────────────
    if (selectedFilter === "featured") {
      return product.featured;
    }

    // ─── Usuários confiáveis ───────────────────────────────────────
    if (selectedFilter === "trusted") {
      const owner = users.find(
        (user) => user.id === product.ownerId,
      );

      return owner ? owner.completedTrades >= 5 : false;
    }

    return true;
  });

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleConfirmTrade = (
    negotiation: Omit<Negotiation, "id">,
  ) => {
    const newNegotiation: Negotiation = {
      ...negotiation,
      id: `neg-${Date.now()}`,
    };

    setPendingNegotiations((prev) => [
      ...prev,
      newNegotiation,
    ]);

    setSelectedProduct(null);
  };

  const targetUser = selectedProduct
    ? users.find(
        (u) => u.id === selectedProduct.ownerId,
      ) ?? null
    : null;

  /*
   * Cada categoria recebe a imagem de um produto disponível
   * daquela categoria para servir como miniatura.
   */
  const categoryCards = categories.map((category) => {
    // se o find não achar nada retorna null
    const categoryProduct = availableProducts.find(
      (product) => product.categoryId === category.id,
    );

    if (!categoryProduct) {
      console.warn(` ⚠️ Nenhum produto encontrado para a categoria "${category.name}"`)
    }

    return {
      ...category,
      image: categoryProduct?.image ?? null,
    };
  });

  /*
   * Nome da categoria atualmente selecionada.
   */
  const selectedCategoryName = selectedCategoryId
    ? categories.find(
        (category) => category.id === selectedCategoryId,
      )?.name
    : null;

  /*
   * Texto do filtro atualmente selecionado.
   */
  const selectedFilterName =
    selectedFilter === "today"
      ? "Lançados hoje"
      : selectedFilter === "featured"
        ? "Destaques"
        : selectedFilter === "trusted"
          ? "Usuários confiáveis"
          : null;

  /*
   * Alterna o filtro.
   *
   * Se clicar novamente no mesmo botão,
   * o filtro é removido.
   */
  const toggleFilter = (filter: ProductFilter) => {
    setSelectedFilter((current) =>
      current === filter ? null : filter,
    );
  };

  /*
   * Remove todos os filtros.
   */
  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedFilter(null);
  };

  console.log(categoryCards);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const owner = users.find(
              (u) => u.id === item.ownerId,
            )!;

            return (
              <ProductCard
                product={item}
                owner={owner}
                onPress={() => openProduct(item)}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.greeting}>
                  Olá, {currentUser.name.split(" ")[0]} 👋
                </Text>

                <Text style={styles.subtitle}>
                  Veja quais produtos foram anunciados hoje!
                </Text>
              </View>

              {/* Categorias */}
              <View style={styles.categorySection}>
                <Text style={styles.sectionTitle}>
                  Categorias
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoryList}
                  nestedScrollEnabled
                >
                  {/* Expressão -> pedaço de código que é avaliado e resulta em um valor */}
                  {/* Declaração -> instrução que define algo, uma variável ou função */}

                  {categoryCards.map((item) => {
                    const isSelected =
                      selectedCategoryId === item.id;

                    return (
                      <Pressable
                        key={item.id}
                        style={[
                          styles.categoryCard,
                          isSelected &&
                            styles.categoryCardSelected,
                        ]}
                        onPress={() => {
                          setSelectedCategoryId((current) =>
                            current === item.id
                              ? null
                              : item.id,
                          );
                        }}
                      >
                        {item.image ? (
                          <Image
                            source={item.image}
                            style={styles.categoryImage}
                          />
                        ) : (
                          <View
                            style={
                              styles.categoryImagePlaceholder
                            }
                          >
                            <Text
                              style={
                                styles.categoryPlaceholderText
                              }
                            >
                              📦
                            </Text>
                          </View>
                        )}

                        <Text
                          style={[
                            styles.categoryName,
                            isSelected &&
                              styles.categoryNameSelected,
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Filtros */}
              <View style={styles.exploreSection}>
                <Text style={styles.sectionTitle}>
                  Explorar
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterList}
                  nestedScrollEnabled
                >
                  <Pressable
                    style={[
                      styles.filterButton,
                      selectedFilter === "today" &&
                        styles.filterButtonSelected,
                    ]}
                    onPress={() =>
                      toggleFilter("today")
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === "today" &&
                          styles.filterButtonTextSelected,
                      ]}
                    >
                      Lançados hoje
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.filterButton,
                      selectedFilter === "featured" &&
                        styles.filterButtonSelected,
                    ]}
                    onPress={() =>
                      toggleFilter("featured")
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === "featured" &&
                          styles.filterButtonTextSelected,
                      ]}
                    >
                      Destaques
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.filterButton,
                      selectedFilter === "trusted" &&
                        styles.filterButtonSelected,
                    ]}
                    onPress={() =>
                      toggleFilter("trusted")
                    }
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        selectedFilter === "trusted" &&
                          styles.filterButtonTextSelected,
                      ]}
                    >
                      Usuários confiáveis
                    </Text>
                  </Pressable>
                </ScrollView>
              </View>

              {/* Cabeçalho dos produtos */}
              <View style={styles.productsHeader}>
                <View style={styles.productsTitleContainer}>
                  <Text style={styles.sectionTitle}>
                    {selectedCategoryName ??
                      selectedFilterName ??
                      "Todos os produtos"}
                  </Text>

                  {selectedCategoryName &&
                    selectedFilterName && (
                      <Text style={styles.activeFilterText}>
                        {selectedFilterName}
                      </Text>
                    )}
                </View>

                {(selectedCategoryId ||
                  selectedFilter) && (
                  <Pressable onPress={clearFilters}>
                    <Text style={styles.clearFilter}>
                      Limpar
                    </Text>
                  </Pressable>
                )}
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>
                🔄
              </Text>

              <Text style={styles.emptyText}>
                Nenhum produto disponível para os
                filtros selecionados.
              </Text>
            </View>
          }
        />

        {/* Modal de proposta de troca */}
        <ProductTradeModal
          visible={selectedProduct !== null}
          targetProduct={selectedProduct}
          targetUser={targetUser}
          currentUserProducts={myProducts}
          currentUser={currentUser}
          onClose={closeModal}
          onConfirm={handleConfirmTrade}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  container: {
    flex: 1,
  },

  header: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.half,
  },

  greeting: {
    ...typography.h2,
    color: Colors.text,
  },

  subtitle: {
    ...typography.body,
    color: Colors.textMuted,
  },

  categorySection: {
    marginTop: Spacing.four,
  },

  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
  },

  categoryList: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },

  categoryCard: {
    alignItems: "center",
    gap: Spacing.one,
  },

  categoryCardSelected: {
    transform: [{ scale: 1.03 }],
  },

  categoryImage: {
    width: 76,
    height: 76,
    borderRadius: 8,
  },

  categoryImagePlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryPlaceholderText: {
    fontSize: 28,
  },

  categoryName: {
    ...typography.caption,
    color: Colors.textMuted,
    textAlign: "center",
  },

  categoryNameSelected: {
    color: Colors.primary,
    fontWeight: "700",
  },

  /* ─────────────────────────────────────────────
     Explorar / filtros
  ───────────────────────────────────────────── */

  exploreSection: {
    marginTop: Spacing.two,
  },

  filterList: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    gap: Spacing.two,
  },

  filterButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  filterButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  filterButtonText: {
    ...typography.caption,
    color: Colors.textMuted,
    fontWeight: "600",
  },

  filterButtonTextSelected: {
    color: Colors.surface,
  },

  /* ─────────────────────────────────────────────
     Produtos
  ───────────────────────────────────────────── */

  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },

  productsTitleContainer: {
    flex: 1,
  },

  activeFilterText: {
    ...typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.half,
  },

  clearFilter: {
    ...typography.caption,
    color: Colors.primary,
    fontWeight: "600",
    marginLeft: Spacing.two,
  },

  listContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },

  /* ─────────────────────────────────────────────
     Empty state
  ───────────────────────────────────────────── */

  emptyContainer: {
    alignItems: "center",
    paddingTop: 80,
    gap: Spacing.two,
  },

  emptyEmoji: {
    fontSize: 48,
  },

  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: "center",
    paddingHorizontal: Spacing.four,
  },
});