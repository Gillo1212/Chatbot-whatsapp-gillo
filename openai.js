import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Utilise l'API OpenAI pour générer une réponse basée sur le message utilisateur.
 * @param {string} message - Le message envoyé par l'utilisateur.
 * @returns {Promise<string>} - La réponse générée par OpenAI.
 */
export async function getGPTResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Vous êtes un assistant virtuel utile et amical."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    throw error;
  }
}