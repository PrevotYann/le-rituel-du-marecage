# Le Rituel du Marécage

Module d’aventure français pour **Foundry VTT 14.368** et **JDR Runeterra 0.8.0** (`jdr-runeterra`). Le scénario principal est **Le Chemin de l’Oubli**, avec Omatqan, les marais d’Oqlan, les différentes issues de Malek et la fin alternative d’Harelport. La chasse à Ga’Hun demeure une ouverture de suite.

## Installer et jouer

1. Dans **Configuration → Modules complémentaires → Installer un module**, coller cette URL de manifeste : `https://github.com/PrevotYann/le-rituel-du-marecage/releases/latest/download/module.json`. Pour une installation manuelle, extraire le ZIP de la release dans `Data/modules/` ; le manifeste doit se trouver sous `Data/modules/le-rituel-du-marecage/module.json`.
2. Créer un monde avec JDR Runeterra 0.8.0, puis activer **Le Rituel du Marécage**.
3. Dans les réglages du module, ouvrir **Importer Le Rituel du Marécage**. Le compendium aventure propose le même assistant.
4. Lire le diagnostic, choisir les prétirés et importer. **Commencer ici** et la scène initiale s’ouvrent. Attribuer chaque PJ à son joueur depuis les permissions de la fiche.
5. Ouvrir le pupitre depuis le journal ou la macro **Le Rituel — pupitre MJ**. Sélectionner personnage, lieu et action. Les conséquences narratives sensibles requièrent une décision MJ explicite.

Les documents existants sont conservés lors d’un réimport : PV, inventaires, notes et progression ne sont pas réinitialisés. Une interruption se reprend en relançant l’assistant ; les identifiants sémantiques repèrent les documents déjà créés. Un UUID système manquant bloque les créations et affiche les candidats vérifiés, sans substitution silencieuse.

## Contenu

- Huit prétirés et leurs capacités natives, Ellen et les compagnons de Kaëlor. Hexotech est un équipement de Klaus : pas de deuxième tour.
- PNJ, créatures, objets spécifiques, menus et offres marchandes. Poro, Rooye des sables, Antidote, Aphrène, Boussole Ixtali et Griffon utilisent les compendiums du système selon leur usage.
- Dix-neuf cartes tactiques originales, quatre scènes d’ambiance, portraits individuels et tokens PNG transparents. Les passages entre niveaux se font sur choix MJ dans le pupitre.
- Deux tables 1d6, Chemin Perdu, stock, récompenses uniques, compagnons, effets locaux, achats et jeux de Bakkis.
- Scénarios original et copie conservés avec couleurs, gras et italiques, biographies, annexes et table des adaptations. Les notes exclusives de l’original et la fin Harelport restent disponibles.

Parcours conseillé : 3–4 heures pour cinq joueurs et un MJ, avec minuterie et scènes optionnelles dans **Commencer ici**. Le mode exploration conserve tous les embranchements. Les avertissements source sont conservés.

## Règles et pouvoirs

Le système actuel fait référence : budget de création 600, trois charges d’ultime, Concentration à la place d’Intelligence, monnaie/soins/poison/résistance et round de 30 secondes natifs. Les différences et allocations originales sont dans `content/adaptations.json`. Les valeurs manquantes proposées sont étiquetées comme adaptations.

Chaque prétiré possède exactement quatre compétences actives, dans l’ordre **1 / 2 / 3 / U**. Le trait passif apparaît séparément. Utiliser une compétence ouvre le choix de sa variante, montre l’attribut et les conditions, puis lance le jet avec le moteur du système. Les profils sont isolés : dégâts, soin, poison et récompenses d’une variante ne débordent pas sur les autres. Les cartes natives de chat appliquent les conséquences aux cibles confirmées.

Pour Wako, **Danse Fluide** résout l’esquive et le renvoi, sans soin. **Offrande d’Onno** propose la fabrication d’une potion de +10 PV après un jet réussi dans l’eau, ou d’une dose de poison niveau 2 après un jet réussi de Craintivité. Ces objets rejoignent son inventaire ; la potion soigne à sa consommation et le poison s’applique ensuite depuis sa carte native. Un échec ne crée aucun objet.

Les espèces, sous-espèces et régions utilisent les clés natives du système, avec sélections visibles sur les PJ et les PNJ. Wako est Vastaya / Ondrashi / Ionia ; Eliora est Humaine / Mage né / Ionia. Les origines inconnues et sous-espèces absentes du catalogue sont signalées explicitement. Une réussite sociale ne décide pas de l’attitude d’un PNJ. Le nom de Barry est masqué sur son token public. Les portraits de groupe sont recadrés séparément, notamment Anna/Ygritte, Diz/Pete et Brik/Brak.

