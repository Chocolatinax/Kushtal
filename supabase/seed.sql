-- ===========================================================
-- Kushtal — datos de arranque. Generado por scripts/build-seed.py
-- Idempotente: puedes correrlo las veces que quieras.
-- ===========================================================

truncate table public.cart_items, public.carts cascade;
delete from public.option_values;
delete from public.option_groups;
delete from public.products;

insert into public.products
  (slug, name, tagline, description, category, base_price_cents, badge,
   capacity_label, leather_label, hero_image, images, tones, tags, texture, featured)
values
  ('bifold-signature-atelier', 'Bifold Signature', 'Bifold clásica', 'Seis ranuras para tarjetas, doble compartimento para billetes y cantos bruñidos a mano. La silueta de la casa: la que define todo lo demás.', 'bifold', 5000,
   'Personalizable', '6 ranuras', 'Cuero vacuno',
   '/configurador/modelos/bifold-signature-atelier/caramelo.jpg',
   '{"/configurador/modelos/bifold-signature-atelier/caramelo.jpg","/configurador/modelos/bifold-signature-atelier/chocolate.jpg","/configurador/modelos/bifold-signature-atelier/azabache.jpg","/configurador/modelos/bifold-signature-atelier/indigo.jpg"}',
   '{"caramelo","chocolate","azabache","indigo"}', '{"hombre"}', 'vacuna-lisa', true),
  ('tarjetero-atelier-no-01', 'Tarjetero No. 01', 'Minimalista slim', 'Perfil extraplano de 4 ranuras y bolsillo central para billetes doblados. Ideal para llevar en el bolsillo delantero.', 'tarjetero', 5000,
   'Novedad', 'Ultra compacto', 'Grosor 5 mm',
   '/configurador/modelos/tarjetero-atelier-no-01/caramelo.jpg',
   '{"/configurador/modelos/tarjetero-atelier-no-01/caramelo.jpg","/configurador/modelos/tarjetero-atelier-no-01/azabache.jpg","/configurador/modelos/tarjetero-atelier-no-01/indigo.jpg","/configurador/modelos/tarjetero-atelier-no-01/salvia.jpg"}',
   '{"azabache","indigo","salvia","caramelo"}', '{"hombre","mujer","slim"}', 'vacuna-lisa', true),
  ('billetera-continental-roma', 'Billetera Continental Roma', 'Larga continental', 'Formato vertical para billetes enteros, chequera o pasaporte. Doce ranuras para tarjetas y un fuelle interior.', 'larga', 5000,
   'Personalizable', 'Gran capacidad', '12 ranuras',
   '/configurador/modelos/billetera-continental-roma/caramelo.jpg',
   '{"/configurador/modelos/billetera-continental-roma/caramelo.jpg","/configurador/modelos/billetera-continental-roma/chocolate.jpg","/configurador/modelos/billetera-continental-roma/azabache.jpg"}',
   '{"chocolate","azabache","caramelo"}', '{"mujer"}', 'grano-natural', true),
  ('portadocumentos-postal', 'Portadocumentos de Viaje', 'Viaje y pasaporte', 'Pasaporte, pase de abordar y billetes en una silueta de viaje que no se deforma.', 'larga', 5000,
   'Para viajar', 'Porta pasaporte', 'Fuelle reforzado',
   '/configurador/modelos/portadocumentos-postal/caramelo.jpg',
   '{"/configurador/modelos/portadocumentos-postal/caramelo.jpg","/configurador/modelos/portadocumentos-postal/chocolate.jpg","/configurador/modelos/portadocumentos-postal/indigo.jpg"}',
   '{"caramelo","chocolate","indigo"}', '{"hombre","mujer","viaje"}', 'curtido-vegetal', false),
  ('tarjetero-plegable-slim', 'Tarjetero Plegable Slim', 'Plegable minimalista', 'Doble solapa con cierre magnético para hasta 8 tarjetas y recibos, sin perder el perfil delgado.', 'tarjetero', 5000,
   'Novedad', 'Doble solapa', 'Cierre magnético',
   '/configurador/modelos/tarjetero-plegable-slim/azabache.jpg',
   '{"/configurador/modelos/tarjetero-plegable-slim/azabache.jpg","/configurador/modelos/tarjetero-plegable-slim/indigo.jpg","/configurador/modelos/tarjetero-plegable-slim/salvia.jpg"}',
   '{"salvia","indigo","azabache"}', '{"hombre","mujer","slim"}', 'vacuna-lisa', false),
  ('billetera-zip-accordion', 'Billetera con Cremallera', 'Cierre seguro', 'Apertura en abanico con cinco divisiones para tarjetas, monedas y efectivo, asegurada con cremallera metálica.', 'cremallera', 5000,
   'Personalizable', 'Cremallera', '5 divisiones',
   '/configurador/modelos/billetera-zip-accordion/chocolate.jpg',
   '{"/configurador/modelos/billetera-zip-accordion/chocolate.jpg","/configurador/modelos/billetera-zip-accordion/azabache.jpg","/configurador/modelos/billetera-zip-accordion/salvia.jpg"}',
   '{"chocolate","azabache","salvia"}', '{"mujer"}', 'grano-natural', false);

-- Los grupos son iguales para toda la colección: cross join.
insert into public.option_groups
  (product_id, code, label, helper, type, required, max_length,
   price_delta_cents, position)
