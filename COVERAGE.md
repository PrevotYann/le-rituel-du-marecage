# Couverture et vérifications

Contrat : JDR Runeterra 0.8.0, Foundry VTT 14.368. Les preuves navigateur sont produites dans `test-results/` ; leurs rapports JSON résumés sont publiés dans `qa-results/`. Les fichiers du moteur, les licences et le monde QA ne sont pas distribués.

## Sources

Dossier Drive parcouru récursivement : 108 entrées dans 18 dossiers visités, y compris sous-dossiers des lieux et prétirés. Deux versions du scénario comparées : copie précisant l’attaque maritime, le guide et Camille ; original conservant les notes principales et l’alternative Harelport. Textes intégrals, couleurs, gras et italiques conservés dans les annexes MJ. Biographies, objets, menu et descriptions des prétirés intégrés. Le classeur d’équipement a été lu avec valeurs et formats ; les tenues comparables du système sont référencées.

Huit fiches PNG inspectées visuellement et transcrites. Les PDF correspondants ont été inventoriés mais pas téléchargés (70–134 Mo par fichier) ; aucune différence PNG/PDF n’est affirmée comme vérifiée. Portraits recadrés individuellement, notamment Anna/Ygritte, Diz/Pete, Brik/Brak et Joël/Ellen. Le fichier de crédits source laisse les artistes non renseignés. Carte régionale incluse localement. Vidéo de prononciations récupérée et inspectée ; piste audio intégrale locale, sans transcription phonétique prétendument vérifiée.

Les lacunes narratives essentielles sont complétées : résultat 1 du renfoncement, répétition du résultat 6, fin de la vision, entretien interrompu de Barry, contrat et issues alternatives de l’antiquaire. Chaque proposition est marquée dans les notes MJ et `content/adaptations.json`. Les jeux de Bakkis sont une adaptation explicite : l’image source est une illustration et ne fournit pas les règles écrites.

## Contrôles exécutés

- Manifeste, stockage LevelDB natif de l’Adventure, IDs et clés uniques, assets locaux, références UUID, actorId, liens de niveaux, permissions et allocations des huit PJ.
- Import dans un monde QA vierge, avec le moteur réel Foundry 14.368 ; zéro document invalide.
- Réimport sans doublons ; PV, notes et compteur conservés.
- Achat par `game.runeterra.purchase`, soin Ethnil et verrou d’une heure, récompense unique, combat natif, pousse masquée, invocation/rappel, effet temporaire expiré par le temps du système, dégâts et soins natifs.
- Journaux MJ privés et aides joueurs distinctes ; attribution du PJ sans droits sur les journaux MJ.
- Inspection visuelle des portraits et des dix-neuf cartes illustrées, avec overlays de murs, portes et passages ; puits et escaliers repérés. Fenêtre d’auberge distincte du mur bloquant. Scènes d’ambiance séparées des cartes tactiques.
- ZIP réellement extrait dans un dossier indépendant du dépôt puis importé dans un monde QA neuf : 78 contrôles d’exécution, aucun document invalide ni erreur JavaScript. Comparaison de 227 fichiers distribués, Adventure complète en LevelDB et vérification des portraits/tokens distincts d’Anna et Ygritte. Preuve : `qa-results/archive.json`.

Les tests avancés exécutés couvrent également : dépendance absente sans mutation, interruption et reprise, annulation du compteur, pupitre affiché, quatorze branches narratives, variantes natives et compte joueur réel. Babele 2.9.1, avec libWrapper 1.13.5.1, traduit effectivement l’Adventure, une biographie Actor imbriquée, une capacité embarquée et une description Item ; les statistiques restent identiques. Les preuves sont dans `qa-results/advanced.json` et `qa-results/babele.json`.

Le contrôle de confidentialité stricte du pack est **en échec** : Foundry 14.368 renvoie son contenu complet à `getDocuments()` depuis un compte joueur malgré `PLAYER: NONE`. Le compendium est masqué dans l’interface et les mutations MJ sont refusées, mais ces permissions ne constituent pas une barrière contre la récupération technique des secrets. Aucun correctif serveur n’a été appliqué au moteur. Cette limite figure explicitement dans le rapport machine `content/coverage.json`.

## Limites de validation

Le parcours complet n’a pas été joué par un groupe humain pendant une session de quatre heures ; son équilibrage reste une proposition de mise en scène. Les pouvoirs sociaux, pactes, souvenirs et conséquences permanentes sont des choix MJ, pas des résultats algorithmiques. Les attaques ou attributs absents des sources sont des adaptations explicites.

Les tests navigateur utilisent Chromium sans accélération graphique matérielle : les avertissements GPU de Foundry ne constituent pas un contrôle de fluidité sur une machine de jeu. La compatibilité n’a pas été validée pour un système ultérieur à 0.8.0 ni une génération Foundry différente de 14.

Les modifications MJ sont conservées lors des mises à jour : seuls les documents absents sont créés. Une nouvelle version d’un document existant est signalée comme conflit et nécessite une édition MJ ; ce module n’effectue pas de fusion narrative automatique. Les avancées du temps et leurs effets globaux ne peuvent être annulés par le registre ; les annulations de mutations de documents refusent tout état modifié depuis l’opération.

La publication du dépôt et de la release a été explicitement demandée par le propriétaire `PrevotYann` le 13 octobre 2026. Aucune licence générale de redistribution des ressources tierces n’a été établie. Voir `CONTENT-LICENSE.md`.
