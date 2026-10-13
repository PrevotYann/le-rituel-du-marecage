# Le Rituel du Marécage — v0.1.1

Correction des origines et des compétences pour **Foundry VTT 14.368** et **JDR Runeterra 0.8.0** (`jdr-runeterra`).

## Corrections

- Les huit prétirés possèdent quatre compétences actives, dans l’ordre **1 / 2 / 3 / U**. Les traits passifs apparaissent séparément. La variante et ses conditions sont choisies avant le jet, avec un aperçu de l’attribut utilisé.
- Les profils des variantes sont isolés. Les sauts de ligne du texte source avaient mélangé certaines compétences : Danse Fluide de Wako ne soigne plus. Offrande d’Onno crée une potion de +10 PV ou une dose de poison niveau 2 dans son inventaire après le jet réussi correspondant. Le soin et l’application du poison interviennent ensuite, lors de leur utilisation.
- Les espèces, sous-espèces et régions utilisent les choix natifs, visibles sur les PJ et les PNJ. Wako est Ondrashi / Ionia ; Eliora est Mage né / Ionia. Les données inconnues et les tribus absentes du catalogue sont indiquées explicitement.
- Les biographies des PNJ ont été reprises depuis les sources. Les récompenses, bonus temporaires, échanges d’attributs, capture et apprivoisement utilisent les documents et effets natifs du système.
- Au chargement du monde par un MJ actif, une migration corrige les fiches 0.1.0 restées aux anciennes valeurs du module. Elle conserve les personnalisations, PV, XP, niveaux, charges, inventaires, notes et progression.

## Installation et mise à jour

Dans **Configuration → Modules complémentaires → Installer un module**, coller :

```text
https://github.com/PrevotYann/le-rituel-du-marecage/releases/latest/download/module.json
```

Pour un monde existant, mettre à jour le module puis ouvrir le monde avec le MJ. Pour un nouveau monde JDR Runeterra, activer le module et ouvrir son réglage **Importer Le Rituel du Marécage**. Babele est facultatif ; son exemple anglais est partiel.

## Validation

Audit des 54 Actors, rendu des 39 fiches PJ/PNJ, migration des anciennes fiches et conservation des personnalisations. Les 71 variantes sont testées avec un D100 réussi et un échoué chacune : 402 contrôles de profils, jets, dégâts, soins, poison et récompenses. Des contrôles complémentaires vérifient les conséquences natives et l’utilisation par un compte joueur propriétaire.

L’import, le réimport, la reprise après interruption, les compagnons, les effets temporaires, Babele et le ZIP extrait dans un monde neuf ont également été vérifiés. Les portraits et tokens d’Anna et Ygritte restent distincts. Rapports et limites : [COVERAGE.md](https://github.com/PrevotYann/le-rituel-du-marecage/blob/main/COVERAGE.md).

## Limites connues

**Confidentialité du pack :** sous Foundry 14.368, ses permissions le masquent dans l’interface, mais un joueur peut récupérer l’Adventure et ses secrets via `getDocuments()` dans la console. Le contrôle de confidentialité stricte reste en échec. Les commandes MJ refusent les mutations provenant d’un compte joueur.

Les pouvoirs sociaux, décisions narratives et valeurs absentes des sources demandent une résolution MJ explicite. L’aventure n’a pas encore été jouée intégralement par un groupe humain pour valider son équilibrage. Les traductions anglaises fournies sont des exemples.

La licence MIT couvre le code ; les ressources tierces conservent leurs droits propres. Voir [CONTENT-LICENSE.md](https://github.com/PrevotYann/le-rituel-du-marecage/blob/main/CONTENT-LICENSE.md).

Fichiers joints : ZIP installable, manifeste `module.json` et `SHA256SUMS`.
