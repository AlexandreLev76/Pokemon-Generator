Spécification de l’API de génération de Pokémon
Description

Cette API permet de générer dynamiquement un Pokémon unique à partir d’une description textuelle.
Chaque requête produit une image en base64 et assigne au Pokémon un nom ainsi qu’un niveau de rareté aléatoire ou contextuel.

Endpoint

POST https://epsi.journeesdecouverte.fr:22222/v1/generate

Corps de la requête (Request Body)

Le corps de la requête doit être au format JSON.

Champ	Type	Obligatoire	Description
prompt	string	✅	Description textuelle du Pokémon à générer (ex. : « Un oiseau de feu majestueux avec des plumes dorées »). Sert de base au moteur text-to-image.
trainerId	string	✅	Identifiant unique du joueur. Permet de tracer les générations par utilisateur.
seed	number	❌	Valeur optionnelle utilisée pour obtenir la même génération à partir d’un même prompt. Si absente, une valeur aléatoire est utilisée.
Exemple de corps de requête
{
  "prompt": "Un dragon d'eau avec des ailes en cristal bleu",
  "trainerId": "trainer_12345",
  "seed": 98765
}

Réponse (Response Body)

La réponse est renvoyée au format JSON, contenant les informations complètes du Pokémon généré.

Champ	Type	Description
name	string	Nom attribué automatiquement au Pokémon (généré aléatoirement ou en lien avec le prompt).
rarity	string	Niveau de rareté du Pokémon : F, E, D, C, B, A, S, S+.
image	string (base64)	Données encodées de l’image du Pokémon (préfixée par data:image/png;base64,).
timestamp	string (ISO 8601)	Date et heure de génération du Pokémon.
Exemple de réponse
{
  "name": "Aquadris",
  "rarity": "A",
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "timestamp": "2025-11-12T09:34:12.583Z"
}

Exemple d’utilisation en JavaScript
async function generatePokemon(prompt, trainerId) {
  const response = await fetch("https://epsi.journeesdecouverte.fr:22222/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt,
      trainerId
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  const data = await response.json();

  console.log(`Pokémon généré : ${data.name}`);
  console.log(`Rareté : ${data.rarity}`);

  // Affiche l'image dans le navigateur
  const img = document.createElement("img");
  img.src = data.image;
  document.body.appendChild(img);
}

// Exemple d'appel
generatePokemon("Un renard de feu mystique", "trainer_123");

Codes d’erreur possibles
Code	Signification	Description
400 Bad Request	Requête invalide	Champ prompt manquant ou non valide.
429 Too Many Requests	Limite de requêtes atteinte	L’utilisateur a dépassé la fréquence autorisée.
500 Internal Server Error	Erreur interne	Problème dans le processus de génération d’image.