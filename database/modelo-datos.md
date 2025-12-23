# Modelo de Datos - Gestinventa XLSX

## Productos
Hoja: productos

Campos:
- id
- nombre
- categoria
- precio
- stock
- activo
- creado_en

## Movimientos
Hoja: movimientos

Campos:
- id
- producto_id
- tipo (ENTRADA | SALIDA)
- cantidad
- motivo
- fecha
- usuario

## Categorías
Hoja: categorias

Campos:
- id
- nombre
- descripcion
