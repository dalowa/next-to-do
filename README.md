# 🚀 Next To Do - Sistema CRUD Avanzado de Gestión de Tareas

**Next To Do** es una aplicación web moderna y profesional para la gestión de tareas, desarrollada con **TypeScript**, **HTML5** y **TailwindCSS**. Presenta un diseño elegante en esquema de colores blanco y negro con efectos glassmorphism y una experiencia de usuario completamente optimizada.

## ✨ Características Principales

### 🔧 **Funcionalidades CRUD Completas**

- ✅ **Crear** tareas con validaciones en tiempo real
- 📋 **Consultar** todas las tareas con visualización moderna
- ✏️ **Editar** tareas existentes con interfaz intuitiva
- 🗑️ **Eliminar** tareas con confirmación de seguridad
- 🔍 **Filtrar** tareas por estado y prioridad

### 🌐 **Integración con APIs**

- 📡 Carga inicial de datos desde JSONPlaceholder (fake API)
- 🔄 Operaciones asíncronas con async/await
- 🎯 Simulación de datos realistas para testing

## 🌐 Visualización con Live Server

### **Opción Recomendada: VS Code Live Server**

1. **Instala Live Server en VS Code**
   - Ve a Extensiones (Ctrl+Shift+X)
   - Busca "Live Server" por Ritwick Dey
   - Haz clic en "Instalar"

2. **Inicia Live Server**
   - Abre `index.html` en VS Code
   - Clic derecho → "Open with Live Server"
   - La aplicación se abrirá automáticamente en tu navegador

## 🎯 Funcionalidades Detalladas

### **Gestión de Tareas**

- **Campos**: ID, Título, Descripción, Fecha Límite, Estado, Prioridad
- **Estados**: 📋 Pendiente, ⚡ En progreso, ✅ Completada
- **Prioridades**: 🔴 Alta, 🟡 Media, 🟢 Baja
- **Validaciones**: Título obligatorio, fecha límite no anterior a hoy

### **Filtros Avanzados**

- Filtrar por estado específico o todos
- Filtrar por prioridad específica o todas
- Combinación de filtros para búsquedas precisas

### **Experiencia de Usuario**

- Tabla responsive con diseño moderno
- Badges coloridos para estados y prioridades
- Botones con iconos para acciones intuitivas
- Mensajes de confirmación para eliminaciones
- Feedback visual al crear tareas

## 🛠️ Tecnologías Utilizadas

- **TypeScript 5.0+**: Tipado estático y programación orientada a objetos
- **TailwindCSS 3.0+**: Framework CSS utilitario para diseño rápido
- **HTML5**: Estructura semántica moderna
- **FontAwesome 6.0**: Iconografía profesional
- **JSONPlaceholder**: API de prueba para simulación de datos
- **ES6+ Modules**: Organización modular del código

## 📝 Notas Importantes

- 💾 **Almacenamiento**: Los datos se mantienen solo en memoria durante la sesión
- 🌐 **APIs**: Requiere conexión a internet para la carga inicial de datos
- 🔧 **Desarrollo**: Usa Live Server para mejor experiencia de desarrollo
