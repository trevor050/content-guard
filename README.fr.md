# ContentGuard v0.3.1

**Modération de contenu professionnelle et détection du spam pour les applications modernes.**

ContentGuard analyse les textes à la recherche de spam, de harcèlement et de contenus malveillants. Il associe un puissant moteur de règles à des plugins de machine learning optionnels pour fournir des résultats rapides et précis.

## Installation

```bash
npm install content-guard
```

## Démarrage rapide

```javascript
const { ContentGuard } = require('content-guard');
const guard = new ContentGuard('moderate');
const resultat = await guard.analyze('Bonjour tout le monde');
console.log(resultat.isSpam);
```

## Fonctionnalités clés

- Plusieurs presets de **tolérant** à **strict**
- Détection contextuelle via le traitement du langage naturel
- Moteur modulaire avec filtres clavier, sentiment et harcèlement
- Plugins ML optionnels : sentiment emoji, vérifications interculturelles, toxicité
- Normalisation Unicode des confusables pour contrer l'obfuscation
- CLI pour le traitement par lots et les scripts
- Léger et rapide, idéal pour les environnements serverless
- Définitions TypeScript incluses

## Variantes v4.5

ContentGuard v4.5 propose quatre variantes pour trouver l'équilibre entre vitesse et précision :

| Variante          | Précision | Temps moyen | Cas d'usage                               |
|-------------------|---------:|-----------:|------------------------------------------|
| **v4.5-turbo**    | ~91%     | 0.02ms     | Discussions temps réel, flux massifs     |
| **v4.5-fast**     | ~91.5%%     | 0.06ms     | Passerelles API et microservices         |
| **v4.5-balanced** | ~93%     | 0.25ms     | Déploiements de production (défaut)      |
| **v4.5-large**    | ~94%     | 1.32ms     | Modération critique et usages entreprise |

Choisissez une variante lors de la création de l'instance ou via la CLI.

## Plugins et cas d'usage

ContentGuard dispose d'un système de plugins modulaire. Activez uniquement ceux nécessaires :

| Plugin                 | Description et cas d'usage typique                               |
|------------------------|------------------------------------------------------------------|
| **Obscenity**          | Détecte le langage offensant. Pour les chartes communautaires.    |
| **Sentiment**          | Évalue le ton du texte. Idéal pour les analyses de chat.          |
| **Harassment**         | Signale les propos haineux ou intimidants. Incontournable.        |
| **Social Engineering** | Débusque tentatives de phishing ou d'escroquerie. Filtres mail.   |
| **Keyboard Spam**      | Repère les frappes aléatoires. Formulaires et inscriptions.       |
| **Emoji Sentiment**    | Interprète la tonalité des emojis. Affine l'analyse de sentiment. |
| **Cross‑Cultural**     | Vérifie les termes sensibles selon la culture. Déploiements globaux|
| **ML Toxicity**        | Score de toxicité basé sur le ML. Précision accrue.               |
| **Confusables**        | Normalise les caractères Unicode ressemblants. Évite l'obfuscation|

## Utilisation CLI

```bash
npx content-guard "Un texte" --preset strict --variant fast
```

Consultez le dossier `examples/` pour des exemples d'intégration.

## Configuration

Chaque preset est personnalisable. Consultez `lib/presets` pour ajuster les poids des plugins, les seuils et les options de prétraitement selon vos besoins.

## Licence

ContentGuard est distribué sous licence MIT.

---

**Autres langues :** [English](README.md) | [Español](README.es.md) | [中文](README.cn.md)
