import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import type { Product, User, Negotiation } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

type ProductTradeModalProps = {
  visible: boolean;
  /** O produto do outro usuário que o currentUser quer obter */
  targetProduct: Product | null;
  targetUser: User | null;
  /** Produtos que pertencem ao currentUser */
  currentUserProducts: Product[];
  currentUser: User;
  onClose: () => void;
  /** Chamado quando a proposta é confirmada e válida */
  onConfirm: (negotiation: Omit<Negotiation, 'id'>) => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  'cat-1': '💻',
  'cat-2': '🎮',
  'cat-3': '📚',
  'cat-4': '🏃',
};

/**
 * ProductTradeModal — modal de proposta de troca inspirado na janela de trade do WoW.
 *
 * Mostra:
 *   - Produto que o currentUser quer obter (do outro usuário)
 *   - Produtos do currentUser para selecionar como oferta
 *
 * Regras de negócio validadas antes do envio:
 *   - Deve haver pelo menos um produto selecionado
 *   - O currentUser não pode negociar consigo mesmo
 *   - Não é possível selecionar o mesmo produto duas vezes (tratado pelo toggle)
 *
 * Estado local: selectedProductIds — pertence naturalmente ao modal.
 */
export default function ProductTradeModal({
  visible,
  targetProduct,
  targetUser,
  currentUserProducts,
  currentUser,
  onClose,
  onConfirm,
}: ProductTradeModalProps) {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Reseta seleção ao fechar
  const handleClose = () => {
    setSelectedProductIds([]);
    onClose();
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleConfirm = () => {
    // Regra: deve haver pelo menos um produto oferecido
    if (selectedProductIds.length === 0) {
      Alert.alert(
        'Oferta vazia',
        'Selecione pelo menos um produto para oferecer.'
      );
      return;
    }

    // Regra: não pode negociar consigo mesmo
    if (!targetUser || !targetProduct) return;
    if (currentUser.id === targetUser.id) {
      Alert.alert('Ação inválida', 'Você não pode negociar consigo mesmo.');
      return;
    }

    const negotiation: Omit<Negotiation, 'id'> = {
      initiatorId: currentUser.id,
      receiverId: targetUser.id,
      offeredProductIds: selectedProductIds,
      requestedProductIds: [targetProduct.id],
      status: 'pending',
    };

    setSelectedProductIds([]);
    onConfirm(negotiation);
  };

  if (!targetProduct || !targetUser) return null;

  const targetEmoji = CATEGORY_EMOJI[targetProduct.categoryId] ?? '📦';

  // Produtos disponíveis do currentUser — somente os marcados como disponíveis
  const availableProducts = currentUserProducts.filter(
    (p) => p.availableForTrade
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Propor Troca</Text>
          <Pressable onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Seção: produto do outro usuário */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Avatar name={targetUser.name} size={28} />
              <Text style={styles.sectionTitle}>
                Produto de {targetUser.name}
              </Text>
            </View>

            <View style={styles.targetProductCard}>
              <Text style={styles.targetProductEmoji}>{targetEmoji}</Text>
              <View style={styles.targetProductInfo}>
                <Text style={styles.targetProductName}>{targetProduct.name}</Text>
                <Text style={styles.targetProductDescription} numberOfLines={2}>
                  {targetProduct.description}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Seção: produtos do currentUser */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua oferta</Text>
            <Text style={styles.sectionSubtitle}>
              Selecione os produtos que você quer oferecer em troca
            </Text>

            {availableProducts.length === 0 ? (
              <Text style={styles.emptyText}>
                Você não tem produtos disponíveis para troca.
              </Text>
            ) : (
              <View style={styles.productGrid}>
                {availableProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  const emoji = CATEGORY_EMOJI[product.categoryId] ?? '📦';

                  return (
                    <Pressable
                      key={product.id}
                      style={[
                        styles.productOption,
                        isSelected && styles.productOptionSelected,
                      ]}
                      onPress={() => toggleProduct(product.id)}
                    >
                      <Text style={styles.productOptionEmoji}>{emoji}</Text>
                      <Text
                        style={[
                          styles.productOptionName,
                          isSelected && styles.productOptionNameSelected,
                        ]}
                        numberOfLines={2}
                      >
                        {product.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Resumo da proposta */}
          {selectedProductIds.length > 0 && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Resumo da proposta</Text>
              <Text style={styles.summaryText}>
                Você oferece {selectedProductIds.length}{' '}
                {selectedProductIds.length === 1 ? 'produto' : 'produtos'} em
                troca de {targetProduct.name}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer com ação */}
        <View style={styles.footer}>
          <Button
            title={
              selectedProductIds.length === 0
                ? 'Selecione produtos para oferecer'
                : `Propor negociação (${selectedProductIds.length})`
            }
            onPress={handleConfirm}
            disabled={selectedProductIds.length === 0}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  section: {
    gap: Spacing.two,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sectionTitle: {
    ...typography.h3,
    color: Colors.text,
  },
  sectionSubtitle: {
    ...typography.body,
    color: Colors.textMuted,
  },
  targetProductCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  targetProductEmoji: {
    fontSize: 48,
  },
  targetProductInfo: {
    flex: 1,
    gap: Spacing.one,
  },
  targetProductName: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  targetProductDescription: {
    ...typography.caption,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.two,
  },
  emptyText: {
    ...typography.body,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingVertical: Spacing.four,
  },
  productGrid: {
    gap: Spacing.two,
  },
  productOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.two,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  productOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#F0EEFF',
  },
  productOptionEmoji: {
    fontSize: 28,
  },
  productOptionName: {
    ...typography.body,
    color: Colors.text,
    flex: 1,
  },
  productOptionNameSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: Spacing.one,
  },
  summaryTitle: {
    ...typography.body,
    fontWeight: '600',
    color: Colors.primary,
  },
  summaryText: {
    ...typography.body,
    color: Colors.text,
  },
  footer: {
    padding: Spacing.four,
    paddingBottom: Spacing.five,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
