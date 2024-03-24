# Initialisation de Sqitch

## Init

`sqitch init nom-du-projet --engine pg`

-   NB : il est également possible de passer une option --uri pour associer une URL au projet (le plus souvent, un repo git).

## Configuration initiale

Comme son nom l’indique, cette configuration n’est à effectuer qu’une seule fois (sauf si vous changez de poste de travail, évidemment).

```crmsh
sqitch config --user engine.pg.client psql
sqitch config --user user.name 'Perceval'
sqitch config --user user.email 'perceval@oclock.io'
```

## Vérification automatique des migrations

Par défaut, les scripts `verify` doivent être lancés manuellement (avec `sqitch verify`). Cette instruction permet leur exécution automatique à chaque déploiement.

`sqitch config --bool deploy.verify true`

## Voir la configuration

`sqitch config -l`

## Ajouter une migration

`sqitch add <nom-de-la-migration> -n 'description'`

## Ajouter une cible

Les cibles (équivalents des remotes avec Git) permettent de nommer des bases de données.

```mipsasm
sqitch target add origin db:pg:vrai-nom-de-la-db
sqitch engine add pg origin
```

La première ligne ajoute une cible nommée origin, ce qui permet d’écrire sqitch deploy origin pour déployer par exemple, au lieu de sqitch deploy db:pg:vrai-nom-de-la-db.

La seconde ligne désigne origin comme la cible par défaut (il faut désigner pg car il est possible, bien qu’extrêmement rare, d’avoir un un projet multi-SGBD), ce qui permet d’écrire sqitch deploy pour déployer ok_hand

## Déploiement

`sqitch deploy <nom-d-une-base>`

ou `sqitch deploy <nom-d-une-cible>`

ou `sqitch deploy avec une cible par défaut`

## Rembobinage

`sqitch revert <cible-ou-base-ou-rien> <nom-d-une-migration-precedente>`

-   /!\ Si `sqitch revert` est lancé sans désigner de migration à laquelle retourner, toutes les migrations sont annulées.

-   On peut désigner des migrations relatives grâce à HEAD : sqitch revert HEAD^2 rembobine les 2 dernières migrations, par exemple.

## État du projet

`sqitch status <cible-ou-base-ou-rien>`

Cette commande affiche l’état du projet, le nom de la dernière migration déployée et le listing des éventuelles migrations non déployées.

## Journal

`sqitch log <cible-ou-base-ou-rien>`

Cette commande affiche toutes les actions (deploy et revert) effectuées sur la base. Ce n’est pas passionnant mais ça peut aider à détecter un dysfonctionnement (c’est souvent à ça que servent des logs).
