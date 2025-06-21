/**
 * 🎨 SISTEMA ÚNICO DE BOTÓN GLOBAL - SÚPER SIMPLE
 * 
 * Para cambiar el estilo de TODOS los botones del proyecto:
 * 1. Modifica solo la variable GLOBAL_BUTTON_STYLE
 * 2. Todos los botones se actualizarán automáticamente
 */

// 🚀 ESTILO ÚNICO GLOBAL - MODIFICAR AQUÍ PARA CAMBIAR TODOS LOS BOTONES
export const GLOBAL_BUTTON_STYLE = "text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 inline-flex items-center justify-center";

// Variaciones de tamaño (opcional)
export const BUTTON_SIZES = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-2.5 text-sm", // Por defecto
  lg: "px-6 py-3 text-base",
} as const;

// 🎨 EJEMPLOS DE OTROS ESTILOS (comentados):
// Blue: "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 inline-flex items-center justify-center"
// Green: "text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 inline-flex items-center justify-center"
