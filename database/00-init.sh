#!/bin/bash
# database/00-init.sh
#
# La imagen oficial de PostgreSQL solo ejecuta automáticamente los archivos
# que están DIRECTAMENTE dentro de /docker-entrypoint-initdb.d, ignorando
# cualquier subcarpeta. Como GP-005 y DO-002 definen database/schema/ y
# database/seed/ como subcarpetas, este script actúa como puente: es un
# archivo plano (por eso sí se ejecuta automáticamente) que recorre y
# ejecuta, en orden, todo el contenido de schema/ y luego de seed/.
#
# No requiere cambios en la estructura ya definida en GP-005 / DO-002.

set -e

echo "==> Ejecutando scripts de database/schema/ ..."
for f in /docker-entrypoint-initdb.d/schema/*.sql; do
  if [ -f "$f" ]; then
    echo "    -> $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
  fi
done

echo "==> Ejecutando scripts de database/seed/ ..."
for f in /docker-entrypoint-initdb.d/seed/*.sql; do
  if [ -f "$f" ]; then
    echo "    -> $f"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$f"
  fi
done

echo "==> Inicialización de la base de datos completada."
