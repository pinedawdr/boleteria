'use client'

import { useEffect, useRef } from 'react'

/**
 * Componente para prevenir saltos de layout y fondos azules durante logout
 */
export const LogoutStabilizer = () => {
  const isStabilizing = useRef(false)

  useEffect(() => {
    const handleAuthStateChange = () => {
      if (isStabilizing.current) return
      
      isStabilizing.current = true
      
      // Agregar clase temporal para estabilizar layout
      document.body.classList.add('auth-changing')
      document.documentElement.classList.add('auth-changing')
      
      // Forzar estilos estables inmediatamente
      const style = document.createElement('style')
      style.id = 'logout-stabilizer'
      style.textContent = `
        * {
          transition: none !important;
          animation: none !important;
          transform: none !important;
        }
        body, html {
          background: #0E0E0F !important;
          background-image: none !important;
        }
        footer {
          background: #000000 !important;
          position: relative !important;
          z-index: 10 !important;
        }
        #anti-flash-overlay {
          background: #0E0E0F !important;
          background-image: none !important;
        }
      `
      document.head.appendChild(style)
      
      // Limpiar después de la transición
      setTimeout(() => {
        document.body.classList.remove('auth-changing')
        document.documentElement.classList.remove('auth-changing')
        
        const stabilizer = document.getElementById('logout-stabilizer')
        if (stabilizer) {
          stabilizer.remove()
        }
        
        isStabilizing.current = false
      }, 500)
    }

    // Detectar cambios en localStorage (logout)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'supabase.auth.token' || e.key?.includes('supabase')) {
        handleAuthStateChange()
      }
    }

    // Detectar navegación (que puede indicar logout)
    const handleBeforeUnload = () => {
      handleAuthStateChange()
    }

    // Detectar cambios en el DOM que puedan indicar cambios de auth
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes)
          const removedNodes = Array.from(mutation.removedNodes)
          
          // Si se detectan cambios relacionados con auth
          if (addedNodes.some(node => 
            node.textContent?.includes('login') || 
            node.textContent?.includes('logout') ||
            (node as Element)?.classList?.contains('auth')
          ) || removedNodes.some(node =>
            node.textContent?.includes('dashboard') ||
            (node as Element)?.classList?.contains('admin')
          )) {
            handleAuthStateChange()
          }
        }
      })
    })

    // Observar cambios en el body
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    })

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      const stabilizer = document.getElementById('logout-stabilizer')
      if (stabilizer) {
        stabilizer.remove()
      }
    }
  }, [])

  return null
}
