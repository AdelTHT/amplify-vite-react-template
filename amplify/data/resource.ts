import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Définition du schéma pour les voitures
const schema = a.schema({
  Car: a
    .model({
      marque: a.string(),
      modele: a.string(),
      annee: a.number(),
      prix: a.number(),
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
