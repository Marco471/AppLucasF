// src/testeFirestoreNode.cjs
const admin = require("firebase-admin");
const { readFileSync } = require("fs");

// Lê a chave JSON do Admin SDK
const serviceAccount = JSON.parse(
  readFileSync("./src/serviceAccountKey.json", "utf8")
);

// Inicializa o Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Função para testar escrita
async function testarEscrita() {
  try {
    const precos = {
      corteSemana: "40",
      corteFim: "50",
      barba: "30",
      cabeloBarba: "60",
      platinado: "120",
      atualizadoEm: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("precos").doc("tabela").set(precos);

    console.log("✅ Preços salvos com sucesso no Firestore!");
  } catch (e) {
    console.error("❌ Erro ao salvar:", e.message);
  }
}

testarEscrita();

