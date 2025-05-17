// File: frontend/components/VMManager.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function VMManager() {
  // -- state for disks and VMs --
  const [disks, setDisks] = useState([])
  const [vms, setVMs]     = useState([])

  // -- state for VM creation form --
  const [cpu, setCPU]           = useState(2)
  const [ram, setRAM]           = useState(2048)
  const [diskPath, setDiskPath] = useState('')
  const [isoPath, setISOPath]   = useState('')
  const [enableNet, setEnableNet] = useState(true)
  const [snapshot, setSnapshot]   = useState(false)

  // -- state for ISO browser modal --
  const [isBrowsingISO, setIsBrowsingISO]   = useState(false)
  const [browseISOPath, setBrowseISOPath]   = useState('/')
  const [browseISOItems, setBrowseISOItems] = useState([])

  // Fetch available disks
  const fetchDisks = async () => {
    try {
      const res = await axios.get('/api/disks')
      setDisks(res.data.disks)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch running VMs
  const fetchVMs = async () => {
    try {
      const res = await axios.get('/api/vms')
      setVMs(res.data.vms)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch directory listing for ISO browser
  const fetchBrowseISO = async (path) => {
    try {
      const res = await axios.get('/api/browse', { params: { path } })
      setBrowseISOPath(res.data.current)
      setBrowseISOItems(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  // Initialize
  useEffect(() => {
    fetchDisks()
    fetchVMs()
  }, [])

  // When disks list arrives, pick the first by default
  useEffect(() => {
    if (disks.length > 0 && !diskPath) {
      setDiskPath(disks[0].path)
    }
  }, [disks])

  // When ISO browser is opened or path changes, load that folder
  useEffect(() => {
    if (isBrowsingISO) {
      fetchBrowseISO(browseISOPath)
    }
  }, [isBrowsingISO, browseISOPath])

  // Launch a new VM
  const handleLaunch = async () => {
    try {
      await axios.post('/api/vms', {
        cpu_cores: cpu,
        memory_mb: ram,
        disk_path: diskPath,
        iso_path: isoPath || undefined,
        enable_network: enableNet,
        snapshot: snapshot
      })
      setISOPath('')
      fetchVMs()
    } catch (err) {
      console.error(err)
      alert('Error launching VM: ' + (err.response?.data?.detail || err.message))
    }
  }

  // Stop a VM by PID
  const handleStop = async (pid) => {
    try {
      await axios.delete('/api/vms', { params: { pid } })
      fetchVMs()
    } catch (err) {
      console.error(err)
      alert('Error stopping VM: ' + (err.response?.data?.detail || err.message))
    }
  }

  return (
    <div className="space-y-6">
      {/* Launch VM */}
      <div className="card">
        <h2>Launch Virtual Machine</h2>
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">CPU Cores</label>
            <input
              type="number"
              min={1}
              max={16}
              value={cpu}
              onChange={e => setCPU(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Memory (MB)</label>
            <input
              type="number"
              min={256}
              value={ram}
              onChange={e => setRAM(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Disk</label>
            <select
              value={diskPath}
              onChange={e => setDiskPath(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {disks.map(d => (
                <option key={d.path} value={d.path}>
                  {d.path}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">ISO Image</label>
            <div className="flex">
              <input
                type="text"
                placeholder="e.g. /path/to/installer.iso"
                value={isoPath}
                readOnly
                className="flex-1 border rounded-l px-3 py-2 bg-gray-100"
              />
              <button
                onClick={() => setIsBrowsingISO(true)}
                className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark"
              >
                Browse…
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={enableNet}
                onChange={e => setEnableNet(e.target.checked)}
                className="form-checkbox"
              />{' '}
              Enable Network
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={snapshot}
                onChange={e => setSnapshot(e.target.checked)}
                className="form-checkbox"
              />{' '}
              Use Snapshot
            </label>
          </div>
          <button
            onClick={handleLaunch}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Launch VM
          </button>
        </div>
      </div>

      {/* ISO Browser Modal */}
      {isBrowsingISO && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-3/4 max-h-3/4 overflow-auto p-6">
            <h3 className="text-lg font-semibold mb-4">
              Browse for ISO: {browseISOPath}
            </h3>
            <div className="mb-4">
              <button
                disabled={browseISOPath === '/'}
                onClick={() => {
                  const up = browseISOPath.split('/').slice(0, -1).join('/')
                  setBrowseISOPath(up === '' ? '/' : up)
                }}
                className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Up
              </button>
              <button
                onClick={() => fetchBrowseISO(browseISOPath)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
            <ul>
              {browseISOItems.map(item => (
                <li key={item.name} className="mb-1">
                  {item.is_dir ? (
                    <button
                      onClick={() =>
                        setBrowseISOPath(prev =>
                          prev === '/'
                            ? `/${item.name}`
                            : `${prev}/${item.name}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      📁 {item.name}
                    </button>
                  ) : item.name.toLowerCase().endsWith('.iso') ? (
                    <button
                      onClick={() => {
                        setISOPath(`${browseISOPath}/${item.name}`)
                        setIsBrowsingISO(false)
                      }}
                      className="text-green-600 hover:underline"
                    >
                      📄 {item.name}
                    </button>
                  ) : (
                    <span className="text-gray-500">📄 {item.name}</span>
                  )}
                </li>
              ))}
              {browseISOItems.length === 0 && (
                <li className="text-gray-500">— empty —</li>
              )}
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsBrowsingISO(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Running VMs */}
      <div className="card">
        <h2>Running Virtual Machines</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">PID</th>
              <th className="border px-2 py-1">Command Line</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vms.map(vm => (
              <tr key={vm.pid}>
                <td className="border px-2 py-1">{vm.pid}</td>
                <td className="border px-2 py-1">{vm.cmdline}</td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleStop(vm.pid)}
                    className="text-red-600 hover:underline"
                  >
                    Stop
                  </button>
                </td>
              </tr>
            ))}
            {vms.length === 0 && (
              <tr>
                <td colSpan={3} className="border px-2 py-1 text-center">
                  No VMs running.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
