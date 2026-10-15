#!/usr/bin/env python3
"""
Genera supabase/seed.sql: los 6 productos de Kushtal y sus grupos de
personalización.

Los 7 grupos y sus valores son iguales para toda la colección, así que se
insertan con un cross join contra products en vez de repetirlos producto por
producto. El archivo queda chico y es idempotente.

Las URLs de imagen salen del export de Stitch (scripts/stitch-images.json).
Cuando tengas las fotos definitivas, cambiá ese JSON o editá products.hero_image.
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
# las pieles y acabados premium cuestan más que el curtido tradicional.
# --------------------------------------------------------------------------
GROUPS = [
    {
        "code": "tono",
        "label": "Tono de la piel",
        "helper": "Cada tono nace de un pigmento distinto y envejece a su ritmo.",
        "type": "color",
        "required": True,
        "max_length": None,
        "values": [
            ("caramelo", "Caramelo Tostado", "Curtido toscano tradicional", "#A9672F", 0),
            ("chocolate", "Marrón Chocolate", "Profundo y aterciopelado en caliente", "#3B2318", 0),
            ("azabache", "Negro Azabache", "Acabado pulido mate, sobriedad arquitectónica", "#17161A", 1000),
            ("indigo", "Azul Ceniza Índigo", "Mate añil sobrio y sereno", "#1E2B4F", 1500),
            ("salvia", "Verde Salvia", "Tinte botánico de baja saturación", "#77876B", 2000),
        ],
    },
    {
        "code": "textura",
        "label": "Textura y curtido",
        "helper": "El acabado define el tacto y la velocidad de la pátina.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("vacuna-lisa", "Vacuna Lisa", "Flor entera pulida, calibre 1.2mm", None, 0),
            ("grano-natural", "Grano Natural", "Calibre 1.4mm, textura mantecosa con pátina dorada rápida", None, 1500),
            ("toscana", "Pátina Toscana", "Curtido vegetal de barrica, envejece con la luz", None, 2500),
            ("palmellato", "Palmellato Exótico", "Grano martillado a mano en tambor lento", None, 4000),
        ],
    },
    {
        "code": "hilo",
        "label": "Hilo del pespunte",
        "helper": "Costura a dos agujas con lino japonés encerado.",
        "type": "color",
        "required": True,
        "max_length": None,
        "values": [
            ("crudo", "Lino Crudo", "Hilo de lino encerado sin teñir", "#D9CCB4", 0),
            ("tono-sobre-tono", "Tono sobre Tono", "Desaparece en la piel, costura silenciosa", "#8A7A68", 0),
            ("contraste-cafe", "Contraste Café", "Pespunte visible en café tostado", "#8A5A3B", 500),
            ("oro-viejo", "Oro Viejo", "Hilo metalizado de seda y latón", "#B8914B", 900),
        ],
    },
    {
        "code": "canto",
        "label": "Acabado de cantos",
        "helper": "El borde es lo primero que se gasta. Elegí cómo se protege.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("brunido", "Bruñido a Cera", "Canto sellado con cera virgen de abeja", None, 0),
            ("pintado", "Pintado a Mano", "Siete capas de pintura francesa lijadas entre sí", None, 1200),
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
            ("golpe-seco", "Golpe Seco", "Hierro caliente sin pigmento. Incluido en tu pieza.", None, 0),
            ("foil-oro", "Lámina de Oro 22k", "Foil de oro aplicado a 180°C", None, 1800),
        ],
    },
    {
        "code": "estuche",
        "label": "Ritual de entrega",
        "helper": "Cómo llega la pieza a sus manos.",
        "type": "select",
        "required": True,
        "max_length": None,
        "values": [
            ("lino", "Estuche de Lino", "Funda de algodón orgánico y sello de cera. Incluido.", None, 0),
            ("rigido", "Caja Rígida de Fibra", "Caja de fibra reciclada con bálsamo de cera", None, 2500),
        ],
    },
]

TONES = [v[0] for v in GROUPS[0]["values"]]

PRODUCTS = [
    ("bifold-signature-atelier", "Bifold Signature Atelier", "Silueta Bifold",
     "Seis ranuras biseladas para tarjetas, doble compartimento para divisas y cantos bruñidos a mano. La silueta de la casa: la que define todo lo demás.",
     "bifold", 12500, "Personalizable", "Piel vacuna 100%", "Flor entera europea",
     CAT[0], [HERO, MACRO], "lisa", True),

    ("tarjetero-atelier-no-01", "Tarjetero Atelier No. 01", "Minimal Slim",
     "Perfil extraplano de 4 ranuras y bolsillo central para billetes doblados. Ideal para porte frontal sin bulto.",
     "tarjetero", 8500, "Novedad Atelier", "Ultra compacto", "Grosor 5mm",
     CAT[1], [ATELIER[1]], "lisa", True),

    ("billetera-continental-roma", "Billetera Continental Roma", "Larga Continental",
     "Elegancia vertical para cheques, pasaporte o billetes enteros. Doce ranuras para credenciales y fuelle con bolsillo monedero interior cerrado.",
     "larga", 19500, "Personalizable", "Gran capacidad", "12 ranuras",
     CAT[2], [ATELIER[2]], "grano", True),

    ("portadocumentos-postal", "Portadocumentos Postal", "Viaje & Pasaporte",
     "Diseñado para resguardar pasaportes, billetes de embarque y divisas internacionales en una silueta de viaje que no se deforma.",
     "larga", 14000, "Edición Viajero", "Edición viajero", "Fuelle reforzado",
     CAT[3], [ATELIER[3]], "grano", False),

    ("tarjetero-plegable-slim", "Tarjetero Plegable Slim", "Plegable Minimal",
     "Doble solapa magnética suave con capacidad de hasta 8 tarjetas y recibos esenciales sin deformar el perfil.",
     "tarjetero", 9500, "Novedad", "Doble pestaña", "Cierre magnético",
     CAT[4], [ATELIER[0]], "lisa", False),

    ("billetera-zip-accordion", "Billetera Zip Accordion", "Cierre Seguro",
     "Apertura de abanico a 180° con cinco divisiones para tarjetas, monedas y efectivo, asegurada con cremallera de bronce macizo.",
     "cremallera", 13000, "Personalizable", "Cremallera bronce", "5 divisiones",
     CAT[5], [ATELIER[2]], "grano", False),
]


def main() -> None:
    out: list[str] = []
    w = out.append

    w("-- ===========================================================")
    w("-- Kushtal — datos de arranque. Generado por scripts/build-seed.py")
    w("-- Idempotente: podés correrlo las veces que quieras.")
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
    w("   capacity_label, leather_label, hero_image, images, tones, texture, featured)")
    w("values")

    rows = []
    for (slug, name, tagline, desc, cat, base, badge, capacity,
         leather, hero, extra, texture, featured) in PRODUCTS:
        rows.append(
            f"  ({q(slug)}, {q(name)}, {q(tagline)}, {q(desc)}, {q(cat)}, {base},\n"
            f"   {q(badge)}, {q(capacity)}, {q(leather)},\n"
            f"   {q(hero)},\n"
            f"   {arr([hero, *extra])},\n"
            f"   {arr(TONES)}, {q(texture)}, {str(featured).lower()})"
        )
    w(",\n".join(rows) + ";")
    w("")

    # ----------------------------------------------------------------- groups
    w("-- Los 7 grupos son iguales para toda la colección: cross join.")
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

    target = ROOT / "supabase" / "seed.sql"
    target.write_text("\n".join(out) + "\n", encoding="utf-8")
    size = target.stat().st_size
    print(f"escrito {target} ({len(out)} líneas, {size} bytes, {len(PRODUCTS)} productos)")


if __name__ == "__main__":
    main()
