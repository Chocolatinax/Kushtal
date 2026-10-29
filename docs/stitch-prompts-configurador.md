# Prompts para Stitch: fotos del configurador

El configurador ya no pinta filtros sobre la foto: muestra **fotos reales** de
cada modelo en cada color, y fotos de detalle de la piel, el forro, los
herrajes y los accesorios. Hacen falta **34 imágenes**.

## Opción rápida: por lotes (6 prompts en vez de 34)

Cada prompt pide a Stitch **una sola pantalla** con todas las fotos de ese
lote en cuadrícula. Stitch guarda cada foto de la pantalla como una imagen
aparte, así que luego se descargan por separado. Copia cada bloque completo y
pégalo tal cual.

Después: pásale a Claude el export de Stitch ("Get the images and code" de cada
pantalla) y él descarga las fotos y las guarda con el nombre correcto.

Cuidado: con muchas fotos en una pantalla Stitch puede variar un poco el ángulo
entre ellas. Si un lote sale disparejo, rehaz solo esa foto con el prompt
individual de más abajo.

### Lote 1 — Bifold Signature

```
Create a single screen that is a product photo contact sheet: a 2x2 grid of
four square product photographs on a plain #FAF7F2 background, with a small
caption under each photo. Each photo must be a SEPARATE image.

All four photos are IDENTICAL in composition, camera angle, lighting and
background — only the leather color changes. Professional e-commerce product
photography: a classic slim bifold men's wallet, closed, smooth full-grain
cowhide, burnished waxed edges, light beige linen hand stitching. Centered,
three-quarter view from about 30 degrees above, filling about 70% of the frame.
Seamless warm off-white background (#FAF7F2), soft shadow under the wallet,
soft diffused daylight from the upper left. Photorealistic. No text, logos,
hands or props inside the photos.

Photos and captions:
1. "caramelo" — caramel tan leather (#A9672F)
2. "chocolate" — deep chocolate brown leather (#3B2318)
3. "azabache" — matte jet black leather (#17161A)
4. "indigo" — deep navy indigo leather (#1E2B4F)
```

### Lote 2 — Tarjeteros (los dos modelos)

```
Create a single screen that is a product photo contact sheet: a grid of seven
square product photographs on a plain #FAF7F2 background, with a small caption
under each photo. Each photo must be a SEPARATE image.

Within each product, the photos are IDENTICAL in composition, camera angle,
lighting and background — only the leather color changes. Professional
e-commerce product photography, smooth cowhide, burnished waxed edges, light
beige linen hand stitching. Centered, three-quarter view from about 30 degrees
above, filling about 70% of the frame. Seamless warm off-white background
(#FAF7F2), soft shadow, soft diffused daylight from the upper left.
Photorealistic. No text, logos, hands or props inside the photos.

Product A: a minimalist slim cardholder with 4 card slots and a central
pocket, very thin (5 mm), lying flat with one card slightly visible.
1. "tarjetero-01 azabache" — matte jet black leather (#17161A)
2. "tarjetero-01 indigo" — deep navy indigo leather (#1E2B4F)
3. "tarjetero-01 salvia" — muted sage green leather (#77876B)
4. "tarjetero-01 caramelo" — caramel tan leather (#A9672F)

Product B: a slim folding cardholder with a double flap and a discreet
magnetic closure, closed, very thin profile.
5. "plegable salvia" — muted sage green leather (#77876B)
6. "plegable indigo" — deep navy indigo leather (#1E2B4F)
7. "plegable azabache" — matte jet black leather (#17161A)
```

### Lote 3 — Billeteras largas (Continental Roma y Portadocumentos)

```
Create a single screen that is a product photo contact sheet: a grid of six
square product photographs on a plain #FAF7F2 background, with a small caption
under each photo. Each photo must be a SEPARATE image.

Within each product, the photos are IDENTICAL in composition, camera angle,
lighting and background — only the leather color changes. Professional
e-commerce product photography, burnished waxed edges, light beige linen hand
stitching. Centered, three-quarter view from about 30 degrees above, filling
about 70% of the frame. Seamless warm off-white background (#FAF7F2), soft
shadow, soft diffused daylight from the upper left. Photorealistic. No text,
logos, hands or props inside the photos.

Product A: a long vertical continental wallet (tall, for full-size bills and
passport), closed, pebbled full-grain leather.
1. "continental chocolate" — deep chocolate brown leather (#3B2318)
2. "continental azabache" — matte jet black leather (#17161A)
3. "continental caramelo" — caramel tan leather (#A9672F)

Product B: a leather travel document holder sized for a passport and boarding
pass, closed, vegetable-tanned leather with a slightly waxy natural finish.
4. "portadocumentos caramelo" — caramel tan leather (#A9672F)
5. "portadocumentos chocolate" — deep chocolate brown leather (#3B2318)
6. "portadocumentos indigo" — deep navy indigo leather (#1E2B4F)
```

### Lote 4 — Billetera con Cremallera

