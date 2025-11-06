import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PrecoItem({ preco }) {
  return (
    <View style={styles.item}>
      <Text>{preco.servico}: R$ {preco.valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding:10, borderBottomWidth:1, borderColor:'#ccc' }
});

