# 🔥 Brancher Firebase — Guide pas à pas (débutant)

Ton blog peut lire/écrire les articles depuis **Firebase** (base de données + connexion
sécurisée). Tant que ce n'est pas configuré, le site affiche les articles Markdown :
**rien n'est cassé**. Suis ce guide une seule fois (~15 min).

> 💡 Tu n'as **pas besoin de carte bancaire**. Le plan gratuit (« Spark ») suffit largement.

---

## Étape 1 — Créer le projet Firebase

1. Va sur **https://console.firebase.google.com** et connecte-toi avec ton compte Google.
2. Clique **« Créer un projet »**.
3. Donne un nom (ex. `mouhamed-blog`), accepte, continue.
4. Google Analytics : tu peux **désactiver** (pas nécessaire). Crée le projet.

## Étape 2 — Ajouter une application Web

1. Sur la page d'accueil du projet, clique sur l'icône **`</>`** (Web).
2. Donne un surnom (ex. `portfolio`), clique **« Enregistrer l'application »**.
   *(Ne coche PAS « Firebase Hosting », on est sur Vercel.)*
3. Firebase affiche un bloc `const firebaseConfig = { ... }`.
   **Garde cette page ouverte** : ce sont tes 6 clés (étape 5).

## Étape 3 — Activer la base de données (Firestore)

1. Menu de gauche → **« Firestore Database »** → **« Créer une base de données »**.
2. Choisis un emplacement (ex. `eur3 (Europe)`), continue.
3. Démarre en **mode production** (on met nos propres règles juste après).

## Étape 4 — Activer la connexion (Authentication)

1. Menu de gauche → **« Authentication »** → **« Commencer »**.
2. Onglet **« Sign-in method »** → active **« Adresse e-mail/Mot de passe »** → Enregistrer.
3. Onglet **« Users »** → **« Ajouter un utilisateur »** :
   mets **ton email** + **un mot de passe** → Ajouter.
   👉 C'est ce couple email/mot de passe qui te connectera à `/admin`.

## Étape 5 — Coller tes 6 clés dans le projet

Reprends le bloc `firebaseConfig` de l'étape 2. À la racine du projet,
crée un fichier nommé **`.env`** (copie `.env.example`) et remplis :

```bash
VITE_FIREBASE_API_KEY=        # apiKey
VITE_FIREBASE_AUTH_DOMAIN=    # authDomain
VITE_FIREBASE_PROJECT_ID=     # projectId
VITE_FIREBASE_STORAGE_BUCKET= # storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID= # messagingSenderId
VITE_FIREBASE_APP_ID=         # appId
```

> ✅ Ces clés ne sont pas secrètes (elles tournent dans le navigateur). La sécurité
> vient des règles (étape 6) + de ton mot de passe. Le `.env` est quand même
> ignoré par Git, c'est la bonne pratique.

## Étape 6 — Coller les règles de sécurité

1. Firebase Console → **« Firestore Database »** → onglet **« Règles »**.
2. Remplace tout par le contenu du fichier **`firestore.rules`** (à la racine du projet).
3. Clique **« Publier »**.

Ces règles disent : *tout le monde peut lire les articles publiés, mais seul toi
(connecté) peux écrire.*

## Étape 7 — Tester en local

```bash
npm run dev
```

1. Ouvre **http://localhost:5173/admin**
2. Connecte-toi avec l'email/mot de passe de l'étape 4.
3. Clique **« Importer les articles de départ »** → tes 3 articles passent dans Firebase.
4. Clique **« Nouvel article »**, écris, **Publier**. Va sur `/blog` : il est là 🎉

## Étape 8 — Mettre les clés sur Vercel (pour le site en ligne)

1. Dashboard Vercel → ton projet → **Settings** → **Environment Variables**.
2. Ajoute les **6 mêmes variables** (`VITE_FIREBASE_...`) avec leurs valeurs.
3. Onglet **Deployments** → **Redeploy** le dernier déploiement.

C'est fini ! Désormais, pour écrire un article : va sur **`ton-site.com/admin`**,
connecte-toi, écris, publie. Plus jamais besoin de toucher au code. ✍️

---

## ❓ Questions fréquentes

**Quelqu'un peut-il écrire sur mon blog ?**
Non. L'écriture exige d'être connecté avec ton compte (étape 4). Le public ne peut que lire.

**J'ai oublié de mettre les clés — mon site est cassé ?**
Non. Sans clés, le blog affiche automatiquement les articles Markdown. Aucun plantage.

**Comment partager un article ?**
Chaque article a son lien `ton-site.com/blog/le-slug`, avec des boutons
WhatsApp / LinkedIn / X / Copier le lien directement sur la page.
