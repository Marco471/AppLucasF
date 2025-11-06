import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [userLogado, setUserLogado] = useState(null);

  const ADMIN_EMAIL = "marcosww.15@gmail.com"; // e-mail do administrador

  // 🔁 Verifica se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLogado(user);
    });
    return unsubscribe;
  }, []);

  // 🔐 Fazer login
  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Preencha e-mail e senha");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, senha);
      Alert.alert("Login bem-sucedido!");
      setEmail("");
      setSenha("");
    } catch (error) {
      Alert.alert("Erro ao fazer login", error.message);
    }
  };

  // 🆕 Cadastrar novo usuário (somente admin)
  const handleRegister = async () => {
    if (!email || !senha) {
      Alert.alert("Preencha e-mail e senha");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert("Novo barbeiro cadastrado com sucesso!");
      setEmail("");
      setSenha("");
    } catch (error) {
      Alert.alert("Erro ao cadastrar", error.message);
    }
  };

  // 🔑 Esqueci minha senha
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Digite seu e-mail para redefinir a senha");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("E-mail de redefinição enviado com sucesso!");
    } catch (error) {
      Alert.alert("Erro ao enviar e-mail", error.message);
    }
  };

  // 🚪 Sair do app
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Você saiu da conta");
      setUserLogado(null);
    } catch (error) {
      Alert.alert("Erro ao sair", error.message);
    }
  };

  // 👇 Se estiver logado, mostra o painel do barbeiro
  if (userLogado) {
    const isAdmin = userLogado.email === ADMIN_EMAIL;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo 👋</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Agendamentos")}
        >
          <Text style={styles.loginButtonText}>Ir para Agendamentos</Text>
        </TouchableOpacity>

        {/* 🔒 Botão de cadastrar novo barbeiro só aparece pro admin */}
        {isAdmin && (
          <>
            <Text style={{ marginTop: 30, fontWeight: "bold" }}>
              Cadastro de novo barbeiro
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Novo e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: "#007B55" }]}
              onPress={handleRegister}
            >
              <Text style={styles.loginButtonText}>Cadastrar novo barbeiro</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: "red", marginTop: 20 }]}
          onPress={handleLogout}
        >
          <Text style={styles.loginButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👇 Se não estiver logado, mostra tela de login
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lucas Firminio Barbearia</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#001F54",
    textAlign: "center",
    marginBottom: 40,
  },
  form: {
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#001F54",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#001F54",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
