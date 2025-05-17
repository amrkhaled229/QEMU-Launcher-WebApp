// File: frontend/components/DiskManager.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function DiskManager() {
  // 1) Creation state
  const [folder, setFolder]       = useState('')
  const [diskName, setDiskName]   = useState('')
  const [format, setFormat]       = useState('qcow2')
  const [size, setSize]           = useState(20)

  // 2) Existing disks
  const [disks, setDisks]         = useState([])

  // 3) Browse-folder modal state
  const [isBrowsing, setIsBrowsing]   = useState(false)
  const [browsePath, setBrowsePath]   = useState('/')
  const [browseItems, setBrowseItems] = useState([])

  // 4) Storage info state
  const [storage, setStorage]     = useState({
    total_gb: 0,
    free_gb: 0,
    used_percent: 0
  })

  // Fetch current disks
  const fetchDisks = async () => {
    try {
      const res = await axios.get('/api/disks')
      setDisks(res.data.disks)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch server-side free/total storage
  const fetchStorage = async () => {
    try {
      const res = await axios.get('/api/storage')
      setStorage(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  // Fetch a folder listing for the modal
  const fetchBrowse = async (path) => {
    try {
      const res = await axios.get('/api/browse', { params: { path } })
      setBrowsePath(res.data.current)
      setBrowseItems(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  // Load disks & storage on mount
  useEffect(() => {
    fetchDisks()
    fetchStorage()
  }, [])

  // When browsing opens or path changes, refresh listing
  useEffect(() => {
    if (isBrowsing) {
      fetchBrowse(browsePath)
    }
  }, [isBrowsing, browsePath])

  // Compute storage-color based on used%
  const freeRatio = storage.free_gb / storage.total_gb || 0
  let storageColor = 'text-green-600'
  if (freeRatio < 0.2) storageColor = 'text-red-600'
  else if (freeRatio < 0.5) storageColor = 'text-yellow-600'

  // Create a new disk
  const handleCreate = async () => {
    if (!folder) {
      alert("Please select a folder")
      return
    }
    if (!diskName) {
      alert("Please enter a disk name")
      return
    }
    if (size > storage.free_gb) {
      alert("Requested size exceeds available storage")
      return
    }
    const fullPath = `${folder}/${diskName}.${format}`
    try {
      await axios.post('/api/disks', {
        path: fullPath,
        format,
        size_gb: size
      })
      // reset form
      setDiskName('')
      setSize(20)
      fetchDisks()
      fetchStorage()
    } catch (err) {
      console.error(err)
      alert("Error creating disk: " + (err.response?.data?.detail || err.message))
    }
  }

  // Delete an existing disk
  const handleDelete = async (diskPath) => {
    try {
      await axios.delete('/api/disks', { params: { path: diskPath } })
      fetchDisks()
      fetchStorage()
    } catch (err) {
      console.error(err)
      alert("Error deleting disk: " + (err.response?.data?.detail || err.message))
    }
  }

  return (
    <div className="space-y-6">
      {/* Available storage info */}
      <div className="card">
        <span className={`font-medium ${storageColor}`}>
          Available Storage: {storage.free_gb} GB / {storage.total_gb} GB&nbsp;
          ({storage.used_percent.toFixed(0)}% used)
        </span>
      </div>

      {/* Create Virtual Disk */}
      <div className="card">
        <h2>Create Virtual Disk</h2>
        <div className="space-y-4">
          {/* Folder picker */}
          <div>
            <label className="block mb-1 font-medium">Folder</label>
            <div className="flex">
              <input
                type="text"
                value={folder}
                readOnly
                placeholder="/path/to/folder"
                className="flex-1 border rounded-l px-3 py-2 bg-gray-100"
              />
              <button
                onClick={() => setIsBrowsing(true)}
                className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark"
              >
                Browse…
              </button>
            </div>
          </div>

          {/* Disk Name */}
          <div>
            <label className="block mb-1 font-medium">Disk Name</label>
            <input
              type="text"
              placeholder="e.g. mydisk"
              value={diskName}
              onChange={e => setDiskName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Format */}
          <div>
            <label className="block mb-1 font-medium">Format</label>
            <select
              value={format}
              onChange={e => setFormat(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <optgroup label="Dynamic-size formats">
                <option value="qcow2">qcow2</option>
                <option value="vdi">vdi</option>
                <option value="vhdx">vhdx</option>
                <option value="vmdk">vmdk</option>
              </optgroup>
              <optgroup label="Fixed-size formats">
                <option value="raw">raw</option>
                <option value="img">img</option>
              </optgroup>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block mb-1 font-medium">
              Size (GB) (max {storage.free_gb})
            </label>
            <input
              type="number"
              min={1}
              max={Math.floor(storage.free_gb)}
              value={size}
              onChange={e => setSize(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Create button */}
          <button
            onClick={handleCreate}
            disabled={size < 1 || size > storage.free_gb}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
          >
            Create Disk
          </button>
        </div>
      </div>

      {/* Browse-folder modal */}
      {isBrowsing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-3/4 max-h-3/4 overflow-auto p-6">
            <h3 className="text-lg font-semibold mb-4">
              Browse Folder: {browsePath}
            </h3>
            <div className="mb-4">
              <button
                disabled={browsePath === '/'}
                onClick={() => {
                  const up = browsePath.split('/').slice(0, -1).join('/')
                  setBrowsePath(up === '' ? '/' : up)
                }}
                className="mr-2 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Up
              </button>
              <button
                onClick={() => fetchBrowse(browsePath)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Refresh
              </button>
            </div>
            <ul>
              {browseItems.map(item => (
                <li key={item.name} className="mb-1">
                  {item.is_dir ? (
                    <button
                      onClick={() =>
                        setBrowsePath(prev =>
                          prev === '/'
                            ? `/${item.name}`
                            : `${prev}/${item.name}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      📁 {item.name}
                    </button>
                  ) : (
                    <span>📄 {item.name}</span>
                  )}
                </li>
              ))}
              {browseItems.length === 0 && (
                <li className="text-gray-500">— empty —</li>
              )}
            </ul>
            <div className="mt-6 text-right space-x-2">
              <button
                onClick={() => {
                  setFolder(browsePath)
                  setIsBrowsing(false)
                }}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Select Folder
              </button>
              <button
                onClick={() => setIsBrowsing(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Available Disks */}
      <div className="card">
        <h2>Available Disks</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Path</th>
              <th className="border px-2 py-1">Format</th>
              <th className="border px-2 py-1">Size (GB)</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {disks.map(d => (
              <tr key={d.path}>
                <td className="border px-2 py-1">{d.path}</td>
                <td className="border px-2 py-1">{d.format}</td>
                <td className="border px-2 py-1">{d.size_gb}</td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleDelete(d.path)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {disks.length === 0 && (
              <tr>
                <td colSpan={4} className="border px-2 py-1 text-center">
                  No disks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
