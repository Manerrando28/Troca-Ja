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
import { useLocalSearchParams, Stack } from 'expo-router';
import { negotiations, messages as mockMessages, users, products, CURRENT_USER_ID } from '@/data';
import type { Message } from '@/types';
import { Colors, Spacing, typography } from '@/tokens/theme';
import Avatar from '@/components/ui/Avatar';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Encontrar negociação
  const negotiation = negotiations.find((n) => n.id === id);
  const [chatMessages, setChatMessages] = useState<Message[]>(
    mockMessages.filter((m) => m.negotiationId === id)
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  if (!negotiation) {
    return (
      <View style={styles.errorContainer}>
        <Text>Negociação não encontrada.</Text>
      </View>
    );
  }

  const otherUserId =
    negotiation.initiatorId === CURRENT_USER_ID
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
    negotiation.initiatorId === CURRENT_USER_ID
      ? offeredProducts
      : requestedProducts;
  const theirOffered =
    negotiation.initiatorId === CURRENT_USER_ID
      ? requestedProducts
      : offeredProducts;

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      negotiationId: negotiation.id,
      senderId: CURRENT_USER_ID,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputText('');
    
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
          const isMe = item.senderId === CURRENT_USER_ID;
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
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{timeStr}</Text>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Mensagem"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            (!inputText.trim() || pressed) && { opacity: 0.7 },
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5DDD5', // Cor de fundo clássica do WhatsApp
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
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 12,
    marginBottom: Spacing.one,
  },
  messageBubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6', // Cor verde do WhatsApp
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
    backgroundColor: 'transparent',
    gap: Spacing.one,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent', // Para dar espaço
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
