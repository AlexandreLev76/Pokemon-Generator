Introduction

Cette application propose une expérience interactive autour de la génération et la collection de Pokémon uniques.
Chaque session permet à l’utilisateur de faire apparaître des créatures inédites, qu’il peut ensuite conserver, échanger ou revendre.

Objectif

L’objectif est d’offrir un environnement ludique où chaque utilisateur peut :

Générer ses propres Pokémon à partir d’une API (la pression d'un simple bouton génère le pokemon);

Conserver et gérer sa collection localement;

Revendre un Pokémon pour récupérer une partie de ses jetons et ainsi prolonger son expérience de jeu.

Fonctionnement général

Lors de sa première connexion, l’utilisateur dispose d’un capital initial de 100 jetons.
Ces jetons constituent la mmonnaie interne de l’application et sont nécessaires pour interagir avec le systèe de génération.

Génération d’un Pokémon : coûte 10 jetons.

Revente d’un Pokémon : rembourse 5 jetons à l’utilisateur.

L’application enregistre localement les Pokémon générés et les informations associées à l’utilisateur, garantissant ainsi la persistance de la collection entre les sessions.

Gestion des données

Toutes les données locales (Pokémon, jetons, historique de génération, préférences utilisateur) sont stockées dans une base IndexedDB intégrée au navigateur.
Cela permet de conserver l’état du jeu et la progression même sans connexion continue au serveur.

Communication avec l’API

La création des Pokémon repose sur une API externe spécialisée dans la génération d’images à partir de texte.