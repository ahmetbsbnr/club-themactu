# Club ThemActu — gestion des abonnements

Application web MVC de gestion des adhérents et des abonnements d'un club d'actualités fictif, « ThemActu ».

## Stack
TypeScript (modèle / contrôleurs), HTML/CSS (vues), API PHP (PDO), base MySQL.

## Structure
| Dossier | Rôle |
|---|---|
| `src/` | Sources TypeScript (`modele/`, `controleur/`) et script SQL `src/modele/bdclub.sql` |
| `modele/`, `controleur/` | JavaScript compilé utilisé par les vues |
| `vue/` | Pages HTML, CSS, images |
| `IHM_API/` | API PHP d'accès à la base |
| `tests/` | Tests unitaires des objets métier (Deno) |

## Lancer en local
1. Installer un serveur local PHP + MySQL (ex. XAMPP) et copier le projet dans `htdocs/club-themactu/`.
2. Créer une base `bdclub` et y importer `src/modele/bdclub.sql` (données fictives).
3. Adapter si besoin les chemins et identifiants dans `src/modele/connexion.ts`, puis compiler :
   ```bash
   npm install
   npx tsc
   ```
4. Ouvrir http://localhost/club-themactu/vue/abonnement.html

Tests : `deno test tests/`

> ⚠️ `IHM_API/spExec.php` exécute les requêtes SQL envoyées par le navigateur : l'API n'accepte que les requêtes locales et ne doit pas être déployée sur un serveur public.

## Auteur
Ahmet BASBUNAR
