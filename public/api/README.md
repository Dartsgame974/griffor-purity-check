# Installation des fichiers PHP sur cPanel

## Instructions pour O2 Switch / cPanel

1. **Connecte-toi à ton cPanel**

2. **Accède au gestionnaire de fichiers** (File Manager)

3. **Va dans le dossier public_html** (ou le dossier racine de ton site)

4. **Crée un dossier `api`** si ce n'est pas déjà fait

5. **Upload les fichiers suivants dans le dossier `api`** :
   - `submit_vote.php`
   - `submit_category_feedback.php`

6. **Vérifie les permissions** :
   - Les fichiers PHP doivent avoir les permissions `644`
   - Le dossier `api` doit avoir les permissions `755`

7. **Crée un dossier `votes`** à la racine (même niveau que `api`) :
   - Ce dossier doit avoir les permissions `755`
   - C'est là que tous les votes seront sauvegardés

## Structure finale sur ton serveur :

```
public_html/
├── api/
│   ├── submit_vote.php
│   └── submit_category_feedback.php
├── votes/                    (sera créé automatiquement)
│   ├── vote_2025-01-17_12-30-45_anon_xyz.json
│   ├── vote_2025-01-17_13-15-20_anon_abc.json
│   └── ...
├── community_ratings.json
├── category_feedback.json
└── ... (autres fichiers du site)
```

## Fonctionnement

- **Quand un utilisateur vote** : le fichier PHP `submit_vote.php` :
  1. Reçoit les données du vote
  2. Crée un fichier JSON dans le dossier `votes/` avec le format : `vote_DATE_HEURE_USERID.json`
  3. Met automatiquement à jour `community_ratings.json` avec les nouvelles moyennes

- **Pour les votes de catégories** : le fichier PHP `submit_category_feedback.php` :
  1. Met à jour directement `category_feedback.json`

## Sécurité

- Les fichiers PHP vérifient que seules les requêtes POST sont acceptées
- CORS est activé pour permettre les appels depuis ton domaine
- Les noms de fichiers sont sécurisés (pas de caractères spéciaux)
- Un cooldown de 72h est appliqué côté client

## Accès aux votes

Tu peux accéder à tous les votes individuels dans le dossier `votes/` via :
- cPanel File Manager
- FTP
- SSH (si disponible)

Les moyennes sont automatiquement calculées et stockées dans `community_ratings.json`.
