'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCacheStats, clearAllCache } from '@/hooks/useCache'
import { useIsMounted } from '@/components/NoSSR'
import { 
  Activity, 
  Database, 
  Clock, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react'

interface PerformanceStats {
  cacheStats: {
    totalEntries: number
    activeEntries: number
    expiredEntries: number
  }
  loadTimes: {
    landing: number
    dashboard: number
    analytics: number
    reports: number
  }
  apiCalls: {
    total: number
    successful: number
    failed: number
  }
  memoryUsage: {
    used: number
    total: number
  }
}

const PerformanceMonitor: React.FC = () => {
  const isMounted = useIsMounted()
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const updateStats = () => {
    const cacheStats = getCacheStats()
    
    // Simular otros stats (en producción estos vendrían de métricas reales)
    const mockStats: PerformanceStats = {
      cacheStats,
      loadTimes: {
        landing: Math.random() * 1000 + 500,
        dashboard: Math.random() * 1500 + 800,
        analytics: Math.random() * 2000 + 1000,
        reports: Math.random() * 1800 + 900
      },
      apiCalls: {
        total: Math.floor(Math.random() * 100) + 50,
        successful: Math.floor(Math.random() * 90) + 45,
        failed: Math.floor(Math.random() * 10) + 2
      },
      memoryUsage: {
        used: Math.random() * 50 + 20,
        total: 100
      }
    }
    
    setStats(mockStats)
  }

  useEffect(() => {
    if (isVisible) {
      updateStats()
      const interval = setInterval(updateStats, 5000) // Update every 5 seconds
      setRefreshInterval(interval)
      
      return () => {
        if (interval) clearInterval(interval)
      }
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    }
  }, [isVisible, refreshInterval])

  // Solo mostrar en desarrollo y después de que se monte el componente
  if (process.env.NODE_ENV !== 'development' || !isMounted) {
    return null
  }

  const formatTime = (ms: number) => {
    return `${ms.toFixed(0)}ms`
  }

  const handleClearCache = () => {
    clearAllCache()
    updateStats()
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent/90 transition-colors"
        onClick={() => setIsVisible(!isVisible)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Activity className="w-5 h-5" />
      </motion.button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-border-color p-4 w-80 max-h-screen overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Performance Monitor
              </h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                ✕
              </button>
            </div>

            {stats && (
              <div className="space-y-4">
                {/* Cache Stats */}
                <div className="bg-body-bg rounded-lg p-3">
                  <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-info" />
                    Cache Status
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total Entries:</span>
                      <span className="text-text-primary font-medium">{stats.cacheStats.totalEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Active:</span>
                      <span className="text-success font-medium">{stats.cacheStats.activeEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Expired:</span>
                      <span className="text-warning font-medium">{stats.cacheStats.expiredEntries}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    className="mt-2 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear Cache
                  </button>
                </div>

                {/* Load Times */}
                <div className="bg-body-bg rounded-lg p-3">
                  <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    Load Times
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Landing:</span>
                      <span className="text-text-primary font-medium">{formatTime(stats.loadTimes.landing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Dashboard:</span>
                      <span className="text-text-primary font-medium">{formatTime(stats.loadTimes.dashboard)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Analytics:</span>
                      <span className="text-text-primary font-medium">{formatTime(stats.loadTimes.analytics)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Reports:</span>
                      <span className="text-text-primary font-medium">{formatTime(stats.loadTimes.reports)}</span>
                    </div>
                  </div>
                </div>

                {/* API Calls */}
                <div className="bg-body-bg rounded-lg p-3">
                  <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4 text-accent" />
                    API Calls
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total:</span>
                      <span className="text-text-primary font-medium">{stats.apiCalls.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Successful:</span>
                      <span className="text-success font-medium">{stats.apiCalls.successful}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Failed:</span>
                      <span className="text-error font-medium">{stats.apiCalls.failed}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Success Rate:</span>
                        <span>{((stats.apiCalls.successful / stats.apiCalls.total) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-hover-bg rounded-full h-2">
                        <div 
                          className="bg-success h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(stats.apiCalls.successful / stats.apiCalls.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Memory Usage */}
                <div className="bg-body-bg rounded-lg p-3">
                  <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-500" />
                    Memory Usage
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Used:</span>
                      <span className="text-text-primary font-medium">{stats.memoryUsage.used.toFixed(1)} MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Total:</span>
                      <span className="text-text-primary font-medium">{stats.memoryUsage.total} MB</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Usage:</span>
                        <span>{((stats.memoryUsage.used / stats.memoryUsage.total) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-hover-bg rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            (stats.memoryUsage.used / stats.memoryUsage.total) > 0.8 ? 'bg-error' :
                            (stats.memoryUsage.used / stats.memoryUsage.total) > 0.6 ? 'bg-warning' :
                            'bg-success'
                          }`}
                          style={{ width: `${(stats.memoryUsage.used / stats.memoryUsage.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={updateStats}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Stats
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PerformanceMonitor
