import admin from "firebase-admin";

// Configuration du service account à partir des variables d'environnement.
// Assure-toi que les retours à la ligne dans ta clé privée sont bien pris en compte.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


/**
 * Enregistre une interaction dans la collection 'interactions' de Firestore.
 * @param {Object} param0 - Détails de l'interaction.
 */

export async function logInteraction({ userId, message, response, type }) {
  try {
    await db.collection("interactions").add({
      userId,
      message,
      response,
      timestamp: admin.firestore.Timestamp.now(), // Utilisation d'un Timestamp Firestore
      type,
    });
    console.log(`Interaction enregistrée pour ${userId}`);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement dans Firestore :", error);
    throw error;
  }
}

export { db };
