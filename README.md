_Ce projet est seulement un "proof of concept". C'est donc très minimal et probablement assez buggé_

# BenefDistribCard

![GitHub](https://img.shields.io/github/license/sikado/benef-distrib-card?style=flat-square)
![Libraries.io dependency status for GitHub repo](https://img.shields.io/librariesio/github/sikado/benef-distrib-card?style=flat-square)
![Version](https://img.shields.io/badge/version-alpha-blue?style=flat-square)

Ce projet a pour objectif de générer des planches de carte d'identification pour des bénéficiaires d'aide humanitaire.

Il permet d'importer des données d'identification, de créer un modèle de carte et de générer des planches de cartes pour toutes les entrées du fichier importé.

## Archi

Ce projet utilise le framework Angular et s'exécute entièrement côté client. Une fois ouvert une première fois en ligne, il devient accessible 100% hors connexion (via la techno PWA)

## Usage

Si vous souhaitez compiler le projet locallement :

```bash
git clone https://github.com/sikado/benef-distrib-card.git
npm install
npm run build:prod
```
