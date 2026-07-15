import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  pathnames: {
    '/': '/',
    '/la-organizacion': '/la-organizacion',
    '/opciones': '/opciones',
    '/alternativas': '/alternativas',
    '/soporte': '/soporte',
    '/carrito': '/carrito',
    '/finalizar-compra': '/finalizar-compra',
    '/compra-exitosa': '/compra-exitosa',
    '/producto/[slug]': '/producto/[slug]',
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);