select p.id, g.code, g.label, g.helper, g.type, g.required, g.max_length, 0, g.position
from public.products p
cross join (values
  ('tono', 'Color exterior', 'Cada tono nace de un pigmento distinto y envejece a su ritmo.', 'color', true, null::int, 0),
  ('interior', 'Forro interior', 'La tela que ves cada vez que la abres.', 'color', true, null::int, 1),
  ('textura', 'Tipo de piel y textura', 'El cuero define el tacto y cómo envejece tu billetera.', 'select', true, null::int, 2),
  ('canto', 'Acabado de cantos', 'El borde es lo primero que se gasta. Elige cómo se protege.', 'select', true, null::int, 3),
  ('herrajes', 'Herrajes', 'Remaches, broches y cierres de tu pieza.', 'select', true, null::int, 4),
  ('grabado', 'Monograma', 'Hasta 12 caracteres. El grabado va incluido en tu pieza.', 'engraving', false, 12::int, 5),
  ('grabado_acabado', 'Acabado del grabado', 'Cómo queda marcado el monograma sobre la piel.', 'select', false, null::int, 6),
  ('rfid', 'Bloqueo RFID', 'Forro que bloquea la lectura sin contacto de tus tarjetas (anticlonación).', 'toggle', false, null::int, 7),
  ('airtag', 'Espacio para AirTag', 'Bolsillo oculto para ubicar tu billetera si se pierde.', 'toggle', false, null::int, 8),
  ('clip', 'Clip para billetes', 'Sujeta los billetes sin doblarlos dos veces.', 'toggle', false, null::int, 9),
  ('estuche', 'Empaque', 'Cómo llega tu pieza. Ideal si es un regalo.', 'select', true, null::int, 10)
) as g(code, label, helper, type, required, max_length, position);

-- Los valores cuelgan de cada grupo por su code.
insert into public.option_values
  (group_id, code, label, description, hex, price_delta_cents, position)
select g.id, v.code, v.label, v.description, v.hex, v.delta, v.position
from public.option_groups g
join (values
  ('tono', 'caramelo', 'Caramelo tostado', 'Curtido tradicional, se oscurece con el uso', '#A9672F', 0, 0),
  ('tono', 'chocolate', 'Marrón chocolate', 'Profundo y cálido', '#3B2318', 0, 1),
  ('tono', 'azabache', 'Negro azabache', 'Acabado mate, sobrio y ejecutivo', '#17161A', 500, 2),
  ('tono', 'indigo', 'Azul añil', 'Mate añil, sereno', '#1E2B4F', 500, 3),
  ('tono', 'salvia', 'Verde salvia', 'Tinte botánico de baja saturación', '#77876B', 800, 4),
  ('interior', 'arena', 'Arena natural', 'Lino de algodón sin teñir', '#D9CCB4', 0, 0),
  ('interior', 'algodon', 'Algodón crudo', 'Algodón orgánico de trama cerrada', '#F3EDE3', 0, 1),
  ('interior', 'anil', 'Lona añil', 'Lona de algodón encerada, resistente al roce', '#1E2B4F', 400, 2),
  ('interior', 'tormenta', 'Verde tormenta', 'Tela técnica impermeable', '#22655E', 600, 3),
  ('textura', 'vacuna-lisa', 'Cuero vacuno liso', 'Flor entera pulida, calibre 1.2 mm', null, 0, 0),
  ('textura', 'grano-natural', 'Piel de grano entero', 'Calibre 1.4 mm, tacto suave y pátina rápida', null, 1000, 1),
  ('textura', 'curtido-vegetal', 'Curtido vegetal', 'Curtido con taninos naturales, envejece con la luz', null, 1500, 2),
  ('textura', 'crazy-horse', 'Cuero Crazy Horse', 'Encerado y envejecido, cambia de tono al doblarse', null, 1800, 3),
  ('canto', 'brunido', 'Bruñido a cera', 'Canto sellado con cera de abeja', null, 0, 0),
  ('canto', 'pintado', 'Pintado a mano', 'Varias capas de pintura lijadas entre sí', null, 600, 1),
  ('herrajes', 'niquel-mate', 'Níquel mate', 'Discreto, no se oxida', null, 0, 0),
  ('herrajes', 'laton', 'Latón cepillado', 'Cálido, gana pátina con el tiempo', null, 400, 1),
  ('herrajes', 'oro-mate', 'Oro cepillado mate', 'Baño de oro con acabado cepillado', null, 800, 2),
  ('grabado_acabado', 'golpe-seco', 'Golpe seco', 'Hierro caliente sin pigmento. Incluido.', null, 0, 0),
  ('grabado_acabado', 'foil-oro', 'Lámina de oro', 'Foil dorado aplicado en caliente', null, 800, 1),
  ('rfid', 'si', 'Bloqueo RFID', 'Protege tus tarjetas contactless de lecturas no autorizadas', null, 800, 0),
  ('airtag', 'si', 'Espacio para AirTag', 'Bolsillo oculto a la medida del AirTag', null, 1000, 0),
  ('clip', 'si', 'Clip para billetes', 'Clip de acero forrado en piel', null, 600, 0),
  ('estuche', 'lino', 'Funda de lino', 'Funda de algodón y sello de cera. Incluida.', null, 0, 0),
  ('estuche', 'rigido', 'Caja de regalo rígida', 'Caja de fibra reciclada con tarjeta escrita a mano', null, 1000, 1)
) as v(group_code, code, label, description, hex, delta, position)
  on v.group_code = g.code;

-- Cada modelo se ofrece solo en sus tonos (products.tones): el resto se
-- da de baja para que el configurador y el filtro de tono coincidan.
update public.option_values v
set active = false
from public.option_groups g
join public.products p on p.id = g.product_id
where v.group_id = g.id
  and g.code = 'tono'
  and not (v.code = any (p.tones));
