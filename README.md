# filmapi

API para gestionar el contenido del backOffice:

- Catálogo
- Compras
- Pedidos
- Pasarelas de pago

Por ahora la única pasarela de pago implementada es Stripe

## Intalación del proyecto

Disponer de una base de datos mongo en mongo://localhost:27017

- npm install
- npm run dev

## Configuracion de las variables

Las variables de configuración del proyecto se añadrirán en el archivo config en la carpeta config.
En un futuro sería recomendable que las variables privada estuvieran en archivos .env

## Mongoose

Se ha usado un ORM, en este caso mongoose para realizar un modelado de la base de la base de datos.
