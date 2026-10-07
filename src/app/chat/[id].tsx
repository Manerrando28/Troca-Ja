import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';
import { users, products } from '@/data';
import { useApp } from '@/state/AppProvider';
import Notice from '@/components/ui/Notice';

import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { state: { negotiations, messages }, userId, sendMessage: appendMessage } = useApp();
  const [error, setError] = useState('');
  // Encontrar negociação
  const negotiation = negotiations.find((n) => n.id === id);
  const chatMessages = messages.filter(m => m.negotiationId === id);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  if (!negotiation || negotiation.status !== 'accepted' || ![negotiation.initiatorId, negotiation.receiverId].includes(userId ?? '')) {
    return (
      <View style={styles.errorContainer}>
        <Text>Conversa indisponível. Aceite uma proposta da qual você participa.</Text>
      </View>
    );
  }

  const otherUserId =
    negotiation.initiatorId === userId
      ? negotiation.receiverId
      : negotiation.initiatorId;
  const otherUser = users.find((u) => u.id === otherUserId)!;

  // Produtos sendo negociados
  const offeredProducts = products.filter((p) =>
    negotiation.offeredProductIds.includes(p.id)
  );
  const requestedProducts = products.filter((p) =>
    negotiation.requestedProductIds.includes(p.id)
  );

  const myOffered =
    negotiation.initiatorId === userId
      ? offeredProducts
      : requestedProducts;
  const theirOffered =
    negotiation.initiatorId === userId
      ? requestedProducts
      : offeredProducts;

  const sendMessage = () => {
    if (!inputText.trim()) return;

    try {
      appendMessage(negotiation.id, inputText);
      setInputText('');
      setError('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível enviar.');
    }
    
    // Simular rolagem para o fim
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Header customizado da Stack
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Avatar name={otherUser.name} size={32} />
              <Text style={styles.headerTitle}>{otherUser.name}</Text>
            </View>
          ),
          headerBackVisible: true,
          headerTintColor: Colors.primary,
        }}
      />

      {/* Faixa superior mostrando os itens da troca */}
      <View style={styles.tradeBanner}>
        <View style={styles.tradeBannerSide}>
          <Text style={styles.tradeBannerLabel}>Você oferece</Text>
          <Text style={styles.tradeBannerProduct} numberOfLines={1}>
            {myOffered.map((p) => p.name).join(', ')}
          </Text>
        </View>
        <Text style={styles.tradeBannerArrow}>↔</Text>
        <View style={[styles.tradeBannerSide, { alignItems: 'flex-end' }]}>
          <Text style={styles.tradeBannerLabel}>Em troca de</Text>
          <Text style={styles.tradeBannerProduct} numberOfLines={1}>
            {theirOffered.map((p) => p.name).join(', ')}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={chatMessages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        renderItem={({ item }) => {
          const isMe = item.senderId === userId;
          const d = new Date(item.timestamp);
          const timeStr = `${d.getHours().toString().padStart(2, '0')}:${d
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;

          return (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.messageBubbleMe : styles.messageBubbleThem,
              ]}
            >
              <Text style={[styles.messageText, isMe && { color: Colors.surface }]}>{item.text}</Text>
              <Text style={[styles.messageTime, isMe && { color: Colors.onBrandMuted }]}>{timeStr}</Text>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {!!error && <Notice error message={error} />}
      {/* Input area */}
      <View style={[styles.inputArea, { paddingBottom: Math.max(12, insets.bottom) }]}>
        <TextInput
          style={styles.input}
          placeholder="Mensagem"
          accessibilityLabel="Mensagem"
          maxLength={1000}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (!inputText.trim() || pressed) && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensagem"
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Feather name="send" size={19} color={Colors.surface} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, 
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  headerTitle: {
    ...typography.h3,
    fontSize: 18,
    color: Colors.text,
  },
  tradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tradeBannerSide: {
    flex: 1,
  },
  tradeBannerLabel: {
    ...typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  tradeBannerProduct: {
    ...typography.caption,
    fontWeight: '600',
    color: Colors.text,
  },
  tradeBannerArrow: {
    fontSize: 16,
    color: Colors.textMuted,
    marginHorizontal: Spacing.two,
  },
  messagesList: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: Spacing.one,
  },
  messageBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary, 
    borderTopRightRadius: 2,
  },
  messageBubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 2,
  },
  messageText: {
    ...typography.body,
    color: Colors.text,
    fontSize: 15,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.textMuted,
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.two,
    backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
    gap: 10, paddingHorizontal: 16, paddingTop: 12,
  },
  input: {
    outlineWidth: 0, minHeight: 44, color: Colors.text,
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border, // Para dar espaço
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: Colors.surface,
    fontSize: 20,
  },
});
