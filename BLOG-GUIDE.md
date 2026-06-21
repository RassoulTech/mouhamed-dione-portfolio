# 📝 Guide du Blog — Mode d'emploi

Ton portfolio a maintenant un blog intégré, dans le même design que le reste du site.

- **Liste des articles** : `/blog`
- **Un article** : `/blog/<nom-du-fichier>`

---

## ✍️ Publier un nouvel article (en 3 étapes)

Tu n'as **aucun code à toucher**. Un article = un simple fichier Markdown.

### Étape 1 — Crée un fichier

Dans le dossier `src/content/blog/`, crée un fichier `.md`.

> ⚠️ Le **nom du fichier devient l'adresse (URL)** de l'article.
> `mon-super-article.md` → `tonsite.com/blog/mon-super-article`
> Utilise des minuscules, des tirets, pas d'espaces ni d'accents.

### Étape 2 — Colle ce modèle en haut du fichier

```markdown
---
title: "Le titre de mon article"
date: 2026-07-01
excerpt: "Une phrase d'accroche qui donne envie de cliquer (affichée dans la liste)."
tags: [Tech, Carrière]
---

Ici, j'écris mon article en **Markdown**.

## Un sous-titre

Un paragraphe normal. On peut mettre des mots en **gras**, en *italique*,
ou des [liens](https://exemple.com).

- Une liste
- À puces

1. Ou une liste
2. Numérotée

> Une citation qui ressort visuellement.
```

Le bloc entre les `---` s'appelle le **frontmatter** : ce sont les infos de l'article.

| Champ      | Obligatoire | Rôle                                            |
|------------|-------------|-------------------------------------------------|
| `title`    | ✅          | Le titre affiché                                |
| `date`     | ✅          | Format `AAAA-MM-JJ` — sert à trier (récent → ancien) |
| `excerpt`  | ✅          | L'accroche dans la liste                        |
| `tags`     | recommandé  | Catégories, entre crochets : `[Tech, Web]`      |
| `cover`    | optionnel   | Image d'entête : `cover: /blog/mon-image.jpg`   |

### Étape 3 — Mets en ligne

```bash
git add .
git commit -m "Nouvel article : mon-super-article"
git push
```

Vercel reconstruit le site tout seul. **C'est tout.** L'article apparaît
automatiquement dans la liste, trié par date, avec son temps de lecture calculé.

> 💡 Pour une image de couverture : mets le fichier dans `public/blog/`
> puis référence-le avec `cover: /blog/nom-image.jpg`.

---

## 🧠 Aperçu en local avant de publier

```bash
npm run dev
```

Ouvre `http://localhost:5173/blog` pour voir le rendu avant de pousser.

---

## 📅 Plan éditorial — 12 articles prêts à écrire

Ton blog vise **3 audiences** : étudiants, entrepreneurs, et toute personne
intéressée par le digital local. Garde un équilibre entre les 3 « piliers ».

### Pilier 1 — Carrière & Étudiants (tu inspires)
1. ✅ *Pourquoi tout étudiant en informatique devrait avoir un portfolio en ligne* — **publié**
2. Comment j'ai appris à coder en autodidacte (mes ressources gratuites)
3. CCNA, Java, Web : comment je choisis quoi apprendre ensuite
4. 5 erreurs que j'ai faites à mes débuts en développement

### Pilier 2 — Entrepreneurs & Solutions locales (tu aides)
5. ✅ *5 outils gratuits pour digitaliser une petite entreprise au Sénégal* — **publié**
6. Site web ou page Facebook : de quoi ton commerce a-t-il vraiment besoin ?
7. Combien coûte (vraiment) un site web pour une PME ?
8. Comment une boutique de quartier peut vendre en ligne sans Shopify

### Pilier 3 — Tech & Coulisses (tu démontres)
9. ✅ *Next.js ou Vue.js : lequel choisir pour ton premier vrai projet ?* — **publié**
10. Comment j'ai construit ce portfolio (et son blog) avec React
11. Décortiquer mon projet Gestion-Pro : architecture et choix techniques
12. Mon Lab CCNA expliqué simplement : VLAN, HSRP et compagnie

### Rythme conseillé
- **1 article toutes les 2 semaines** au début (tenable et régulier)
- Alterne les piliers pour ne pas lasser
- Recycle chaque article en post LinkedIn / TikTok → ramène le trafic vers le blog

> Règle d'or : **mieux vaut 1 article par mois pendant 1 an, que 5 articles en
> une semaine puis plus rien.** La régularité bat l'intensité.
