import { Colors, Spacing, typography } from "@/tokens/theme";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";

export default function Login() {
  const router = useRouter();

  const handleLogin = () => {
    // Autenticação fake: vai direto para as tabs.
    // Futuramente: validar credenciais antes de navegar.
    router.replace("/(tabs)" as any);
  };

  return (
    <LinearGradient
      colors={[
        "rgb(10, 26, 58)",
        "rgb(0, 102, 255)",
        "rgb(51, 170, 255)",
      ]}
      locations={[0, 0.55, 1]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Brilho superior direito */}
      <View style={styles.topGlow} />

      {/* Brilho inferior esquerdo */}
      <View style={styles.bottomGlow} />

      {/* Conteúdo principal */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require("../../../assets/ui-images/logo.png")}
          />
        </View>

        {/* Título e subtítulo */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>TrocaJá</Text>

          <Text style={styles.subtitle}>
            Troque com quem você confia
          </Text>
        </View>

        {/* Botão */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </Pressable>
      </View>

      {/* Versão */}
      <Text style={styles.version}>v1.0 · TrocaJá</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    paddingBottom: 100,
  },

  /*
   * Brilho do canto superior direito.
   *
   * No Figma era um radial-gradient.
   * Como React Native não possui radial-gradient
   * nativo no mesmo formato, usamos uma View circular
   * com opacidade para criar um efeito semelhante.
   */
  topGlow: {
    position: "absolute",
    width: 520,
    height: 520,
    borderRadius: 260,
    top: -130,
    right: -150,
    backgroundColor: "#FFFFFF",
    opacity: 0.1,
  },

  /*
   * Brilho do canto inferior esquerdo.
   */
  bottomGlow: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    bottom: -90,
    left: -90,
    backgroundColor: Colors.secondary,
    opacity: 0.1,
  },

  /*
   * Equivalente ao:
   *
   * relative z-10
   * flex flex-col
   * items-center
   * gap-8
   */
  content: {
    alignItems: "center",
    gap: 32,
    paddingHorizontal: 40,
    zIndex: 10,
  },

  /*
   * Quadrado branco atrás do logo.
   */
  logoContainer: {
    width: 128,
    height: 128,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,

    // Sombra equivalente ao box-shadow do Figma.
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,

    // Android
    elevation: 8,
  },

  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },

  textContainer: {
    alignItems: "center",
    gap: 8,
  },

  title: {
    ...typography.h1,
    color: "#FFFFFF",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1,
    margin: 0,
  },

  subtitle: {
    ...typography.body,
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.56,
    textTransform: "uppercase",
    textAlign: "center",
    margin: 0,
  },

  button: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    paddingHorizontal: 68,
    borderRadius: 9999,
    position: "absolute",
    bottom: -200,

    shadowColor: "#0066FF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,

    elevation: 8,
  },

  buttonPressed: {
    transform: [{ scale: 0.96 }],
  },

  buttonText: {
    ...typography.body,
    fontSize: 17,
    fontWeight: "700",
    color: Colors.primary,
  },

  version: {
    position: "absolute",
    bottom: 32,
    zIndex: 10,
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 11,
    fontWeight: "500",
  },
});