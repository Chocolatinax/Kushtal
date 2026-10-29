#!/usr/bin/env python3
"""
Genera supabase/seed.sql: los 6 productos de Kushtal y sus grupos de
personalización.

Los grupos y sus valores son iguales para toda la colección, así que se
insertan con un cross join contra products en vez de repetirlos producto por
producto. El archivo queda chico y es idempotente.

Las URLs de imagen salen del export de Stitch (scripts/stitch-images.json).
Cuando tengas las fotos definitivas, cambia ese JSON o edita products.hero_image.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
IMAGES = json.loads((ROOT / "scripts" / "stitch-images.json").read_text())

# [0] de cada lista es el placeholder del logo en el nav, no un producto.
CAT = IMAGES["cat_logo_colecci_n_personalizable_kushtal"][1:]
HOME = IMAGES["inicio_kushtal_cuero_de_autor"]
HERO, MACRO = HOME[1], HOME[2]
ATELIER = HOME[6:10]


def q(value):
    """Escapa un literal de texto para Postgres."""
    if value is None:
        return "null"
    return "'" + str(value).replace("'", "''") + "'"


def arr(values):
    inner = ",".join('"' + str(v).replace('"', '\\"') + '"' for v in values)
    return "'{" + inner + "}'"


# --------------------------------------------------------------------------
# Opciones compartidas por toda la colección.
# El delta es la "variable increase per customized element" de Kushtal:
# cada elemento personalizado suma sobre el precio base de $50.
# --------------------------------------------------------------------------
GROUPS = [
    {
        "code": "tono",
        "label": "Color exterior",
        "helper": "Cada tono nace de un pigmento distinto y envejece a su ritmo.",
        "type": "color",
        "required": True,
        "max_length": None,
        "values": [
            ("caramelo", "Caramelo tostado", "Curtido tradicional, se oscurece con el uso", "#A9672F", 0),
            ("chocolate", "Marrón chocolate", "Profundo y cálido", "#3B2318", 0),
            ("azabache", "Negro azabache", "Acabado mate, sobrio y ejecutivo", "#17161A", 500),
            ("indigo", "Azul añil", "Mate añil, sereno", "#1E2B4F", 500),
            ("salvia", "Verde salvia", "Tinte botánico de baja saturación", "#77876B", 800),
        ],
    },
    {
        "code": "interior",
        "label": "Forro interior",
        "helper": "La tela que ves cada vez que la abres.",
        "type": "color",
        "required": True,
        "max_length": None,
        "values": [
            ("arena", "Arena natural", "Lino de algodón sin teñir", "#D9CCB4", 0),
            ("algodon", "Algodón crudo", "Algodón orgánico de trama cerrada", "#F3EDE3", 0),
            ("anil", "Lona añil", "Lona de algodón encerada, resistente al roce", "#1E2B4F", 400),
            ("tormenta", "Verde tormenta", "Tela técnica impermeable", "#22655E", 600),
        ],
    },
    {
        "code": "textura",
        "label": "Tipo de piel y textura",
        "helper": "El cuero define el tacto y cómo envejece tu billetera.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("vacuna-lisa", "Cuero vacuno liso", "Flor entera pulida, calibre 1.2 mm", None, 0),
            ("grano-natural", "Piel de grano entero", "Calibre 1.4 mm, tacto suave y pátina rápida", None, 1000),
            ("curtido-vegetal", "Curtido vegetal", "Curtido con taninos naturales, envejece con la luz", None, 1500),
            ("crazy-horse", "Cuero Crazy Horse", "Encerado y envejecido, cambia de tono al doblarse", None, 1800),
        ],
    },
    # Sin grupo de hilo: no hay fotos que muestren el cambio y no aporta a la
    # decisión. Todas se cosen con hilo de lino encerado en tono crudo.
    {
        "code": "canto",
        "label": "Acabado de cantos",
        "helper": "El borde es lo primero que se gasta. Elige cómo se protege.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("brunido", "Bruñido a cera", "Canto sellado con cera de abeja", None, 0),
            ("pintado", "Pintado a mano", "Varias capas de pintura lijadas entre sí", None, 600),
        ],
    },
    {
        "code": "herrajes",
        "label": "Herrajes",
        "helper": "Remaches, broches y cierres de tu pieza.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("niquel-mate", "Níquel mate", "Discreto, no se oxida", None, 0),
            ("laton", "Latón cepillado", "Cálido, gana pátina con el tiempo", None, 400),
            ("oro-mate", "Oro cepillado mate", "Baño de oro con acabado cepillado", None, 800),
        ],
    },
    {
        "code": "grabado",
        "label": "Monograma",
        "helper": "Hasta 12 caracteres. El grabado va incluido en tu pieza.",
        "type": "engraving",
        "required": False,
        "max_length": 12,
        "values": [],
    },
    {
        "code": "grabado_acabado",
        "label": "Acabado del grabado",
        "helper": "Cómo queda marcado el monograma sobre la piel.",
        "type": "select",
        "required": False,
        "max_length": None,
        "values": [
            ("golpe-seco", "Golpe seco", "Hierro caliente sin pigmento. Incluido.", None, 0),
            ("foil-oro", "Lámina de oro", "Foil dorado aplicado en caliente", None, 800),
        ],
    },
    # Accesorios: cada uno es un grupo "toggle" opcional con un único valor.
    # El configurador los junta en un solo bloque "Accesorios".
    # Monedero, llavero y cadena quedan fuera: la arquitectura web los descarta
    # como fuera de catálogo.
    {
        "code": "rfid",
        "label": "Bloqueo RFID",
        "helper": "Forro que bloquea la lectura sin contacto de tus tarjetas (anticlonación).",
        "type": "toggle",
        "required": False,
        "max_length": None,
        "values": [
            ("si", "Bloqueo RFID", "Protege tus tarjetas contactless de lecturas no autorizadas", None, 800),
        ],
    },
    {
        "code": "airtag",
        "label": "Espacio para AirTag",
        "helper": "Bolsillo oculto para ubicar tu billetera si se pierde.",
        "type": "toggle",
        "required": False,
        "max_length": None,
        "values": [
            ("si", "Espacio para AirTag", "Bolsillo oculto a la medida del AirTag", None, 1000),
        ],
    },
    {
        "code": "clip",
        "label": "Clip para billetes",
        "helper": "Sujeta los billetes sin doblarlos dos veces.",
        "type": "toggle",
        "required": False,
        "max_length": None,
        "values": [
            ("si", "Clip para billetes", "Clip de acero forrado en piel", None, 600),
        ],
    },
    {
        "code": "estuche",
        "label": "Empaque",
        "helper": "Cómo llega tu pieza. Ideal si es un regalo.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("lino", "Funda de lino", "Funda de algodón y sello de cera. Incluida.", None, 0),
            ("rigido", "Caja de regalo rígida", "Caja de fibra reciclada con tarjeta escrita a mano", None, 1000),
        ],
    },
]

# Precio base único de la colección: $50. Lo demás lo suma la personalización.
BASE_PRICE_CENTS = 5000

# tones = tonos en los que se ofrece cada modelo (el resto se da de baja en el
# configurador). texture = la piel con la que se fotografió y que viene
# preseleccionada; es la que usa el filtro "Piel" del catálogo.
PRODUCTS = [
    ("bifold-signature-atelier", "Bifold Signature", "Bifold clásica",
     "Seis ranuras para tarjetas, doble compartimento para billetes y cantos bruñidos a mano. La silueta de la casa: la que define todo lo demás.",
     "bifold", "Personalizable", "6 ranuras", "Cuero vacuno",
     CAT[0], [HERO, MACRO], ["caramelo", "chocolate", "azabache", "indigo"],
     "vacuna-lisa", True),

    ("tarjetero-atelier-no-01", "Tarjetero No. 01", "Minimalista slim",
     "Perfil extraplano de 4 ranuras y bolsillo central para billetes doblados. Ideal para llevar en el bolsillo delantero.",
     "tarjetero", "Novedad", "Ultra compacto", "Grosor 5 mm",
     CAT[1], [ATELIER[1]], ["azabache", "indigo", "salvia", "caramelo"],
     "vacuna-lisa", True),

    ("billetera-continental-roma", "Billetera Continental Roma", "Larga continental",
     "Formato vertical para billetes enteros, chequera o pasaporte. Doce ranuras para tarjetas y un fuelle interior.",
     "larga", "Personalizable", "Gran capacidad", "12 ranuras",
     CAT[2], [ATELIER[2]], ["chocolate", "azabache", "caramelo"],
     "grano-natural", True),

    ("portadocumentos-postal", "Portadocumentos de Viaje", "Viaje y pasaporte",
     "Pasaporte, pase de abordar y billetes en una silueta de viaje que no se deforma.",
     "larga", "Para viajar", "Porta pasaporte", "Fuelle reforzado",
     CAT[3], [ATELIER[3]], ["caramelo", "chocolate", "indigo"],
     "curtido-vegetal", False),

    ("tarjetero-plegable-slim", "Tarjetero Plegable Slim", "Plegable minimalista",
     "Doble solapa con cierre magnético para hasta 8 tarjetas y recibos, sin perder el perfil delgado.",
     "tarjetero", "Novedad", "Doble solapa", "Cierre magnético",
     CAT[4], [ATELIER[0]], ["salvia", "indigo", "azabache"],
     "vacuna-lisa", False),

    ("billetera-zip-accordion", "Billetera con Cremallera", "Cierre seguro",
     "Apertura en abanico con cinco divisiones para tarjetas, monedas y efectivo, asegurada con cremallera metálica.",
     "cremallera", "Personalizable", "Cremallera", "5 divisiones",
     CAT[5], [ATELIER[2]], ["chocolate", "azabache", "salvia"],
     "grano-natural", False),
]

# Intención de búsqueda de cada modelo: alimenta las páginas de la arquitectura
# web (/billeteras-hombre/, /billeteras-mujer/, /tarjeteros/…).
TAGS = {
    "bifold-signature-atelier": ["hombre"],
    "tarjetero-atelier-no-01": ["hombre", "mujer", "slim"],
    "billetera-continental-roma": ["mujer"],
    "portadocumentos-postal": ["hombre", "mujer", "viaje"],
    "tarjetero-plegable-slim": ["hombre", "mujer", "slim"],
    "billetera-zip-accordion": ["mujer"],
}


def model_photo(slug: str, tone: str) -> str:
    """Foto real del modelo en ese tono (public/configurador/modelos/)."""
    return f"/configurador/modelos/{slug}/{tone}.jpg"


_TONE_CODES = {v[0] for g in GROUPS if g["code"] == "tono" for v in g["values"]}
_TONE_ORDER = [v[0] for g in GROUPS if g["code"] == "tono" for v in g["values"]]
_TEXTURE_CODES = {v[0] for g in GROUPS if g["code"] == "textura" for v in g["values"]}
for _p in PRODUCTS:
    assert set(_p[10]) <= _TONE_CODES, _p[0]
    assert _p[11] in _TEXTURE_CODES, _p[0]
    assert _p[0] in TAGS, _p[0]
    for _tone in _p[10]:
        assert (ROOT / "public" / model_photo(_p[0], _tone).lstrip("/")).exists(), (_p[0], _tone)


def main() -> None:
    out: list[str] = []
    w = out.append

    w("-- ===========================================================")
    w("-- Kushtal — datos de arranque. Generado por scripts/build-seed.py")
    w("-- Idempotente: puedes correrlo las veces que quieras.")
    w("-- ===========================================================")
    w("")
    w("truncate table public.cart_items, public.carts cascade;")
    w("delete from public.option_values;")
    w("delete from public.option_groups;")
    w("delete from public.products;")
    w("")

    # ---------------------------------------------------------------- products
    w("insert into public.products")
    w("  (slug, name, tagline, description, category, base_price_cents, badge,")
    w("   capacity_label, leather_label, hero_image, images, tones, tags, texture, featured)")
    w("values")

    rows = []
    for (slug, name, tagline, desc, cat, badge, capacity,
         leather, _stitch_hero, _stitch_extra, tones, texture, featured) in PRODUCTS:
        # La foto principal es la del tono que el configurador preselecciona
        # (el primero en el orden del grupo "tono"); las demás, sus otros tonos.
        ordered = [t for t in _TONE_ORDER if t in tones]
        photos = [model_photo(slug, t) for t in ordered]
        rows.append(
            f"  ({q(slug)}, {q(name)}, {q(tagline)}, {q(desc)}, {q(cat)}, {BASE_PRICE_CENTS},\n"
            f"   {q(badge)}, {q(capacity)}, {q(leather)},\n"
            f"   {q(photos[0])},\n"
            f"   {arr(photos)},\n"
            f"   {arr(tones)}, {arr(TAGS[slug])}, {q(texture)}, {str(featured).lower()})"
        )
    w(",\n".join(rows) + ";")
    w("")

    # ----------------------------------------------------------------- groups
    w("-- Los grupos son iguales para toda la colección: cross join.")
    w("insert into public.option_groups")
    w("  (product_id, code, label, helper, type, required, max_length,")
    w("   price_delta_cents, position)")
    w("select p.id, g.code, g.label, g.helper, g.type, g.required, g.max_length, 0, g.position")
    w("from public.products p")
    w("cross join (values")

    grows = []
    for i, g in enumerate(GROUPS):
        maxlen = g["max_length"] if g["max_length"] is not None else "null"
        grows.append(
            f"  ({q(g['code'])}, {q(g['label'])}, {q(g['helper'])}, {q(g['type'])},"
            f" {str(g['required']).lower()}, {maxlen}::int, {i})"
        )
    w(",\n".join(grows))
    w(") as g(code, label, helper, type, required, max_length, position);")
    w("")

    # ----------------------------------------------------------------- values
    w("-- Los valores cuelgan de cada grupo por su code.")
    w("insert into public.option_values")
    w("  (group_id, code, label, description, hex, price_delta_cents, position)")
    w("select g.id, v.code, v.label, v.description, v.hex, v.delta, v.position")
    w("from public.option_groups g")
    w("join (values")

    vrows = []
    for g in GROUPS:
        for i, (code, label, desc, hexv, delta) in enumerate(g["values"]):
            vrows.append(
                f"  ({q(g['code'])}, {q(code)}, {q(label)}, {q(desc)},"
                f" {q(hexv)}, {delta}, {i})"
            )
    w(",\n".join(vrows))
    w(") as v(group_code, code, label, description, hex, delta, position)")
    w("  on v.group_code = g.code;")
    w("")

    # ------------------------------------------------------ tonos por modelo
    w("-- Cada modelo se ofrece solo en sus tonos (products.tones): el resto se")
    w("-- da de baja para que el configurador y el filtro de tono coincidan.")
    w("update public.option_values v")
    w("set active = false")
    w("from public.option_groups g")
    w("join public.products p on p.id = g.product_id")
    w("where v.group_id = g.id")
    w("  and g.code = 'tono'")
    w("  and not (v.code = any (p.tones));")

    target = ROOT / "supabase" / "seed.sql"
    target.write_text("\n".join(out) + "\n", encoding="utf-8")
    size = target.stat().st_size
    print(f"escrito {target} ({len(out)} líneas, {size} bytes, {len(PRODUCTS)} productos)")


if __name__ == "__main__":
    main()
