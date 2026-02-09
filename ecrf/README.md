# CSV Column Mapper - Application Angular

Une application Angular pour uploader des fichiers CSV et mapper leurs colonnes vers un schéma prédéfini.

## 🚀 Fonctionnalités

- **Upload de fichiers CSV** : Téléchargez facilement vos fichiers CSV
- **Parsing automatique** : Extraction automatique des colonnes du fichier CSV
- **Mapping de colonnes** : Interface intuitive avec dropdowns pour mapper chaque colonne CSV vers un champ du schéma prédéfini
- **Auto-mapping intelligent** : Détection automatique des correspondances de noms de colonnes
- **Validation** : Vérification que tous les champs obligatoires sont mappés
- **Schéma prédéfini** : Schéma par défaut comprenant : id, nom, prénom, email, téléphone, adresse, ville, code postal, pays, date de naissance

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm (installé avec Node.js)
- Angular CLI (installé automatiquement avec les dépendances du projet)

## 🛠️ Installation

1. Cloner le repository
2. Installer les dépendances :
```bash
npm install
```

## 🚀 Démarrage

### Mode développement

```bash
npm start
```

L'application sera accessible sur `http://localhost:4200/`

### Build de production

```bash
npm run build
```

Les fichiers de build seront générés dans le dossier `dist/`

## 📁 Structure du projet

```
src/
├── app/
│   ├── components/
│   │   └── csv-mapper/           # Composant principal de mapping
│   │       ├── csv-mapper.component.ts
│   │       ├── csv-mapper.component.html
│   │       ├── csv-mapper.component.css
│   │       └── csv-mapper.component.spec.ts
│   ├── models/
│   │   └── column-mapping.model.ts  # Modèles et schéma prédéfini
│   ├── services/
│   │   └── csv-parser.service.ts    # Service de parsing CSV
│   ├── app.ts                      # Composant racine
│   ├── app.html
│   ├── app.css
│   └── app.config.ts
└── main.ts
```

## 🎯 Utilisation

1. **Télécharger un fichier CSV** : Cliquez sur le bouton "Choisir un fichier CSV" et sélectionnez votre fichier
2. **Vérifier les colonnes détectées** : Les colonnes de votre fichier CSV apparaissent automatiquement
3. **Mapper les colonnes** : Pour chaque colonne CSV, sélectionnez le champ correspondant du schéma dans les dropdowns
   - Les champs marqués d'un astérisque (*) sont obligatoires
   - L'auto-mapping suggère automatiquement les correspondances
4. **Valider** : Cliquez sur "Valider le Mapping" une fois tous les champs obligatoires mappés
5. **Consulter les résultats** : Les données mappées sont affichées dans la console du navigateur

## 🔧 Personnalisation du schéma

Pour modifier le schéma prédéfini, éditez le fichier `src/app/models/column-mapping.model.ts` :

```typescript
export const PREDEFINED_SCHEMA: SchemaField[] = [
  { name: 'id', type: 'number', required: true, description: 'Identifiant unique' },
  // Ajoutez vos propres champs ici
];
```

## 🧪 Tests

```bash
npm test
```

## 🛠️ Technologies utilisées

- **Angular 19** : Framework principal
- **TypeScript** : Langage de programmation
- **CSS** : Styles
- **FormsModule** : Gestion des formulaires Angular

## 📝 Notes techniques

- Le parsing CSV gère les guillemets doubles et les virgules dans les valeurs
- L'application est responsive et s'adapte aux mobiles
- Validation en temps réel du mapping
- Interface utilisateur moderne et intuitive

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.
