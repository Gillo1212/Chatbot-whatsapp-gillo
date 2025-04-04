import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";

import { getGPTResponse } from "./openai.js";
import { sendMessage } from "./twilio.js";
import { logInteraction } from "./firestore.js";

// Lancer le module d'automatisation (les tâches s'exécutent dès l'import)
import "./automation.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fonction pour formater les numéros au format WhatsApp
function formatWhatsAppNumber(phoneNumber) {
    // Supprimer les espaces inutiles
    phoneNumber = phoneNumber.trim();
    
    // Si le numéro commence par "whatsapp:", traiter la partie après le deux-points
    if (phoneNumber.startsWith('whatsapp:')) {
      let rest = phoneNumber.slice('whatsapp:'.length).trim();
      // Si la partie restante ne commence pas par "+", l'ajouter
      if (!rest.startsWith('+')) {
        return 'whatsapp:+' + rest;
      }
      return 'whatsapp:' + rest;
    }
    
    // Sinon, extraire uniquement les chiffres et ajouter le préfixe
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return `whatsapp:+${digitsOnly}`;
  }
  
// Endpoint pour recevoir les messages WhatsApp via Twilio
app.post("/webhook", async (req, res) => {
  try {
    const { Body, From } = req.body; // 'Body' = message reçu, 'From' = numéro de l'expéditeur
    
    if (!Body || !From) {
      return res.status(400).send("Paramètres manquants");
    }
    
    const formattedFrom = formatWhatsAppNumber(From);
    console.log(`Message reçu de ${formattedFrom} : ${Body}`);

    // Enregistrement de l'interaction entrante dans Firestore
    await logInteraction({
      userId: formattedFrom,
      message: Body,
      response: "",
      timestamp: Date.now(),
      type: "inbound"
    });

    // Appel à l'API GPT-4 pour générer une réponse
    const gptResponse = await getGPTResponse(Body);
    console.log(`Réponse GPT-4 : ${gptResponse}`);

    // Enregistrement de la réponse sortante dans Firestore
    await logInteraction({
      userId: formattedFrom,
      message: "",
      response: gptResponse,
      timestamp: Date.now(),
      type: "outbound"
    });

    // Envoi de la réponse à l'utilisateur via Twilio
    await sendMessage(formattedFrom, gptResponse);

    res.status(200).send("Message traité");
  } catch (error) {
    console.error("Erreur lors du traitement du message :", error);
    res.status(500).send("Erreur lors du traitement");
  }
});

// Ajouter une route pour vérifier que le serveur est en ligne
app.get("/health", (req, res) => {
  res.status(200).send("Serveur opérationnel");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});