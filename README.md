# The binary Brain

## intro IRM ?

- Aujourd'hui on peut s'allonger dans une machine qui tourne autour de son cerveau, puis sortir son telephone, lancer sont navigateur, et voir l'interieur de son cerveau.

- on m'a donné un IRM, on m'a dit, il faut que l'utilisateur dessine dessus !

## Principe de l'IRM

- faire tourner les atomes d'hydrogène un aimant puis bombarder avec un OEM ~42Mhz/T pour repérer où il y en a
- une photo par "couche" / "tranche"
- grille de voxel plus ou moins grande dimension (250 x 250)
- valeur d'un pixel; plus ou moins grande précision (255 nuance de gris)

(detends toi Dr. House)

Fichier nifty contien

## Principe du binaire
- systeme numérique de base 2 (0, 1, 10, 11, 100)
- 1 bit =>  0 ou 1
- 1 octect => 8 bits (ex: 10101011)

### Representer l'information en binaire:

### Exemple sécurité sociale

189103815105037
1 89 10 38 151 050 37

Sexe (1|2), année naissance, mois naissance, departement, commune, ordre de naissance, clé de controle (97 - SOMME(1-13) % 97)

Homme, né en Octobre 1989 dans l'Isère à Echirolles (50ème ce mois ci).

### Exemple concret

{ event: 'position', id: 19, x: 125, y: 158 }

## Exemple Spec Nifty-1 : IRM

https://nifti.nimh.nih.gov/nifti-1/documentation/nifti1fields

Ou se trouve le voxel que je veux écrire ? (très semblable à l'ADN!!!)

- taille du header = 348
- dimensions de l'image x * y * z (* t ?)
- taille d'un voxel

### Le poids d'un binaire dépends de la structure plus que du contenu.

## Usage des ArrayBuffers

- Buffer : `const data = new ArrayBuffer(1);`
- TypedArray (Uint8Array, Uint16Array) : `view = new Uint8Array(data)`
- definir la "taille" des voxels

---

## Exemple WebSocket : Lazerdrive

## Comparer les volumes de données
