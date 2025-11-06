// src/screens/AtualizarPreco.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function AtualizarPreco() {
  const [precos, setPrecos] = useState({
    "Corte terça a quinta": "",
    "Corte sexta a sábado": "",
    "Barba tradicional": "",
    "Cabelo + Barba": "",
    "Platinado": "",
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPrecos = async () => {
      try {
        const docRef = doc(db, "precos", "tabela");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setPrecos({
            "Corte terça a quinta": snapshot.data().corteSemana,
            "Corte sexta a sábado": snapshot.data().corteFim,
            "Barba tradicional": snapshot.data().barba,
            "Cabelo + Barba": snapshot.data().cabeloBarba,
            "Platinado": snapshot.data().platinado,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar preços:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrecos();
  }, []);

  const handleChange = (field, value) => {
    setPrecos({ ...precos, [field]: value });
  };

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "precos", "tabela");
      await updateDoc(docRef, {
        corteSemana: Number(precos["Corte terça a quinta"]),
        corteFim: Number(precos["Corte sexta a sábado"]),
        barba: Number(precos["Barba tradicional"]),
        cabeloBarba: Number(precos["Cabelo + Barba"]),
        platinado: Number(precos["Platinado"]),
        atualizadoEm: serverTimestamp(),
      });
      Alert.alert("Sucesso", "Preços atualizados!");
    } catch (error) {
      console.error("Erro ao atualizar preços:", error);
      Alert.alert("Erro", "Não foi possível atualizar os preços.");
    }
  };

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
      <Text style={styles.title}>Atualizar Preços 💈</Text>

      {Object.keys(precos).map((key) => (
        <View key={key} style={styles.inputContainer}>
          <Text style={styles.label}>{key}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={precos[key].toString()}
            onChangeText={(text) => handleChange(key, text)}
          />
        </View>
      ))}

      <Button title="Atualizar Preços" onPress={handleUpdate} color="#001F54" />

      {/* Botão Voltar discreto */}
      <TouchableOpacity style={styles.voltarButton} onPress={() => navigation.goBack()}>
        <Text style={styles.voltarText}>← Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F9F9F9", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#001F54", textAlign: "center" },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 16, color: "#001F54", marginBottom: 5 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: "#fff" },
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
