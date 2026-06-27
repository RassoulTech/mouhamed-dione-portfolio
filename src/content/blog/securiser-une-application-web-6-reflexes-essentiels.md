---
title: "Sécuriser une application web : 6 réflexes essentiels"
date: 2026-06-23
excerpt: "Un site mal sécurisé, c'est une porte ouverte. Voici 6 réflexes de base que tout développeur doit avoir, même débutant."
tags: [Tech, Web]
photoQuery: "cyber security lock code"
published: false
---

La sécurité n'est pas réservée aux experts. Quelques réflexes simples évitent la majorité des problèmes.

## 1. Ne jamais faire confiance aux entrées utilisateur
Tout ce que tape un utilisateur peut être malveillant. **Valide et nettoie** toujours les données reçues.

## 2. Protéger ses clés secrètes
Jamais de mots de passe ou clés API dans le code public (GitHub). Utilise des **variables d'environnement**.

## 3. Hacher les mots de passe
On ne stocke **jamais** un mot de passe en clair. On le **hache** (bcrypt). Même toi, tu ne dois pas pouvoir le lire.

## 4. HTTPS partout
Le cadenas dans la barre d'adresse chiffre les données. Aujourd'hui, c'est non négociable (et gratuit).

## 5. Gérer les permissions
Chacun n'accède qu'à ce qui le concerne. Un visiteur ne doit jamais pouvoir faire ce qu'un admin fait.

## 6. Tenir ses dépendances à jour
Les failles viennent souvent de librairies obsolètes. Mets à jour régulièrement.

> La sécurité n'est pas une fonctionnalité qu'on ajoute à la fin. C'est un **réflexe** qu'on a à chaque ligne de code.