```
Create a single screen that is a product photo contact sheet: a row of three
square product photographs on a plain #FAF7F2 background, with a small caption
under each photo. Each photo must be a SEPARATE image.

All three photos are IDENTICAL in composition, camera angle, lighting and
background — only the leather color changes. Professional e-commerce product
photography: a zip-around accordion wallet, closed, with a metal zipper
running around three sides, pebbled full-grain leather, light beige linen hand
stitching. Centered, three-quarter view from about 30 degrees above, filling
about 70% of the frame. Seamless warm off-white background (#FAF7F2), soft
shadow, soft diffused daylight from the upper left. Photorealistic. No text,
logos, hands or props inside the photos.

Photos and captions:
1. "cremallera chocolate" — deep chocolate brown leather (#3B2318)
2. "cremallera azabache" — matte jet black leather (#17161A)
3. "cremallera salvia" — muted sage green leather (#77876B)
```

### Lote 5 — Pieles y forros

```
Create a single screen that is a materials contact sheet: a 4x2 grid of eight
square macro photographs on a plain #FAF7F2 background, with a small caption
under each photo. Each photo must be a SEPARATE image.

All photos: macro close-up, filling the whole frame, soft diffused daylight,
shallow depth of field, photorealistic. No text, logos or hands inside the
photos.

Row 1 — leather types (all in caramel tan, so only the texture changes):
1. "vacuna-lisa" — smooth polished full-grain cowhide, fine even surface,
   subtle sheen
2. "grano-natural" — pebbled full-grain leather, visible natural grain
3. "curtido-vegetal" — vegetable-tanned leather, slightly waxy, natural color
   variation and early patina
4. "crazy-horse" — oiled distressed crazy horse leather in brown, lighter
   tones where it is folded

Row 2 — wallet linings, seen inside an open leather wallet:
5. "arena" — natural undyed linen lining, sand beige
6. "algodon" — tightly woven raw cotton lining, off-white cream
7. "anil" — waxed canvas lining, deep navy indigo (#1E2B4F)
8. "tormenta" — technical waterproof fabric lining, deep stormy teal (#22655E)
```

### Lote 6 — Herrajes y accesorios

```
Create a single screen that is a details contact sheet: a 3x2 grid of six
square macro photographs on a plain #FAF7F2 background, with a small caption
under each photo. Each photo must be a SEPARATE image.

All photos: macro close-up on brown leather, filling the whole frame, soft
diffused daylight, shallow depth of field, photorealistic. No text, logos or
hands inside the photos.

Row 1 — hardware, the same rivet and snap in three finishes:
1. "niquel-mate" — matte nickel
2. "laton" — brushed brass, warm golden tone
3. "oro-mate" — brushed matte gold plating

Row 2 — accessories inside a leather wallet:
4. "rfid" — a thin silver RFID-blocking lining layer behind the card slots,
   with a contactless card partially inserted
5. "airtag" — a hidden round pocket holding an Apple AirTag, slightly visible
6. "clip" — a leather-wrapped steel money clip holding folded banknotes
```

---

## Opción por imagen (una por una)

Úsala para rehacer una foto que salió mal en un lote.

1. En Stitch, pega primero el **bloque de estilo** (siempre igual) y debajo el
   prompt de la imagen. Así todas salen con la misma luz, fondo y ángulo.
2. Descarga cada imagen y guárdala con el **nombre exacto** de la tabla, dentro
   de `public/configurador/`. Sirve `.webp`, `.jpg` o `.png`.
3. Recarga el configurador: la foto aparece sola. Si falta alguna, se muestra la
   foto original del modelo con el aviso "Foto de referencia".

Consejo: genera primero un modelo en un color, y si te gusta, pide a Stitch
"la misma foto, idéntica composición, cambiando solo el color del cuero a …"
para los demás tonos. Así no cambia el ángulo entre colores.

---

## Bloque de estilo (pégalo antes de cada prompt)

```
Professional e-commerce product photograph, square 1:1, 1600x1600.
Single handcrafted leather wallet, centered, three-quarter view from slightly
above (about 30 degrees), occupying about 70% of the frame.
Seamless warm off-white background (#FAF7F2) with a subtle soft shadow under
the product. Soft diffused daylight from the upper left, no harsh reflections.
Sharp focus on the leather grain and the hand stitching along the edges.
Burnished waxed edges, natural linen thread stitching in light beige.
No text, no logo, no hands, no props, no watermark. Photorealistic, high detail.
```

---

## 1. Modelos por color (20 fotos)

Carpeta: `public/configurador/modelos/<modelo>/<color>.webp`

Colores del cuero:

| Código | Nombre | Color |
|---|---|---|
| `caramelo` | Caramelo tostado | caramel tan leather, #A9672F |
| `chocolate` | Marrón chocolate | deep chocolate brown leather, #3B2318 |
| `azabache` | Negro azabache | matte jet black leather, #17161A |
| `indigo` | Azul añil | deep navy indigo leather, #1E2B4F |
| `salvia` | Verde salvia | muted sage green leather, #77876B |

### Bifold Signature — `modelos/bifold-signature-atelier/`

```
A classic bifold men's wallet, closed, slim, smooth full-grain cowhide.
Leather color: {COLOR}.
```

