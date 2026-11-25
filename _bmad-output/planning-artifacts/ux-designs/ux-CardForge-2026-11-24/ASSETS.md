# Ressources graphiques UX V2

Les 46 PNG originaux sont présents sur main et recensés dans assets-manifest.json. Le script scripts/optimize-art.mjs contrôle les SHA-256 des originaux et génère des WebP locaux sous public/art (ignoré par Git). Les originaux sont conservés. Les WebP sont précachés par la PWA.

| Dossier original | Nombre |
|---|---:|
| public/assets/worlds | 6 |
| public/assets/worlds-landscape | 6 |
| public/assets/covers | 5 |
| public/assets/logos | 6 |
| public/assets/buttons | 6 |
| public/assets/banners | 5 |
| public/assets/effects | 6 |
| mockups | 6 |

Les jaquettes verticales sont utilisées sans recadrage destructif ; elles diffèrent des bannières horizontales de la maquette. Les effets sont des compositions statiques animées par CSS, non des sprites isolés. La fidélité pixel à pixel n'est pas attestée. Aucune autorisation de diffusion publique n'est ajoutée.
