import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Définition du schéma pour les voitures et les réservations
const schema = a.schema({
  Car: a
    .model({
      marque: a.string(),
      modele: a.string(),
      annee: a.number(), // Correctement défini
      prix: a.number(),  // Correctement défini
    })
    .authorization((allow) => [allow.publicApiKey()]), // Autorisation publique

  Reservation: a
    .model({
      carId: a.string(), // L'ID de la voiture réservée
      date: a.string(), // La date de réservation
    })
    .authorization((allow) => [allow.publicApiKey()]), // Autorisation publique
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey", // Utilisation de la clé API
    apiKeyAuthorizationMode: {
      expiresInDays: 30, // Durée de validité de la clé API
    },
  },
});
