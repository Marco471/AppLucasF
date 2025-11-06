import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AgendamentoItem({ agendamento }) {
  return (
    <View style={styles.card}>
      <Text style={styles.nome}>👤 {agendamento.nome}</Text>
      <Text style={styles.info}>📞 {agendamento.telefone}</Text>
      <Text style={styles.info}>💈 Serviço: {agendamento.servico}</Text>
      <Text style={styles.info}>💵 Valor: {agendamento.preco}</Text>
      <Text style={styles.info}>
        📅 {agendamento.dia}/{agendamento.mes}/{agendamento.ano} às {agendamento.hora}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001F54',
    marginBottom: 5,
  },
  info: {
    fontSize: 15,
    color: '#333',
    marginBottom: 3,
  },
});
