# ANOTACIONES PARA DEVS

Dentro de este repositorio encontramos los siguientes proyectos:

- NOMBRE DEL PROYECTO

Los proyectos dentro de este repositorio se pueden ejecutar directamente en el navegador, en caso de que no vea correctamente el proyecto por lo general es solo **cambiar la ruta o rutas presentes en la etiqueta base** dentro del html

### Ejemplo de base:

```
<base href="assets/">
```
La etiqueta base debe llevar la ruta relativa o absoluta de los assets

### URLS para pruebas
http://rutadelproyectodev

### URLS para producción
http://rutadelproyectoprod

## FRONT-END
### Instalación
La parte de interfaces (Estilos) se corre a través de **gulp**, por ende es necesario hacer la instalación de los paquetes establecidos en una terminal con soporte de **npm** por medio del comando:

```
// Verificar que tengamos npm
npm -v
npm install
```
### Uso
Si deseamos hacer cambios en la interface prenderemos nuestra consola, nos ubicaremos en la ruta base del proyecto y usaremos el siguiente comando:

```
gulp
```
