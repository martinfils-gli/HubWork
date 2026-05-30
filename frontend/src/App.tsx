import React, { useState, useCallback, useMemo } from 'react'
import {
  Activity,
  Database,
  Cpu,
  Settings,
  RefreshCcw,
  PlusCircle,
  Search,
  History as HistoryIcon,
  HardDrive,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { LRUCache } from './lib/lru-cache'
import { cn } from './lib/utils'

interface LogEntry {
  id: string
  timestamp: string
  operation: 'put' | 'get'
  key: string
  value?: string
  result?: string | null
  status: 'success' | 'miss' | 'info'
}

function App() {
  const [capacity] = useState(5)
  const [lru] = useState(() => new LRUCache<string, string>(capacity))
  const [entries, setEntries] = useState<{ key: string; value: string }[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState({ hits: 0, misses: 0 })

  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [searchKey, setSearchKey] = useState('')

  const updateCacheState = useCallback(() => {
    setEntries(lru.getEntries())
  }, [lru])

  const addLog = useCallback((op: 'put' | 'get', key: string, status: 'success' | 'miss' | 'info', value?: string, result?: string | null) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      operation: op,
      key,
      value,
      result,
      status
    }
    setLogs(prev => [newLog, ...prev].slice(0, 10))
  }, [])

  const handlePut = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newKey || !newValue) return

    lru.put(newKey, newValue)
    addLog('put', newKey, 'success', newValue)
    updateCacheState()
    setNewKey('')
    setNewValue('')
  }

  const handleGet = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchKey) return

    const result = lru.get(searchKey)
    if (result !== null) {
      setStats(prev => ({ ...prev, hits: prev.hits + 1 }))
      addLog('get', searchKey, 'success', undefined, result)
    } else {
      setStats(prev => ({ ...prev, misses: prev.misses + 1 }))
      addLog('get', searchKey, 'miss', undefined, 'Not Found')
    }
    updateCacheState()
    setSearchKey('')
  }

  const hitRate = useMemo(() => {
    const total = stats.hits + stats.misses
    return total === 0 ? 0 : Math.round((stats.hits / total) * 100)
  }, [stats])

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              HubWork Executive
            </h1>
            <p className="text-gray-400 flex items-center gap-2 mt-1">
              <Cpu className="w-4 h-4" /> Embedded System Controller • <span className="text-green-500 font-medium">Online</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors font-medium">
              <RefreshCcw className="w-4 h-4" /> Sync System
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Cache Hits', value: stats.hits, icon: CheckCircle2, color: 'text-green-400' },
            { label: 'Cache Misses', value: stats.misses, icon: AlertCircle, color: 'text-red-400' },
            { label: 'Hit Rate', value: `${hitRate}%`, icon: Activity, color: 'text-blue-400' },
            { label: 'Utilization', value: `${entries.length} / ${capacity}`, icon: HardDrive, color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-lg bg-white/5", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Controls & Logs */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Forms */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-400" /> Put Operation
                </h2>
                <form onSubmit={handlePut} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors">
                    Store Data
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-400" /> Get Operation
                </h2>
                <form onSubmit={handleGet} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Search Key"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors">
                    Find
                  </button>
                </form>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <HistoryIcon className="w-5 h-5 text-gray-400" /> Recent Operations
              </h2>
              <div className="space-y-3">
                {logs.length === 0 && <p className="text-sm text-gray-500 italic">No operations recorded yet.</p>}
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between text-sm p-2 rounded bg-white/5 border border-white/5">
                    <div>
                      <span className={cn(
                        "font-bold uppercase text-[10px] px-1.5 py-0.5 rounded mr-2",
                        log.operation === 'put' ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                      )}>
                        {log.operation}
                      </span>
                      <span className="font-mono text-gray-300">{log.key}</span>
                      {log.result && <span className="text-gray-500 ml-2">→ {log.result}</span>}
                    </div>
                    <span className="text-gray-500 text-xs">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cache Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Database className="w-6 h-6 text-purple-400" /> Cache Visualization
                </h2>
                <div className="text-sm text-gray-400">
                  <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></span> MRU
                  <span className="inline-block w-3 h-3 bg-gray-600 rounded-full ml-4 mr-1"></span> LRU
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-4 flex-wrap">
                {entries.length === 0 ? (
                  <div className="text-center space-y-2 opacity-40">
                    <Database className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-xl font-medium">Cache is Empty</p>
                    <p>Perform a 'Put' operation to start</p>
                  </div>
                ) : (
                  entries.map((entry, i) => (
                    <div
                      key={entry.key}
                      className={cn(
                        "relative group w-40 h-40 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center items-center gap-2 transition-all duration-500 animate-in fade-in zoom-in",
                        i === 0 ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]" : "",
                        i === entries.length - 1 ? "opacity-60" : ""
                      )}
                    >
                      {i === 0 && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Most Recent
                        </div>
                      )}
                      {i === entries.length - 1 && i !== 0 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Next to Evict
                        </div>
                      )}

                      <div className="text-xs text-gray-500 font-mono uppercase">Key</div>
                      <div className="text-2xl font-bold font-mono text-purple-400 truncate w-full text-center">{entry.key}</div>
                      <div className="w-full h-px bg-white/10 my-1"></div>
                      <div className="text-xs text-gray-500 font-mono uppercase">Value</div>
                      <div className="text-sm font-medium text-gray-300 truncate w-full text-center">{entry.value}</div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-gray-500 border-t border-white/5 pt-6">
                <p>Nodes are automatically evicted when capacity ({capacity}) is exceeded.</p>
                <p className="text-right">Synchronized with HubWork Embedded Hardware v1.0.4</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App