**Mise à jour depuis 0.1.0 :** installer 0.1.1 puis ouvrir le monde avec un MJ actif. La correction des fiches importées s’exécute au chargement : anciennes origines et profils de compétences sont remplacés lorsqu’ils correspondent encore aux valeurs du module. Les valeurs personnalisées, PV, XP, niveaux, charges, inventaires, notes et état de l’aventure sont conservés. L’API `await game.rituel.refreshActors({notify:true})` permet de relancer cette vérification. Les PJ conservent leurs quatre emplacements ; les PNJ gardent les actions prévues par leurs sources.

Ethnil suit le soin du système et ne peut être cumulé pendant une heure. Shimmer instable passe par la commande MJ dédiée pour distinguer ingestion (poison 4) et modification d’arme (poison 1). Sortir d’une zone toxique met fin à l’exposition, sans supprimer le poison. Aucune mort, possession ou perte permanente n’est déclenchée par un déplacement.

Le registre d’opérations et ses instantanés est un **Journal MJ privé**. L’annulation refuse les documents modifiés depuis l’action. Pour une opération interrompue, examiner les dépenses/créations partielles avant le réarmement ciblé. Les journaux et le pack MJ ont des permissions `NONE` pour les joueurs ; le menu, la carte régionale et le carnet joueurs sont distincts.

Limite constatée sous Foundry 14.368 : les permissions du compendium le masquent dans l’interface, mais un joueur peut récupérer son Adventure avec `getDocuments()` depuis la console, y compris ses secrets. Ce module ne garantit donc pas la confidentialité du contenu du pack face à une lecture technique volontaire. Le contrôle de confidentialité stricte demandé reste en échec ; voir `qa-results/advanced.json` dans le dépôt.

## Babele et traduction

Babele est facultatif. Version de contrôle : 2.9.1, compatible Foundry 14. Enregistrement à `babele.init`, avant son initialisation de traduction ; mappings Actor `system.biography`, Item `system.description`, et pages natives de journal.

`translations/en/le-rituel-du-marecage.adventure.json` montre la traduction de l’Adventure, de ses journaux/pages, d’un objet et d’une capacité embarquée. `translations/en/adventure-content.json` illustre une étape explicite de localisation avant import, par clés sémantiques : noms et descriptions uniquement, jamais statistiques, flags ou UUID. Cette étape complète le traitement des documents imbriqués ; ce n’est pas une traduction anglaise intégrale. Sans Babele, l’import reste français par défaut ; l’API accepte explicitement `language: 'en'` pour tester cet exemple. Les entrées absentes restent françaises. Les traductions des packs du système ne sont pas copiées.

## Développement et construction

```powershell
npm ci
npm run build
npm run validate
npm run release
```

Les sources documentaires adaptées, lisibles, sont dans `content/`. La compilation LevelDB utilise le stockage inline des `SetField` de l’Adventure v14. Un seul pack : aucun pack miroir des mêmes Actors/Items.

`npm run author` est l’outil initial d’extraction depuis les téléchargements privés `.private-sources/` ; ces fichiers ne sont ni versionnés ni distribués. Les cartes illustrées finalisées et les cadrages sont déjà produits. Les modifications ordinaires se font sur les JSON de `content/`, puis `npm run build`. Le build normal n’a aucun besoin d’accéder au Drive.

`tools/prepare-qa.mjs` crée un environnement isolé `.qa/` avec une **copie** du système, jamais ses packs sources. Configurer `RUNETERRA_PATH`, `FOUNDRY_LICENSE_FILE` et le moteur local si leurs chemins diffèrent. Les tests navigateur utilisent le port 30016 et le monde `rituel-qa`. Voir [COVERAGE.md](COVERAGE.md) pour les contrôles exacts et limites.

## Publication

Le dépôt public est [PrevotYann/le-rituel-du-marecage](https://github.com/PrevotYann/le-rituel-du-marecage). La release **v0.1.1** corrige les fiches et les compétences de la première version. La [page des releases](https://github.com/PrevotYann/le-rituel-du-marecage/releases) fournit le ZIP installable, `module.json` et `SHA256SUMS`.

Le workflow GitHub Actions compile le pack et publie ces fichiers lorsqu’un tag `v<version>` correspondant au manifeste est poussé. La diffusion a été demandée par le propriétaire du dépôt ; la licence MIT du code ne confère aucune licence générale sur les ressources tierces (voir `CONTENT-LICENSE.md`). Aucun secret, monde QA, moteur Foundry ou dépendance de développement n’est empaqueté.
