// src/screens/Historico.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function Historico() {
  const navigation = useNavigation();
  const [historico, setHistorico] = useState([]);

  // 🔹 Pega os agendamentos finalizados em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "historico"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistorico(data);
    });

    return () => unsub();
  }, []);

  // 🔹 Limpar histórico manualmente
  const handleLimparHistorico = async () => {
    if (historico.length === 0) {
      Alert.alert("Não há agendamentos finalizados para apagar.");
      return;
    }

    try {
      for (const item of historico) {
        await deleteDoc(doc(db, "historico", item.id));
      }
      Alert.alert("Histórico limpo com sucesso!");
    } catch (error) {
      Alert.alert("Erro ao limpar histórico", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Histórico de Agendamentos</Text>
      <Text style={styles.subTitle}>
        Total de finalizados: {historico.length}
      </Text>

      <View style={styles.content}>
        {historico.length === 0 ? (
          <Text style={styles.semHistorico}>Nenhum agendamento finalizado.</Text>
        ) : (
          historico.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.texto}>📞 {item.telefone}</Text>
              <Text style={styles.texto}>💈 {item.servico} - {item.preco}</Text>
              <Text style={styles.texto}>
                📅 {item.dia}/{item.mes}/{item.ano} às {item.hora}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* 🔹 Botão Limpar histórico */}
      <TouchableOpacity
        style={styles.limparButton}
        onPress={handleLimparHistorico}
      >
        <Text style={styles.limparText}>Limpar histórico</Text>
      </TouchableOpacity>

      {/* 🔹 Botão Voltar discreto */}
      <TouchableOpacity
        style={styles.voltarButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.voltarText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#001F54",
    textAlign: "center",
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 15,
  },
  content: {
    minHeight: 300,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#001F54",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#001F54",
  },
  texto: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  semHistorico: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  limparButton: {
    backgroundColor: "#001F54",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  limparText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  voltarButton: {
    alignItems: "center",
    marginBottom: 30,
  },
  voltarText: {
    color: "#001F54",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

