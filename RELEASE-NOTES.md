# Le Rituel du Marécage — v0.1.0

Première version installable pour **Foundry VTT 14.368** et **JDR Runeterra 0.8.0** (`jdr-runeterra`).

## Installation dans Foundry

Dans **Configuration → Modules complémentaires → Installer un module**, coller :

```text
https://github.com/PrevotYann/le-rituel-du-marecage/releases/latest/download/module.json
```

Activer le module dans un monde JDR Runeterra, puis ouvrir son réglage **Importer Le Rituel du Marécage**. Babele est facultatif ; son exemple anglais est partiel.

## Contenu et validation

- Adventure native compilée : huit prétirés, PNJ, créatures, objets, journaux et embranchements narratifs.
- Dix-neuf cartes tactiques et quatre scènes d’ambiance ; portraits et tokens locaux. Anna et Ygritte disposent de cadrages distincts, et 34 cadrages individuels ont été revus.
- Import réexécutable, pupitre MJ, achats, compagnons et effets utilisant les règles actuelles du système.
- ZIP installé dans un monde QA neuf : 78 contrôles d’exécution, aucun document invalide ni erreur JavaScript. Tests avancés et exemple Babele également exécutés. Détails dans [COVERAGE.md](https://github.com/PrevotYann/le-rituel-du-marecage/blob/main/COVERAGE.md).

## Limites connues

**Confidentialité du pack :** sous Foundry 14.368, ses permissions le masquent dans l’interface, mais un joueur peut récupérer l’Adventure et ses secrets via `getDocuments()` dans la console. Le contrôle de confidentialité stricte reste en échec. Les commandes MJ refusent les mutations provenant d’un compte joueur.

L’aventure n’a pas encore été jouée intégralement par un groupe humain pour valider son équilibrage. Les traductions anglaises fournies sont des exemples, pas une traduction complète.

La licence MIT couvre le code ; les ressources tierces conservent leurs droits propres. Voir [CONTENT-LICENSE.md](https://github.com/PrevotYann/le-rituel-du-marecage/blob/main/CONTENT-LICENSE.md).

Les fichiers joints comprennent le ZIP installable, le manifeste `module.json` et `SHA256SUMS`.
