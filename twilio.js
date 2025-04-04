import twilio from "twilio";

// Initialiser le client Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Vérifier que les identifiants sont définis
if (!accountSid || !authToken || !fromNumber) {
  console.error("Configuration Twilio manquante dans les variables d'environnement");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

/**
 * Envoie un message WhatsApp à un utilisateur.
 * @param {string} to - Numéro de téléphone du destinataire (ex: "whatsapp:+221770000000").
 * @param {string} message - Le contenu du message.
 * @returns {Promise<Object>} - La réponse de l'API Twilio.
 */
export async function sendMessage(to, message) {
  try {
    // Vérifier que le numéro du destinataire est au format WhatsApp
    if (!to.startsWith("whatsapp:+")) {
      throw new Error(`Format de numéro incorrect: ${to}. Le format doit être 'whatsapp:+XXXXXXXXXX'`);
    }
    
    // Vérifier que le message n'est pas vide
    if (!message || message.trim() === "") {
      throw new Error("Le message ne peut pas être vide");
    }
    
    const msg = await client.messages.create({
      body: message,
      from: fromNumber, // Exemple : 'whatsapp:+14155238886'
      to: to,
    });
    
    console.log("Message envoyé via Twilio, SID :", msg.sid);
    return msg;
  } catch (error) {
    console.error("Erreur lors de l'envoi via Twilio:", error.message);
    
    // Ajouter plus de détails de diagnostic pour les erreurs Twilio
    if (error.code) {
      console.error(`Code d'erreur Twilio: ${error.code}`);
      console.error(`Plus d'informations: ${error.moreInfo}`);
    }
    
    throw error;
  }
}