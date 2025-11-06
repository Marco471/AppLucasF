// src/screens/Preco.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Preco() {
  const [precos, setPrecos] = useState({});
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const docRef = doc(db, "precos", "tabela");

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setPrecos(snapshot.data());
        }
        setLoading(false);
      },
      (error) => {
        console.log("Erro ao carregar preços em tempo real:", error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001F54" />
        <Text style={styles.loadingText}>Carregando preços...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Preços 💈</Text>

      <View style={styles.precoItem}>
        <Text style={styles.label}>Corte (terça a quinta):</Text>
        <Text style={styles.valor}>R$ {precos.corteSemana}</Text>
      </View>

      <View style={styles.precoItem}>
        <Text style={styles.label}>Corte (sexta e sábado):</Text>
        <Text style={styles.valor}>R$ {precos.corteFim}</Text>
      </View>

      <View style={styles.precoItem}>
        <Text style={styles.label}>Barba Tradicional:</Text>
        <Text style={styles.valor}>R$ {precos.barba}</Text>
      </View>

      <View style={styles.precoItem}>
        <Text style={styles.label}>Cabelo + Barba:</Text>
        <Text style={styles.valor}>R$ {precos.cabeloBarba}</Text>
      </View>

      <View style={styles.precoItem}>
        <Text style={styles.label}>Platinado:</Text>
        <Text style={styles.valor}>R$ {precos.platinado}</Text>
      </View>

      {/* Botão Voltar */}
      <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9F9F9", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 25, color: "#001F54" },
  precoItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  label: { fontSize: 16, color: "#001F54" },
  valor: { fontSize: 16, fontWeight: "bold", color: "#001F54" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, color: "#001F54" },
  voltarButton: {
    marginTop: 30,
    padding: 10,
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  voltarText: {
    color: "#001F54",
    fontWeight: "600",
  },
});
