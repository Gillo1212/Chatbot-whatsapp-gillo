import cron from "node-cron";
import { db, logInteraction } from "./firestore.js";
import { sendMessage } from "./twilio.js";

/**
 * Vérifie les interactions et envoie des messages automatisés aux utilisateurs inactifs depuis plus de 24 heures.
 */
async function sendAutomatedMessages() {
  try {
    const now = Date.now();
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);

    // Récupère la liste de tous les utilisateurs ayant interagi avec le système
    const usersSnapshot = await db.collection("interactions")
      .orderBy("timestamp", "desc")
      .get();
    
    // Utilise une Map pour stocker le dernier timestamp d'interaction pour chaque utilisateur
    const lastInteractionMap = new Map();
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      const timestamp = data.timestamp;
      
      // Si l'utilisateur n'existe pas encore dans la map, ou si cette interaction est plus récente
      if (!lastInteractionMap.has(userId) || timestamp > lastInteractionMap.get(userId)) {
        lastInteractionMap.set(userId, timestamp);
      }
    });
    
    // Identifie les utilisateurs inactifs (dernière interaction > 24h)
    const inactiveUsers = [];
    for (const [userId, lastTimestamp] of lastInteractionMap.entries()) {
      if (lastTimestamp < twentyFourHoursAgo) {
        inactiveUsers.push(userId);
      }
    }

    // Pour chaque utilisateur inactif, envoie un message de relance
    for (const userId of inactiveUsers) {
      const reminderMessage = "Bonjour, nous n'avons pas eu de nouvelles depuis un moment. N'hésitez pas à nous contacter si vous avez besoin d'aide !";
      console.log(`Envoi d'une relance à ${userId}`);
      await sendMessage(userId, reminderMessage);

      // Enregistrement de la relance dans Firestore
      await logInteraction({
        userId,
        message: "",
        response: reminderMessage,
        timestamp: Date.now(),
        type: "automated"
      });
    }
    
    console.log(`${inactiveUsers.length} rappels automatiques envoyés.`);
  } catch (error) {
    console.error("Erreur lors de l'envoi des messages automatisés :", error);
  }
}

// Planifie la tâche pour qu'elle s'exécute toutes les heures (à la minute 0)
cron.schedule("0 * * * *", () => {
  console.log("Lancement de la tâche automatisée");
  sendAutomatedMessages();
});