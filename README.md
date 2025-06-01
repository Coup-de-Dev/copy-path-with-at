# Copy Path with @

Une extension VS Code qui permet de copier facilement les chemins de fichiers avec le préfixe `@`.

## Fonctionnalités

- **Copier un fichier** : Copie le chemin d'un fichier avec `@` devant
- **Copier un dossier** : Copie récursivement tous les fichiers d'un dossier avec `@` devant chaque chemin
- **Sélection multiple** : Permet de copier plusieurs fichiers/dossiers en une seule fois
- **Menu contextuel** : Accessible directement depuis l'explorateur de fichiers

## Utilisation

### Depuis le menu contextuel

1. Faites un clic droit sur un fichier ou dossier dans l'explorateur
2. Sélectionnez "Copy Path with @"
3. Le(s) chemin(s) sont copiés dans le presse-papier

### Depuis la palette de commandes

1. Ouvrez la palette de commandes (`Ctrl+Shift+P` ou `Cmd+Shift+P`)
2. Tapez "Copy Path with @"
3. Sélectionnez la commande

### Commandes disponibles

- `Copy Path with @` : Copie le chemin du fichier/dossier sélectionné
- `Copy Path with @ (Smart)` : Ouvre un sélecteur de fichiers pour choisir

## Exemples

**Fichier unique :**
```
@/home/user/project/src/index.js
```

**Dossier (récursif) :**
```
@/home/user/project/src/index.js
@/home/user/project/src/components/Header.js
@/home/user/project/src/components/Footer.js
```

## Installation

1. Ouvrez VS Code
2. Allez dans l'onglet Extensions (`Ctrl+Shift+X`)
3. Recherchez "Copy Path with @"
4. Cliquez sur Installer

## Auteur

**Coup de Dev**

## Licence

MIT