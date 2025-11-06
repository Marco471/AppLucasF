// src/AtualizarPrecoNode.cjs
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // JSON do Firebase Admin

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Atualizar preços corretamente
async function atualizarPrecos() {
  try {
    await db.collection('precos').doc('tabela').set({
      barba: 26,          // Barba tradicional
      cabeloBarba: 130,   // Cabelo + Barba
      corteSemana: 35,    // Corte terça a quinta
      corteFim: 120,      // Corte sexta e sábado
      platinado: 69,      // Platinado
      atualizadoEm: new Date() // Timestamp
    }, { merge: true }); // merge garante que não sobrescreve campos extras do documento

    console.log("✅ Preços atualizados com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar preços:", error);
  }
}

// Executa a função
atualizarPrecos();
