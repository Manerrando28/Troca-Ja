import { useState, useRef } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useApp } from "@/state/AppProvider";
import { demoAccounts } from "@/domain/auth";
import { Colors, Fonts, typography } from "@/tokens/theme";
import Button from "@/components/ui/Button";
export default function Login() {
  const { userId, login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const passwordRef = useRef<TextInput>(null);
  if (userId) return <Redirect href="/(tabs)" />;
  function submit() {
    try {
      setError("");
      login(email, password);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Não foi possível entrar.",
      );
    }
  }
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.brand}>
            <Image
              source={require("../../../assets/ui-images/logo.png")}
              accessibilityLabel="Logo TrocaJá"
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.wordmark}>
              Troca<Text style={styles.blue}>Já</Text>
            </Text>
          </View>
          <Text style={styles.kicker}>
            MENOS DESPERDÍCIO. MAIS POSSIBILIDADES.
          </Text>
          <Text accessibilityRole="header" style={styles.heading}>
            Bom ter você aqui.
          </Text>
          <Text style={styles.subtitle}>
            Entre e encontre uma nova história para o que você já tem.
          </Text>
          <View style={styles.form}>
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.field}>
              <Feather name="mail" size={19} color={Colors.textMuted} />
              <TextInput
                accessibilityLabel="E-mail"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                placeholder="seu@email.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                style={styles.input}
              />
            </View>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.field}>
              <Feather name="lock" size={19} color={Colors.textMuted} />
              <TextInput
                ref={passwordRef}
                accessibilityLabel="Senha"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="current-password"
                secureTextEntry={!visible}
                placeholder="Digite sua senha"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                returnKeyType="go"
                onSubmitEditing={submit}
                style={styles.input}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={visible ? "Ocultar senha" : "Mostrar senha"}
                onPress={() => setVisible(!visible)}
                style={styles.eye}
              >
                <Feather
                  name={visible ? "eye-off" : "eye"}
                  size={19}
                  color={Colors.textMuted}
                />
              </Pressable>
            </View>
            {!!error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            <View style={styles.action}>
              <Button title="Entrar" onPress={submit} />
            </View>
          </View>
          <View style={styles.demo}>
            <View style={styles.demoTitle}>
              <Feather name="info" size={16} color={Colors.primary} />
              <Text style={styles.label}>Contas para demonstração</Text>
            </View>
            <Text style={styles.demoDescription}>
              Digite um dos pares de e-mail e senha abaixo.
            </Text>
            {demoAccounts.map((account) => (
              <View key={account.userId} style={styles.account}>
                <Text style={styles.accountName}>{account.name}</Text>
                <View style={styles.accountDetails}>
                  <Text selectable style={styles.credentials}>
                    {account.email}
                  </Text>
                  <Text selectable style={styles.password}>
                    Senha: {account.password}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <Text style={styles.footnote}>Trocas que conectam a comunidade.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: Colors.surface },
  content: { paddingHorizontal: 28, paddingTop: 28, paddingBottom: 24 },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logo: { width: 40, height: 40 },
  wordmark: { fontFamily: Fonts.bold, fontSize: 25, color: Colors.navy },
  blue: { color: Colors.primary },
  kicker: {
    fontFamily: Fonts.semibold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: Colors.accent,
    marginBottom: 10,
  },
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 28,
    lineHeight: 35,
    color: Colors.navy,
  },
  subtitle: {
    ...typography.body,
    color: Colors.textMuted,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },
  form: { gap: 8 },
  label: { fontFamily: Fonts.semibold, fontSize: 13, color: Colors.text },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingLeft: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    gap: 10,
    marginBottom: 8,
  },
  input: {
    ...typography.body,
    color: Colors.text,
    flex: 1,
    minWidth: 0,
    height: 50,
    outlineWidth: 0,
    paddingRight: 12,
    paddingLeft: 8
  },
  eye: {
    minWidth: 44,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  action: { marginTop: 4 },
  error: { ...typography.caption, color: Colors.error, lineHeight: 18 },
  demo: {
    marginTop: 26,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  demoTitle: { flexDirection: "row", alignItems: "center", gap: 8 },
  demoDescription: {
    ...typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 18,
  },
  account: {
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  accountName: {
    fontFamily: Fonts.semibold,
    fontSize: 12,
    width: 50,
    color: Colors.text,
  },
  accountDetails: { flex: 1 },
  credentials: { ...typography.caption, color: Colors.secondaryText },
  password: { ...typography.caption, color: Colors.textMuted, marginTop: 3 },
  footnote: {
    ...typography.caption,
    textAlign: "center",
    color: Colors.textMuted,
    marginTop: 24,
  },
});
