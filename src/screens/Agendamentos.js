import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot, doc, deleteDoc, setDoc } from "firebase/firestore";

export default function Agendamentos() {
  const navigation = useNavigation();
  const [agendamentos, setAgendamentos] = useState([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  // 🔹 Pega os agendamentos em tempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "agendamentos"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const hoje = new Date();
      const diaHoje = String(hoje.getDate()).padStart(2, "0");
      const mesHoje = String(hoje.getMonth() + 1).padStart(2, "0");

      let filtrados = mostrarTodos
        ? data
        : data.filter((item) => item.dia === diaHoje && item.mes === mesHoje);

      filtrados = filtrados.sort((a, b) => {
        const horaA = a.hora?.split(":").map(Number);
        const horaB = b.hora?.split(":").map(Number);
        if (!horaA || !horaB) return 0;
        return horaA[0] * 60 + horaA[1] - (horaB[0] * 60 + horaB[1]);
      });

      setAgendamentos(filtrados);
    });

    return () => unsub();
  }, [mostrarTodos]);

  // 🔹 Finaliza um agendamento
  const handleFinalizar = async (item) => {
    try {
      // 1️⃣ Copia para coleção "historico"
      await setDoc(doc(db, "historico", item.id), {
        ...item,
        status: "finalizado",
      });

      // 2️⃣ Remove da coleção "agendamentos"
      await deleteDoc(doc(db, "agendamentos", item.id));

      Alert.alert("Agendamento finalizado!");
    } catch (error) {
      Alert.alert("Erro ao finalizar agendamento", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {mostrarTodos ? "Todos os Agendamentos" : "Agendamentos de Hoje"}
      </Text>

      <Text style={styles.subTitle}>
        Total de clientes: {agendamentos.length}
      </Text>

      <TouchableOpacity
        style={styles.botaoToggle}
        onPress={() => setMostrarTodos(!mostrarTodos)}
      >
        <Ionicons
          name={mostrarTodos ? "filter-outline" : "list-outline"}
          size={20}
          color="#fff"
        />
        <Text style={styles.botaoTexto}>
          {mostrarTodos ? "Ver apenas de hoje" : "Ver todos"}
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {agendamentos.length === 0 ? (
          <Text style={styles.semAgendamento}>Nenhum agendamento encontrado.</Text>
        ) : (
          agendamentos.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.texto}>📞 {item.telefone}</Text>
              <Text style={styles.texto}>💈 {item.servico} - {item.preco}</Text>
              <Text style={styles.texto}>📅 {item.dia}/{item.mes}/{item.ano} às {item.hora}</Text>

              {/* 🔹 Botão Finalizar */}
              <TouchableOpacity
                style={styles.finalizarButton}
                onPress={() => handleFinalizar(item)}
              >
                <Text style={styles.finalizarText}>Finalizar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* 🔹 Menu inferior */}
      <View style={styles.navContainer}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Login")}>
          <Ionicons name="log-in-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Agendamentos")}>
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Agendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Precos")}>
          <Ionicons name="cash-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Preços</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("AtualizarPreco")}>
          <Ionicons name="create-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate("Historico")}>
          <Ionicons name="archive-outline" size={24} color="#fff" />
          <Text style={styles.navText}>Histórico</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "bold", color: "#001F54", textAlign: "center", marginBottom: 5 },
  subTitle: { fontSize: 16, color: "#444", textAlign: "center", marginBottom: 15 },
  botaoToggle: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#001F54", paddingVertical: 8, borderRadius: 10, marginBottom: 15 },
  botaoTexto: { color: "#fff", fontSize: 14, marginLeft: 6 },
  content: { minHeight: 400, marginBottom: 20 },
  card: { backgroundColor: "#f1f1f1", padding: 15, borderRadius: 10, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: "#001F54" },
  nome: { fontSize: 18, fontWeight: "bold", color: "#001F54" },
  texto: { fontSize: 14, color: "#333", marginTop: 2 },
  semAgendamento: { textAlign: "center", color: "#666", fontSize: 16 },
  finalizarButton: { marginTop: 10, backgroundColor: "#28a745", padding: 8, borderRadius: 8, alignItems: "center" },
  finalizarText: { color: "#fff", fontWeight: "bold" },
  navContainer: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#001F54", borderRadius: 15, paddingVertical: 10, marginTop: 20 },
  navButton: { alignItems: "center" },
  navText: { color: "#fff", fontSize: 12, marginTop: 4 },
});
