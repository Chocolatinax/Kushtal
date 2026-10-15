-- ===========================================================
-- Kushtal — datos de arranque. Generado por scripts/build-seed.py
-- Idempotente: podés correrlo las veces que quieras.
-- ===========================================================

truncate table public.cart_items, public.carts cascade;
delete from public.option_values;
delete from public.option_groups;
delete from public.products;

insert into public.products
  (slug, name, tagline, description, category, base_price_cents, badge,
   capacity_label, leather_label, hero_image, images, tones, texture, featured)
values
  ('bifold-signature-atelier', 'Bifold Signature Atelier', 'Silueta Bifold', 'Seis ranuras biseladas para tarjetas, doble compartimento para divisas y cantos bruñidos a mano. La silueta de la casa: la que define todo lo demás.', 'bifold', 12500,
   'Personalizable', 'Piel vacuna 100%', 'Flor entera europea',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuALK8CDQPvoakiu41oKwHt9MHaUVU3vimlQg2AVKYmu86x2Tn31t-fx7_qcy-paqZ7XdlGkMT2Ehk5hM305kKu8LdbeFoAcB44hPF8YkiU1y4AWnR0s8q4Atf4bPmQ6hGZnETPfqY-aoacltncgR_3NKP-1VBO57dPUbkq1HQLrlrTTRxwuFQGfO3XNYv81Q-ED9lInYtrJeKEhahuWUfEfWkGF-G4M2rcNJR2GvRgRt9AOwxYCzh0',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuALK8CDQPvoakiu41oKwHt9MHaUVU3vimlQg2AVKYmu86x2Tn31t-fx7_qcy-paqZ7XdlGkMT2Ehk5hM305kKu8LdbeFoAcB44hPF8YkiU1y4AWnR0s8q4Atf4bPmQ6hGZnETPfqY-aoacltncgR_3NKP-1VBO57dPUbkq1HQLrlrTTRxwuFQGfO3XNYv81Q-ED9lInYtrJeKEhahuWUfEfWkGF-G4M2rcNJR2GvRgRt9AOwxYCzh0","https://lh3.googleusercontent.com/aida-public/AB6AXuC6I5gxJeDoKa19OI38U1ihfXFMlqsCRI3qUtCoHaL7c3HNpRjD0HtrqbBdC5cGdqMTsbemYqm4Dxv3-BEy0wE46ndLhPh6-AcsGmRev7dPECC4SSXC4soHLxAxwtBzujiQ5qyC30Gei28hBAAViA86uyfqrHzCgDaudCCNT-KgK9TzYYhly0tx559Fidw2zr3nkhGmPsTltZbMLwHpdSzHnzSUXerwd99VnZSkSG2niXdFSWHiDBk","https://lh3.googleusercontent.com/aida-public/AB6AXuBjsmhlcgtDV-F7eoVmxdrbbSxOuYJCBrySXOujyKWfXw45tiaGHotYtOZNvh_I1o7FcRBJdvhxw8w224K712_yTH3T-hTAMWhcDvV6uWkLn5wJRTvR8Ow2TAmEN8g9KQokF8uQEsIez0gxRJjkinq1cRXyBydTiF5SyF-1prjV4srXUBONRUMthOSfjFW_DKKm2U1OplWG4cmegoSxrrMwnEwJVHxy4krDWzSRuqREroJ-DmtoE3Q"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'lisa', true),
  ('tarjetero-atelier-no-01', 'Tarjetero Atelier No. 01', 'Minimal Slim', 'Perfil extraplano de 4 ranuras y bolsillo central para billetes doblados. Ideal para porte frontal sin bulto.', 'tarjetero', 8500,
   'Novedad Atelier', 'Ultra compacto', 'Grosor 5mm',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDm-qy0Rwfv4pnVYn1payGRlyvqy12ghahUM8Ed6NBA0Z3fo1-bmTOF4444i8nwLIup8dYpWt8WP1F-RLdnk-u7ATo7DCSADR9OXbQmqaX68CidRiatg6DeC7_YESugTaVTKsLVDY9EIQji1VlFn2zeY3UIbuaAUlLqopg7Q4OOL8DwT3fYsv3p-FIK-C_w6OyMbrayGJ152PndTtNmCGUIdwWH0RkWrCGESWRKTkYJ97dOMA6ao1o',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDm-qy0Rwfv4pnVYn1payGRlyvqy12ghahUM8Ed6NBA0Z3fo1-bmTOF4444i8nwLIup8dYpWt8WP1F-RLdnk-u7ATo7DCSADR9OXbQmqaX68CidRiatg6DeC7_YESugTaVTKsLVDY9EIQji1VlFn2zeY3UIbuaAUlLqopg7Q4OOL8DwT3fYsv3p-FIK-C_w6OyMbrayGJ152PndTtNmCGUIdwWH0RkWrCGESWRKTkYJ97dOMA6ao1o","https://lh3.googleusercontent.com/aida-public/AB6AXuCqZnqoXp3zE7T1XhGsIWdHvS5f2H3TbqNaQB6eWeJM0xHZwYEbOVl47bTD3OMin-SjgVcReopxA0l1zp9i8HzxizrWdB51vftDOVxUQJdX6pyJIvqcVqy0mL11VcMmdVTH-kTKVuCTNp2swPgB3OBE0ZWuk03Oud4T5dwp4a-s3O9GUcm6jmuFbkmNgOFssSVkSj7IpSqvhwNk8HzLabQR7k4hGRu2db5UOMMH8tR_umN9qbpwE6U"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'lisa', true),
  ('billetera-continental-roma', 'Billetera Continental Roma', 'Larga Continental', 'Elegancia vertical para cheques, pasaporte o billetes enteros. Doce ranuras para credenciales y fuelle con bolsillo monedero interior cerrado.', 'larga', 19500,
   'Personalizable', 'Gran capacidad', '12 ranuras',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDcn6wP7isEHVjnmnMupcnBP8N-UiHNBdPk6ulE8AX3v9aDG3QHxKwu1JIKdptOA5KZ5d1KG8CBpahaPshtyD7azFcXG0YcJu2MXEfxPdFT8XAGzANs8baCLtNfv33lsX8HwGKufE_WLIXC8iNetptw8CdMWt0PMXRh-kv0cCyxzdZ9lITN7Z5IatLx3JBEQ7uEip3-xA3HxB038dWr5YBlA910bCoG2yklb260im8sqwRnaRNhS6E',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDcn6wP7isEHVjnmnMupcnBP8N-UiHNBdPk6ulE8AX3v9aDG3QHxKwu1JIKdptOA5KZ5d1KG8CBpahaPshtyD7azFcXG0YcJu2MXEfxPdFT8XAGzANs8baCLtNfv33lsX8HwGKufE_WLIXC8iNetptw8CdMWt0PMXRh-kv0cCyxzdZ9lITN7Z5IatLx3JBEQ7uEip3-xA3HxB038dWr5YBlA910bCoG2yklb260im8sqwRnaRNhS6E","https://lh3.googleusercontent.com/aida-public/AB6AXuC4q2pKC3V-L-2udch5X9WY9ziT5og8s_7RHrtWhmUWpwokl3Ddl_2ZEsfVBnbWLiCbxW2_8pvf_pqhnbZAZKqEYfOEbBdfuynDd7f8gqUrELreXr71J9x-RrlpcXyzBEGCbgl07xvLjDr01dF-zxQTTCW6_txNlmK5mNTjche9H4BZmeXzSnZBmZ1VJ4vj5Mz72wzKaPcWCufpBgQTlebQgOMlrpXRDiuRMCx5g9G08UwkhzqGy-g"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'grano', true),
  ('portadocumentos-postal', 'Portadocumentos Postal', 'Viaje & Pasaporte', 'Diseñado para resguardar pasaportes, billetes de embarque y divisas internacionales en una silueta de viaje que no se deforma.', 'larga', 14000,
   'Edición Viajero', 'Edición viajero', 'Fuelle reforzado',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCulqdAYbP82ZCY8QGs8xlExlmu4gPkCPCgNzRGFW6yCXtqGYgO5Zn5dDYu5jK84Nd-DRNs5STHSs1p6OwV215f0mF_bcZFZgAqTTteKFGwK5quauV3jj7TruQNYD-zXKvpVfKFxi4nsT7MPv6odzLaF7HyPHrIYoqijA9G-mVsCMg9ughxYixvHpmYB3sQV11v3SV7dDVQV2xl74650nvebfJB8SsHs0rjPusaOYb9qbPuxtPMzdc',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuCulqdAYbP82ZCY8QGs8xlExlmu4gPkCPCgNzRGFW6yCXtqGYgO5Zn5dDYu5jK84Nd-DRNs5STHSs1p6OwV215f0mF_bcZFZgAqTTteKFGwK5quauV3jj7TruQNYD-zXKvpVfKFxi4nsT7MPv6odzLaF7HyPHrIYoqijA9G-mVsCMg9ughxYixvHpmYB3sQV11v3SV7dDVQV2xl74650nvebfJB8SsHs0rjPusaOYb9qbPuxtPMzdc","https://lh3.googleusercontent.com/aida-public/AB6AXuDDv66pTDls-6bbvEbHMeeJ7fVNNECo_-kE_4Qg-fAzDNHnWH8RPfY0zSf_EiUuqkk6h1n5jWeE4oI84swqY_JjutMl8iKLmGJ3fmk1E3vj-lazWbt_Vg5K0KG9mvbT0HfJDW7PJJNzm6NIGqeVmAH27zd-JsLMRC2nd_F30VQBLonMCwM60Wk8XK3usqmw5yh-1LoXDgnmtMvcYe-KtmVjHWN36hB_ltHhVMloapnjYjt5YPSLbXQ"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'grano', false),
  ('tarjetero-plegable-slim', 'Tarjetero Plegable Slim', 'Plegable Minimal', 'Doble solapa magnética suave con capacidad de hasta 8 tarjetas y recibos esenciales sin deformar el perfil.', 'tarjetero', 9500,
   'Novedad', 'Doble pestaña', 'Cierre magnético',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBbHw2_VeiqxrIGGrdJdyxayaICxhxKCnjtci_FyINajzAMuN-iXez3JBSNXJVKqLAgbxGEtsBX5zW4ZbxuEC4b_x8x9if_8G1gSkC5-6gw9rPitiAixL8KawEjHbwTWV2tEcirGn6hJvCjNBbiejp_Ky3Y8QGuXYiQ2PZ-ETuS1o4ju2ek9gld7TekP67vkrxrlwTfR205Ce7jn8ssvD9FkZLdCPH8UellDIDK97vU0QC8OTsPYlM',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuBbHw2_VeiqxrIGGrdJdyxayaICxhxKCnjtci_FyINajzAMuN-iXez3JBSNXJVKqLAgbxGEtsBX5zW4ZbxuEC4b_x8x9if_8G1gSkC5-6gw9rPitiAixL8KawEjHbwTWV2tEcirGn6hJvCjNBbiejp_Ky3Y8QGuXYiQ2PZ-ETuS1o4ju2ek9gld7TekP67vkrxrlwTfR205Ce7jn8ssvD9FkZLdCPH8UellDIDK97vU0QC8OTsPYlM","https://lh3.googleusercontent.com/aida-public/AB6AXuAyciwEzRlJcvPJeKynwmqOfuJ5VT9n0fUu-fgZk9FsSYpEfihXWfUnUi42LUZOBhuU4MNKMAjRJns8xj5U2PLU6M_VHbyxmrH8NRUcBKx9ZCtkgKiGStPLSB7wuEsQXRRplTikp8odKFCftydBCVdwiSUHiB3V_-ZcVp7qfy5FGMM6QsHN7YRTbUSkYP_FDio1gWLkv8wsDhN9_ysBlI6DaCkQkf45_moQw-0Tq8YDaN1TJSuewUg"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'lisa', false),
  ('billetera-zip-accordion', 'Billetera Zip Accordion', 'Cierre Seguro', 'Apertura de abanico a 180° con cinco divisiones para tarjetas, monedas y efectivo, asegurada con cremallera de bronce macizo.', 'cremallera', 13000,
   'Personalizable', 'Cremallera bronce', '5 divisiones',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDKNMnDNVuN9gMwAqpTdqsFZCM7T7FgwqdD2Ctj0Jxr8KIVUC3hA1zInT2y6SKljypgjcThKt6vQfG-RUt1ngr431aUcbyKrt0cMxARTGggp8xgvOqcXDyWLh7sD9Wt4gFFtK0DSg1xR8wn4IpsRk-jlGesAM92Iezn1XRmDbet-wnSxGRKg3JKL4XI7hKjlhlTV8XjRdy_w3Tw2KT66I40ijHaHgaZ04ljl-r0t-2vGzxAnVKIitw',
   '{"https://lh3.googleusercontent.com/aida-public/AB6AXuDKNMnDNVuN9gMwAqpTdqsFZCM7T7FgwqdD2Ctj0Jxr8KIVUC3hA1zInT2y6SKljypgjcThKt6vQfG-RUt1ngr431aUcbyKrt0cMxARTGggp8xgvOqcXDyWLh7sD9Wt4gFFtK0DSg1xR8wn4IpsRk-jlGesAM92Iezn1XRmDbet-wnSxGRKg3JKL4XI7hKjlhlTV8XjRdy_w3Tw2KT66I40ijHaHgaZ04ljl-r0t-2vGzxAnVKIitw","https://lh3.googleusercontent.com/aida-public/AB6AXuC4q2pKC3V-L-2udch5X9WY9ziT5og8s_7RHrtWhmUWpwokl3Ddl_2ZEsfVBnbWLiCbxW2_8pvf_pqhnbZAZKqEYfOEbBdfuynDd7f8gqUrELreXr71J9x-RrlpcXyzBEGCbgl07xvLjDr01dF-zxQTTCW6_txNlmK5mNTjche9H4BZmeXzSnZBmZ1VJ4vj5Mz72wzKaPcWCufpBgQTlebQgOMlrpXRDiuRMCx5g9G08UwkhzqGy-g"}',
   '{"caramelo","chocolate","azabache","indigo","salvia"}', 'grano', false);

-- Los 7 grupos son iguales para toda la colección: cross join.
insert into public.option_groups
  (product_id, code, label, helper, type, required, max_length,
   price_delta_cents, position)
select p.id, g.code, g.label, g.helper, g.type, g.required, g.max_length, 0, g.position
from public.products p
cross join (values
  ('tono', 'Tono de la piel', 'Cada tono nace de un pigmento distinto y envejece a su ritmo.', 'color', true, null::int, 0),
  ('textura', 'Textura y curtido', 'El acabado define el tacto y la velocidad de la pátina.', 'select', true, null::int, 1),
  ('hilo', 'Hilo del pespunte', 'Costura a dos agujas con lino japonés encerado.', 'color', true, null::int, 2),
  ('canto', 'Acabado de cantos', 'El borde es lo primero que se gasta. Elegí cómo se protege.', 'select', true, null::int, 3),
  ('grabado', 'Monograma', 'Hasta 12 caracteres. El grabado va incluido en tu pieza.', 'engraving', false, 12::int, 4),
  ('grabado_acabado', 'Acabado del grabado', 'Cómo queda marcado el monograma sobre la piel.', 'select', false, null::int, 5),
  ('estuche', 'Ritual de entrega', 'Cómo llega la pieza a sus manos.', 'select', true, null::int, 6)
) as g(code, label, helper, type, required, max_length, position);

-- Los valores cuelgan de cada grupo por su code.
insert into public.option_values
  (group_id, code, label, description, hex, price_delta_cents, position)
select g.id, v.code, v.label, v.description, v.hex, v.delta, v.position
from public.option_groups g
join (values
  ('tono', 'caramelo', 'Caramelo Tostado', 'Curtido toscano tradicional', '#A9672F', 0, 0),
  ('tono', 'chocolate', 'Marrón Chocolate', 'Profundo y aterciopelado en caliente', '#3B2318', 0, 1),
  ('tono', 'azabache', 'Negro Azabache', 'Acabado pulido mate, sobriedad arquitectónica', '#17161A', 1000, 2),
  ('tono', 'indigo', 'Azul Ceniza Índigo', 'Mate añil sobrio y sereno', '#1E2B4F', 1500, 3),
  ('tono', 'salvia', 'Verde Salvia', 'Tinte botánico de baja saturación', '#77876B', 2000, 4),
  ('textura', 'vacuna-lisa', 'Vacuna Lisa', 'Flor entera pulida, calibre 1.2mm', null, 0, 0),
  ('textura', 'grano-natural', 'Grano Natural', 'Calibre 1.4mm, textura mantecosa con pátina dorada rápida', null, 1500, 1),
  ('textura', 'toscana', 'Pátina Toscana', 'Curtido vegetal de barrica, envejece con la luz', null, 2500, 2),
  ('textura', 'palmellato', 'Palmellato Exótico', 'Grano martillado a mano en tambor lento', null, 4000, 3),
  ('hilo', 'crudo', 'Lino Crudo', 'Hilo de lino encerado sin teñir', '#D9CCB4', 0, 0),
  ('hilo', 'tono-sobre-tono', 'Tono sobre Tono', 'Desaparece en la piel, costura silenciosa', '#8A7A68', 0, 1),
  ('hilo', 'contraste-cafe', 'Contraste Café', 'Pespunte visible en café tostado', '#8A5A3B', 500, 2),
  ('hilo', 'oro-viejo', 'Oro Viejo', 'Hilo metalizado de seda y latón', '#B8914B', 900, 3),
  ('canto', 'brunido', 'Bruñido a Cera', 'Canto sellado con cera virgen de abeja', null, 0, 0),
  ('canto', 'pintado', 'Pintado a Mano', 'Siete capas de pintura francesa lijadas entre sí', null, 1200, 1),
  ('grabado_acabado', 'golpe-seco', 'Golpe Seco', 'Hierro caliente sin pigmento. Incluido en tu pieza.', null, 0, 0),
  ('grabado_acabado', 'foil-oro', 'Lámina de Oro 22k', 'Foil de oro aplicado a 180°C', null, 1800, 1),
  ('estuche', 'lino', 'Estuche de Lino', 'Funda de algodón orgánico y sello de cera. Incluido.', null, 0, 0),
  ('estuche', 'rigido', 'Caja Rígida de Fibra', 'Caja de fibra reciclada con bálsamo de cera', null, 2500, 1)
) as v(group_code, code, label, description, hex, delta, position)
  on v.group_code = g.code;
