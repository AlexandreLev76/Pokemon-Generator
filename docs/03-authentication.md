Authentication Specification
Overview

All requests made to the API must include an authentication header using a fixed Bearer token.
This token identifies the client application and ensures only authorized frontends can access the generation service.

Authentication Method
Type

Bearer Token (Fixed String)

Header Format

Each HTTP request to the API must include the following header:

Authorization: Bearer EPSI


This value is hardcoded and does not change per user or session.

Example Usage
Example Request (cURL)
curl -X POST https://epsi.journeesdecouverte.fr:22222/v1/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EPSI" \
  -d '{
        "prompt": "Un dragon de feu aux yeux dorés",
        "trainerId": "trainer_123"
      }'

Example Request (JavaScript)
async function generatePokemon(prompt, trainerId) {
  const response = await fetch("https://epsi.journeesdecouverte.fr:22222/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer EPSI"
    },
    body: JSON.stringify({ prompt, trainerId })
  });

  if (!response.ok) {
    throw new Error(`Erreur API : ${response.status}`);
  }

  const data = await response.json();
  console.log("Pokémon généré :", data.name);
}

Behavior

The backend validates that the request includes the correct Authorization header.

Any request without this header or with an incorrect token will be rejected.

Possible Errors
Code	Message	Description
401 Unauthorized	Missing or invalid token	The Bearer token is missing, malformed, or not equal to "EPSI".
403 Forbidden	Access denied	The provided token is recognized but not allowed for this endpoint.
Summary
Field	Value
Auth Type	Bearer Token
Token	EPSI
Required Header	Authorization: Bearer EPSI