# config.example.py
# Copiar este archivo como config.py y completar con los valores reales.
# config.py NO debe subirse al repositorio.
#
# Cada variable primero intenta leerse de una variable de entorno del
# sistema (asi funciona en Render u otra plataforma de despliegue); si
# no existe esa variable de entorno, usa el valor de respaldo escrito
# aqui abajo (asi sigue funcionando igual que antes en Docker local).
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "dbname=riwi_connect user=postgres password=postgres host=db")
SECRET_KEY = os.environ.get("SECRET_KEY", "replace_with_a_random_secret_key")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "replace_with_your_gemini_api_key")
