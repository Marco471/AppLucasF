// src/screens/TestePreco.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function TestePreco() {
  const [valor, setValor] = useState("");

  const salvarPreco = async () => {
    try {
      if (!valor) {
        Alert.alert("Erro", "Digite um valor!");
        return;
      }

      // Converte para número
      const precoNumero = Number(valor);

      // Salva no Firestore
      await setDoc(doc(db, "precos", "tabela"), { corteSemana: precoNumero, atualizadoEm: serverTimestamp() });

      Alert.alert("Sucesso", "Preço salvo no Firebase!");
    } catch (error) {
      Alert.alert("Erro", error.message);
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste Atualizar Preço</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o valor do corte"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={salvarPreco}>
        <Text style={styles.buttonText}>Salvar Preço</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F9F9F9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#001F54" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, width: "100%", marginBottom: 15, backgroundColor: "#fff" },
  button: { backgroundColor: "#001F54", padding: 15, borderRadius: 10, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
