# The Binary Brain

### Thomas, web developper

Présenter rapidement ma "légitimité"

### Projet SPINE

- Université de Bordeaux est venue nous voir
- pour créer un projet de recherche scientifique collaborative
- SPINE : un serious game dans lequel tu analyse de IRM du cerveau
- Le but ? apprendre à repérer une tumeur dans le cerveau (par exemple), la dessiner et envoyer ta copie
- Une fois qu'on a suffisament de copie => on comparre le réusltats moyen des joueurs à ceux d'une neurologue. 
- Et les résultats sont encourageant et pourrons sans doute permettre de contribuer à la recherche scientifique, en faisant une pre-selection des IRM par exemple.

### IRM

- Manipuler des images IRM dans le navigateur, ça nous fait pas peur !
- Alors qu'est-ce que c'est qu'une image IRM ?
- On expose le cerveau à un très fort rayonnement magnetique + des plus faible qui faire réagir les particules (donc sous l'atome) des tissues (là ou il y en a) d'une facon qu'on sais localiser précisement dans l'espace.
- On obtient donc une image sur fond noir, ou des zone plus ou moins blanche correspondent aux tissues présent dans le crane.
- Là où une image est constituée de pixel, un image irm est constituée de voxels.
- Le fichier sortie est au format 'NIFTI-1' (il y en a d'autre) : .nii
- Alors nous, on récupère le fichier, on lance notre IDE préféré et ...

### Binaire

- … C'est du binaire !
- Alors parlons un peu de binaire. (va-t-il parler de javascript ?)
- C'est un système de numération en base 2 (on à l'habitude du base 10)
- Le bit, l'octet, le kilo octet
- Ainsi le final de GoT fait plus de 536 million d'octets (comme ça on aura au moins répondu à la question "Combien de bits dans un épisode de GoT")
- Bon très bien … on a une très longue suite de zero et de un. Comment est-ce qu'on obtient une image du cerveau ?

### Representer l'information

- Cette suite, elle représente une information. (a.k.a Informatique).
- On va s'interesser à comment on l'a obtenu, pour comprendre comment la déchiffrer.
- Numériser : transformer en nombre. (ex: département)
- Ecrire ce nombre sous sa forme binaire (10 => 2)
- Un exemple de numérisation : le code de sécurité sociale

#### Représenter une image

- Grille de pixel
- Chaque pixel contient une couleur
- Chaque couleur est numérisé par 3 entiers de 0 à 255
- Pourquoi ce le blanc c'est 255,255,255 ?
- Parce qu'on a choisi de le stocker sur 8 bit !
- Et puisqu'on a 3 entier RVB, ça fait 24 bits et 16 millions de couleurs possibles. Les fameuses "couleurs vraies" de Windows 2000.
- Maintenant quand on voit une chaine binaire comme celle ci, on peut la décoder comme une succession groups de 3 d'octets codant la couleur d'un pixel
- Et la décoder ainsi. Ici, deux pixel de couleurs
- Mais on peut aussi avoir décider d'encoder chaque couleurs sur 16bit, pour plus de nuances.
- Et alors la chaine prendre une tout autre signification, ici un pixel seulement, mais dans un nuancier bien plus vaste.
- Une chaine binaire n'a pas de signification en soit
- Il faut connaitre son format pour savoir quelle informations elle contient et où celles-ci se situent dans la chaine.
- C'est d'ailleurs le problème qu'on a avec une autre grande chaine très célèbre qui code de l'information.
- ADN: on a pas la spec !

### Manipuler du binaire en JS

- L'arraybuffer = une chaine binaire
- Différent tableau typés, qui serve considerer une chaine binaire comme un tableau de nombre.
- Ecriture
- attention aux depassemetns
- pacman int overflow
- utilitaires
- php
- Recevoir des données

### Nifti-1

- le header
- lire le header
- On peut en déduire la taille du fichier (même vide)
- Body : plus simple qu'une image, 1 voxel = 1 entier (nuance de gris)
- Lire le body avec un seul tableau typé qui va bien
- Après ça il ne nou reste plus qu'a afficher l'image !

### DEMO

### Pourquoi c'est cool

- poids
- rapidité d'encodage / décodage
- support

### Pourquoi c'est chaud 

- Pas lisible par l'humain
- Rigide: la spec doit être prévue / connue à l'avance
- Pas de bug, mais des overflow !

### Idées d'utilisation

### Javascript gère bien le binaire





