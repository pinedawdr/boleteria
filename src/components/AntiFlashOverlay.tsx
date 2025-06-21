'use client'

import { useEffect } from 'react'

export const AntiFlashOverlay = () => {
  useEffect(() => {
    // Crear un overlay de fondo que prevenga cualquier flash blanco
    const overlay = document.createElement('div')
    overlay.id = 'anti-flash-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #0E0E0F;
      z-index: -999;
      pointer-events: none;
    `
    
    // Añadir al comienzo del body
    document.body.insertBefore(overlay, document.body.firstChild)
    
    // Cleanup
    return () => {
      const existingOverlay = document.getElementById('anti-flash-overlay')
      if (existingOverlay) {
        existingOverlay.remove()
      }
    }
  }, [])

  return null
}
