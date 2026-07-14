-- Seed de la base de conocimiento (11 datos definitivos del negocio)
-- Idempotente: limpia la tabla antes de insertar.

TRUNCATE knowledge_base RESTART IDENTITY;

INSERT INTO knowledge_base (category, fact) VALUES
  ('productos',
   'Categorías de producto: ropa (0-24 meses), cochecitos, cunas, sillas para auto, pañales, juguetes didácticos y artículos de lactancia.'),
  ('precios',
   'Rango de precios: ropa desde $8, cochecitos desde $120, cunas desde $150, sillas para auto desde $90, y pañales por paquete desde $12.'),
  ('atencion',
   'Horario de atención al cliente (chat/WhatsApp): lunes a sábado, de 9:00 a 19:00.'),
  ('general',
   'Canal de venta: 100% online, con envíos a domicilio. No hay tienda física.'),
  ('envios',
   'Envíos: 2 a 4 días hábiles a nivel nacional. Costo fijo de $5, y gratis en compras mayores a $60.'),
  ('politicas',
   'Política de cambios y devoluciones: hasta 30 días desde la compra, con el producto sin uso y con su etiqueta o empaque original.'),
  ('seguridad',
   'Certificaciones de seguridad: los cochecitos cumplen la norma ASTM F833, las cunas la ASTM F1169 y las sillas para auto la FMVSS 213.'),
  ('pagos',
   'Medios de pago aceptados: tarjeta de crédito o débito, y pago contra entrega en ciudades seleccionadas.'),
  ('servicios',
   'Lista de bebé / registro de regalos: disponible. Permite a familiares y amigos comprar productos de una lista creada por los padres.'),
  ('garantia',
   'Garantía: 6 meses en cochecitos, cunas y sillas para auto por defectos de fábrica.'),
  ('servicios',
   'Atención post-venta: soporte por chat para resolver dudas de armado o uso de los productos.');