Archivos: `caramelo.webp`, `chocolate.webp`, `azabache.webp`, `indigo.webp`

### Tarjetero No. 01 — `modelos/tarjetero-atelier-no-01/`

```
A minimalist slim cardholder with 4 card slots and a central pocket, very thin
(5 mm), lying flat with one card slightly visible. Smooth cowhide.
Leather color: {COLOR}.
```

Archivos: `azabache.webp`, `indigo.webp`, `salvia.webp`, `caramelo.webp`

### Billetera Continental Roma — `modelos/billetera-continental-roma/`

```
A long vertical continental wallet (tall, for full-size bills and passport),
closed, pebbled full-grain leather texture.
Leather color: {COLOR}.
```

Archivos: `chocolate.webp`, `azabache.webp`, `caramelo.webp`

### Portadocumentos de Viaje — `modelos/portadocumentos-postal/`

```
A leather travel document holder sized for a passport and boarding pass,
closed, vegetable-tanned leather with a slightly waxy natural finish.
Leather color: {COLOR}.
```

Archivos: `caramelo.webp`, `chocolate.webp`, `indigo.webp`

### Tarjetero Plegable Slim — `modelos/tarjetero-plegable-slim/`

```
A slim folding cardholder with a double flap and a discreet magnetic closure,
closed, smooth cowhide, very thin profile.
Leather color: {COLOR}.
```

Archivos: `salvia.webp`, `indigo.webp`, `azabache.webp`

### Billetera con Cremallera — `modelos/billetera-zip-accordion/`

```
A zip-around accordion wallet, closed, with a metal zipper running around
three sides, pebbled full-grain leather.
Leather color: {COLOR}.
```

Archivos: `chocolate.webp`, `azabache.webp`, `salvia.webp`

---

## 2. Fotos de detalle (14 fotos)

Para estas usa este bloque de estilo en lugar del anterior:

```
Macro close-up product photograph, square 1:1, 1000x1000, filling the whole
frame. Soft diffused daylight, shallow depth of field, photorealistic.
No text, no logo, no hands, no watermark.
```

### Tipo de piel — `materiales/textura/`

| Archivo | Prompt |
|---|---|
| `vacuna-lisa.webp` | Close-up of smooth polished full-grain cowhide leather in caramel tan, fine even surface, subtle sheen. |
| `grano-natural.webp` | Close-up of pebbled full-grain leather in caramel tan, visible natural grain texture. |
| `curtido-vegetal.webp` | Close-up of vegetable-tanned leather in natural tan, slightly waxy, with natural color variation and early patina. |
| `crazy-horse.webp` | Close-up of crazy horse leather in brown, oiled and distressed, lighter tones where the leather is folded. |

### Forro interior — `materiales/interior/`

| Archivo | Prompt |
|---|---|
| `arena.webp` | Inside of an open leather wallet showing a natural undyed linen fabric lining, sand beige. |
| `algodon.webp` | Inside of an open leather wallet showing a tightly woven raw cotton lining, off-white cream. |
| `anil.webp` | Inside of an open leather wallet showing a waxed canvas lining in deep navy indigo (#1E2B4F). |
| `tormenta.webp` | Inside of an open leather wallet showing a technical waterproof fabric lining in deep stormy teal (#22655E). |

### Herrajes — `materiales/herrajes/`

| Archivo | Prompt |
|---|---|
| `niquel-mate.webp` | Close-up of a matte nickel metal rivet and snap on brown leather. |
| `laton.webp` | Close-up of a brushed brass metal rivet and snap on brown leather, warm golden tone. |
| `oro-mate.webp` | Close-up of a brushed matte gold-plated rivet and snap on brown leather. |

### Accesorios — `materiales/rfid/`, `materiales/airtag/`, `materiales/clip/`

Cada uno en su carpeta, con el archivo `si.webp`:

| Archivo | Prompt |
|---|---|
| `rfid/si.webp` | Inside of an open leather wallet showing a thin silver RFID-blocking lining layer behind the card slots, with a contactless card partially inserted. |
| `airtag/si.webp` | Close-up of a hidden round pocket inside a leather wallet holding an Apple AirTag, the tracker slightly visible. |
| `clip/si.webp` | Close-up of a leather-wrapped steel money clip attached inside a slim wallet, holding folded banknotes. |

---

## Lista completa de archivos

```
public/configurador/
├── modelos/
│   ├── bifold-signature-atelier/   caramelo · chocolate · azabache · indigo
│   ├── tarjetero-atelier-no-01/    azabache · indigo · salvia · caramelo
│   ├── billetera-continental-roma/ chocolate · azabache · caramelo
│   ├── portadocumentos-postal/     caramelo · chocolate · indigo
│   ├── tarjetero-plegable-slim/    salvia · indigo · azabache
│   └── billetera-zip-accordion/    chocolate · azabache · salvia
└── materiales/
    ├── textura/   vacuna-lisa · grano-natural · curtido-vegetal · crazy-horse
    ├── interior/  arena · algodon · anil · tormenta
    ├── herrajes/  niquel-mate · laton · oro-mate
    ├── rfid/      si
    ├── airtag/    si
    └── clip/      si
```
