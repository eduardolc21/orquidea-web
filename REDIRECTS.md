# Redirecciones de URL antiguas

La web antigua (orquideaperu.com) tenía una página por sección. En el sitio nuevo todo vive en la one page, así que cada URL antigua apunta a un **ancla** de `index.html`. La tienda lee el ancla y aplica el filtro de categoría (`js/catalog.js`).

| URL antigua | Destino nuevo | Qué pasa |
|---|---|---|
| `/nuestra-historia/` | `/#nuestra-historia` | Baja a «Cacao en lugar de coca» |
| `/tabletas-organicas/` | `/#tienda-tabletas-organicas` | Tienda filtrada por Tabletas orgánicas |
| `/tabletas-clasicas/` | `/#tienda-tabletas-clasicas` | Tienda filtrada por Tabletas clásicas |
| `/otros-productos/` | `/#tienda-chocotejas-y-mas` | Tienda filtrada por Chocotejas y más |
| `/coberturas/` | `/#tienda-coberturas` | Tienda filtrada por Coberturas |
| `/contactanos/` | `/#contacto` | Baja al pie con los datos de contacto |

Las anclas cortas (`/#tabletas-organicas`, `/#coberturas`, `/#otros-productos`, `/#contactanos`) también existen en el HTML por si alguien las enlazó.

## Apache (`.htaccess`)

```apache
RedirectMatch 301 ^/nuestra-historia/?$   /#nuestra-historia
RedirectMatch 301 ^/tabletas-organicas/?$ /#tienda-tabletas-organicas
RedirectMatch 301 ^/tabletas-clasicas/?$  /#tienda-tabletas-clasicas
RedirectMatch 301 ^/otros-productos/?$    /#tienda-chocotejas-y-mas
RedirectMatch 301 ^/coberturas/?$         /#tienda-coberturas
RedirectMatch 301 ^/contactanos/?$        /#contacto
```

## Nginx

```nginx
location ~ ^/nuestra-historia/?$   { return 301 /#nuestra-historia; }
location ~ ^/tabletas-organicas/?$ { return 301 /#tienda-tabletas-organicas; }
location ~ ^/tabletas-clasicas/?$  { return 301 /#tienda-tabletas-clasicas; }
location ~ ^/otros-productos/?$    { return 301 /#tienda-chocotejas-y-mas; }
location ~ ^/coberturas/?$         { return 301 /#tienda-coberturas; }
location ~ ^/contactanos/?$        { return 301 /#contacto; }
```

## Al migrar a WordPress

Con WooCommerce las categorías tendrán URL propia (`/categoria-producto/tabletas-organicas/`). En ese momento conviene que las URL antiguas apunten a esas páginas de categoría y no a las anclas. Hazlo con el plugin **Redirection** (301) o con las mismas reglas de servidor, pero apuntando al nuevo destino.
