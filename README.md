# 🤖 Chatbot Documentaire - Claude AI

Application Angular de chatbot intelligent alimenté par l'API Claude d'Anthropic.  
Chat + upload d'un document PDF (et poser des questions sur son contenu).

## 🚀 Demo

👉 [chatbot-claude-by-sv.netlify.app](https://chatbot-claude-by-sv.netlify.app)

## ✨ Fonctionnalités

- 💬 Chat en temps réel avec streaming des réponses
- 📄 Upload et analyse de documents PDF
- 🧠 Historique de conversation contextuel
- 🎨 Interface moderne avec Tailwind CSS

## 🛠️ Stack technique

- **Framework** : Angular 21
- **IA** : API Claude (Anthropic) - modèle Haiku
- **PDF** : pdfjs-dist
- **Style** : Tailwind CSS 3
- **Déploiement** : Netlify

## ⚙️ Installation locale

```bash
git clone https://github.com/PhanDev34000/chatbot.git
cd chatbot
npm install
```

Crée un fichier `src/environments/environment.development.ts` :

```typescript
export const environment = {
  production: false,
  anthropicApiKey: 'TA_CLE_API'
};
```

Puis lance :

```bash
ng serve
```

## 👤 Auteur

**Stéphane Vernière** - Développeur Angular  
[verniere-dev.com](https://verniere-dev.com)