# Comercializadora de Servicios del Atlántico S.A.S. - Catálogo Empresarial

## 📋 Descripción del Proyecto

Aplicación web desarrollada con **Angular 15+** que implementa un catálogo interactivo de productos y servicios empresariales con autenticación, consumo de APIs REST y manejo avanzado de imágenes. La aplicación incluye un innovador sistema de visualización tipo flipbook y persistencia de datos mediante localStorage.

## 🚀 Características Principales

### ✅ Funcionalidades Implementadas

- **🔐 Autenticación Segura**
  - Sistema de login con Bearer Token y Basic Auth
  - Interceptor HTTP personalizado para manejo de autenticación
  - Guards de ruta para protección de acceso
  - Simulación de credenciales demo

- **🌐 Consumo de APIs REST**
  - Conexión HTTPS a FakeStore API pública
  - Interceptores para manejo de errores y logging
  - Fallback con productos mock para mayor confiabilidad
  - Manejo de respuestas JSON complejas

- **🖼️ Manejo Avanzado de Imágenes**
  - Carga desde URLs externas (Pexels, FakeStore API)
  - Conversión y almacenamiento en formato Base64
  - Persistencia en localStorage para mantener imágenes tras recarga
  - Toggle dinámico entre formatos URL/Base64
  - **Solo usuarios autenticados pueden ver imágenes Base64**

- **📚 Catálogo Interactivo Tipo Flipbook**
  - Implementación nativa con CSS3 y animaciones fluidas
  - Navegación por páginas con efecto 3D realista
  - Controles intuitivos (flechas, puntos de navegación)
  - Contenido dual (frente y reverso de cada página)
  - Responsive design para todos los dispositivos

- **🔍 Funcionalidades de Catálogo**
  - Búsqueda en tiempo real por texto
  - Filtrado por categorías y rango de precios
  - Ordenamiento múltiple (nombre, precio, calificación)
  - Vista de cuadrícula adaptativa (1-4 columnas)
  - Alternancia entre vista cuadrícula y flipbook

- **🎨 Diseño Premium**
  - Angular Material como base del sistema de diseño
  - Gradientes y efectos visuales modernos
  - Animaciones y micro-interacciones
  - Diseño completamente responsive
  - Tema corporativo profesional

## 🛠️ Instalación y Ejecución

### Prerrequisitos
- Node.js 16+ 
- npm o yarn
- Angular CLI 15+

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd angular-catalog-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   npm start
   # o
   ng serve
   ```

4. **Abrir en el navegador:**
   - Navega a `http://localhost:4200`
   - La aplicación se recarga automáticamente al modificar archivos

## 🔑 Credenciales de Demo

Para probar la aplicación, utiliza las siguientes credenciales:

- **Usuario:** `mor_2314`
- **Contraseña:** `83r5^_`

> 💡 **Nota:** También puedes usar el botón "Usar Credenciales Demo" en la pantalla de login.

## 🌐 APIs Utilizadas

### API Principal
- **FakeStore API:** `https://fakestoreapi.com`
  - Endpoints de productos: `/products`
  - Endpoints de categorías: `/products/categories`
  - Endpoint de autenticación: `/auth/login`

### APIs de Imágenes
- **Pexels:** Imágenes de alta calidad para productos mock
- **Placeholder:** Fallback para imágenes no disponibles

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── login/          # Componente de autenticación
│   │   ├── catalog/        # Componente principal del catálogo
│   │   └── flipbook/       # Componente de flipbook interactivo
│   ├── services/           # Servicios de negocio
│   │   ├── auth.service.ts       # Gestión de autenticación
│   │   └── catalog.service.ts    # Gestión del catálogo
│   ├── interceptors/       # Interceptores HTTP
│   │   └── auth.interceptor.ts   # Manejo de autenticación
│   ├── guards/             # Guards de ruta
│   │   └── auth.guard.ts         # Protección de rutas
│   ├── models/             # Interfaces y tipos
│   │   └── interfaces.ts         # Definiciones de tipos
│   └── app.routes.ts       # Configuración de rutas
├── assets/                 # Recursos estáticos
└── global_styles.css       # Estilos globales
```

## 🔧 Configuración de Variables de Entorno

La aplicación utiliza las siguientes configuraciones (hardcodeadas para simplicidad del demo):

- **API_URL:** `https://fakestoreapi.com`
- **STORAGE_KEYS:** Claves para localStorage
  - `auth_token`: Token de autenticación
  - `auth_user`: Datos del usuario
  - `catalog_items`: Productos del catálogo
  - `catalog_images_base64`: Imágenes en Base64

## 📱 Responsive Design

La aplicación está optimizada para múltiples dispositivos:

- **Desktop (>1200px):** 4 columnas, flipbook completo
- **Tablet (768-1200px):** 2-3 columnas, flipbook adaptado
- **Móvil (<768px):** 1 columna, controles táctiles optimizados

## 🔒 Seguridad y Autenticación

### Interceptor de Autenticación
```typescript
// Ejemplo de uso del interceptor
Authorization: Bearer <token>
Content-Type: application/json
X-Requested-With: XMLHttpRequest
```

### Manejo de Errores
- **401:** Redirección automática al login
- **403:** Mensaje de permisos insuficientes
- **500+:** Manejo de errores del servidor
- **0:** Detección de problemas de conectividad

## 📊 Funcionalidades Avanzadas

### Persistencia de Datos
- **localStorage:** Almacenamiento de imágenes Base64
- **sessionStorage:** Cache temporal de datos de sesión
- **Fallback automático:** Productos mock en caso de falla de API

### Optimizaciones
- **Lazy Loading:** Carga de componentes bajo demanda
- **TrackBy:** Optimización de renderizado en listas
- **Interceptores:** Logging y debugging automatizado
- **Error Boundaries:** Manejo graceful de errores

## 🎯 Casos de Uso

1. **Ejecutivo de Ventas:** Presenta catálogo interactivo a clientes
2. **Administrador:** Gestiona productos y visualiza métricas
3. **Cliente:** Explora productos con experiencia inmersiva
4. **Desarrollador:** Referencia de implementación Angular

## 🧪 Testing y Debugging

### Herramientas Incluidas
- **Console Logging:** Tracking detallado de requests HTTP
- **Error Handling:** Manejo robusto de excepciones
- **Network Fallbacks:** Productos mock para testing offline
- **Demo Mode:** Credenciales de prueba preconfiguradas

## 🚀 Despliegue

### Build de Producción
```bash
ng build --configuration=production
```

### Optimizaciones de Producción
- Tree shaking automático
- Minificación de CSS/JS
- Lazy loading de rutas
- Service Worker ready

## 📈 Próximas Mejoras

- [ ] PWA (Progressive Web App)
- [ ] Carrito de compras funcional
- [ ] Integración con APIs de pago
- [ ] Dashboard administrativo
- [ ] Notificaciones push
- [ ] Internacionalización (i18n)

## 🤝 Contribución

Este proyecto fue desarrollado como prueba técnica para **Comercializadora de Servicios del Atlántico S.A.S.** Demuestra competencias en:

- Angular moderno (15+)
- TypeScript avanzado
- Consumo de APIs REST
- Autenticación y seguridad
- UI/UX empresarial
- Responsive design
- Manejo de estado
- Optimización de rendimiento

## 📞 Contacto

**Email:** Jaderdanielmejia18@gmail.com
---

**Desarrollado Por Jader Daniel Mejia Castro**
