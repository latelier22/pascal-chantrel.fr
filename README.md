This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Actualiser le catalogue depuis le stock

Déposer l'export CSV dans `public/stock/`, puis lancer depuis la racine du dépôt
avec Python 3.8 ou supérieur.

```sh
pnpm run stock:import public/stock/03042026.CSV
```

La commande prépare les 40 références les plus récentes par date de création,
avec stock et prix public positifs. `--limit 60` permet de modifier la taille
de la sélection. Les familles d'appareils et les exclusions sont dans
`scripts/import-stock.py`. Le rapport indique les codes famille et sous-famille
écartés pour faciliter l'ajustement des règles.

Les résultats sont dans `.stock-import/` :

- `selection.csv` contient les produits proposés, dans l'ordre de sélection.
- `rapport.json` résume le tri, les familles écartées et les données manquantes.
- `images-manquantes.csv` donne un lien de recherche par référence exacte,
  ainsi que la fiche source et l'erreur de téléchargement lorsqu'elles existent.

Les visuels locaux sont réutilisés par référence. Pour un nouveau modèle,
renseigner sa référence normalisée dans `scripts/stock-image-sources.json`
avec `brand` et `page`. Pour une fiche dont l'URL du visuel contient la
référence exacte, le script récupère automatiquement l’image principale.
On peut aussi renseigner l'URL HTTPS directe `image` d'un visuel utilisable
pour ce modèle. L'option `--download-images` récupère les visuels référencés
et les conserve dans `public/images/stock/` pour les prochains imports.

```sh
pnpm run stock:import public/stock/03042026.CSV --download-images
pnpm run stock:import public/stock/03042026.CSV --apply
```

`--apply` remplace le catalogue local utilisé par `/electromenager` et
`/produits` après relecture de la sélection. Les pages Sylius continuent à
interroger leur API. Les exports fournisseur et les rapports sont ignorés
par Git. Next.js bloque l'accès HTTP à `/stock/`, qui contient les prix
d'achat. En cas de publication de fichiers statiques par un autre serveur,
exclure `public/stock/` de ce déploiement.

## Diaporama du magasin

- Gestion privée dans `/diaporama/admin`, avec l’identifiant `magasin`.
- Lecture dans `/diaporama/horizontal` (16:9) et `/diaporama/vertical` (9:16).
- Importer des visuels JPG ou PNG de 10 Mo maximum, régler leur durée entre
  2 et 120 secondes, choisir les écrans, puis cocher « Diffuser » et enregistrer.
  Un visuel ajouté est désactivé par défaut. Les écrans vérifient la liste toutes
  les 10 secondes. Un écran déjà lancé conserve le dernier visuel affiché lors
  d’une coupure réseau.

Les variables serveur `SLIDESHOW_ADMIN_HASH` (empreinte SHA-256 hexadécimale
du mot de passe) et `SLIDESHOW_STATE_DIR` configurent l’accès et le stockage.
Le dossier doit être accessible en écriture par le service Next.js et rester
en dehors des versions de déploiement. En local, il vaut `.slideshow/` par
défaut. En production, la configuration Nginx doit autoriser les envois de
plus de 10 Mo avec leur enveloppe multipart sur `/diaporama/admin/api`.
