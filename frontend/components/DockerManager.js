// File: frontend/components/DockerManager.js

import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function DockerManager() {
  // ---- Dockerfile creation state ----
  const [dockerfilePath, setDockerfilePath]       = useState('')
  const [dockerfileName, setDockerfileName]       = useState('Dockerfile')
  const [dockerfileContent, setDockerfileContent] = useState('')

  // ---- Build image state ----
  const [buildDockerfilePath, setBuildDockerfilePath] = useState('')
  const [imageTag, setImageTag]                       = useState('')

  // ---- Listings ----
  const [images, setImages]         = useState([])
  const [containers, setContainers] = useState([])

  // ---- Stop container state ----
  const [stopContainerId, setStopContainerId] = useState('')

  // ---- Search local ----
  const [searchLocalTerm, setSearchLocalTerm]       = useState('')
  const [searchLocalResults, setSearchLocalResults] = useState([])

  // ---- Search DockerHub ----
  const [searchHubTerm, setSearchHubTerm]       = useState('')
  const [searchHubResults, setSearchHubResults] = useState([])

  // ---- Pull image state ----
  const [pullImageRef, setPullImageRef] = useState('')

  // ---- Browse‐modal state ----
  // browseTarget: null | 'create' | 'build'
  const [browseTarget, setBrowseTarget] = useState(null)
  const [browsePath, setBrowsePath]     = useState('/')
  const [browseItems, setBrowseItems]   = useState([])

  // ----- Fetchers -----
  const fetchImages = async () => {
    try {
      const res = await axios.get('/api/docker/images')
      setImages(res.data.images)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchContainers = async () => {
    try {
      const res = await axios.get('/api/docker/containers')
      setContainers(res.data.containers)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchBrowse = async (path) => {
    try {
      const res = await axios.get('/api/browse', { params: { path } })
      setBrowsePath(res.data.current)
      setBrowseItems(res.data.items)
    } catch (err) {
      console.error(err)
    }
  }

  // ----- Effects -----
  useEffect(() => {
    fetchImages()
    fetchContainers()
  }, [])

  useEffect(() => {
    if (browseTarget) {
      fetchBrowse(browsePath)
    }
  }, [browseTarget, browsePath])

  // ----- Handlers -----
  const handleCreateDockerfile = async () => {
    if (!dockerfilePath) {
      alert("Please select a folder")
      return
    }
    if (!dockerfileName.trim()) {
      alert("Please enter a filename")
      return
    }
    const fullPath = `${dockerfilePath.replace(/\/$/, '')}/${dockerfileName}`

    try {
      await axios.post('/api/dockerfile', {
        path: fullPath,
        content: dockerfileContent
      })
      setDockerfilePath('')
      setDockerfileName('Dockerfile')
      setDockerfileContent('')
    } catch (err) {
      console.error(err)
      alert(
        'Error creating Dockerfile:\n' +
        (err.response?.data?.detail || err.message)
      )
    }
  }

  const handleBuildImage = async () => {
    if (!buildDockerfilePath) {
      alert("Please select a Dockerfile")
      return
    }
    if (!imageTag.trim()) {
      alert("Please enter an image name:tag")
      return
    }
    try {
      await axios.post('/api/docker/build', {
        dockerfile_path: buildDockerfilePath,
        tag: imageTag
      })
      setBuildDockerfilePath('')
      setImageTag('')
      fetchImages()
    } catch (err) {
      // Log full response
      console.error("Build failed response:", err.response?.data, err)

      // Extract best error message
      const serverMsg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        err.message

      alert("Error building image:\n" + serverMsg)
    }
  }

  const handleStopContainer = async () => {
    if (!stopContainerId.trim()) {
      alert("Please enter a container ID or name")
      return
    }
    try {
      await axios.post('/api/docker/stop', { container: stopContainerId })
      setStopContainerId('')
      fetchContainers()
    } catch (err) {
      console.error(err)
      alert(
        'Error stopping container:\n' +
        (err.response?.data?.detail || err.message)
      )
    }
  }

  const handleSearchLocal = async () => {
    try {
      const res = await axios.post('/api/docker/search', { term: searchLocalTerm })
      setSearchLocalResults(res.data.results)
    } catch (err) {
      console.error(err)
      alert(
        'Error searching local images:\n' +
        (err.response?.data?.detail || err.message)
      )
    }
  }

  const handleSearchHub = async () => {
    try {
      const res = await axios.post('/api/docker/search_hub', { term: searchHubTerm })
      setSearchHubResults(res.data.results)
    } catch (err) {
      console.error(err)
      alert(
        'Error searching Docker Hub:\n' +
        (err.response?.data?.detail || err.message)
      )
    }
  }

  const handlePullImage = async () => {
    if (!pullImageRef.trim()) {
      alert("Please enter an image reference")
      return
    }
    try {
      await axios.post('/api/docker/pull', { reference: pullImageRef })
      setPullImageRef('')
      fetchImages()
    } catch (err) {
      console.error(err)
      alert(
        'Error pulling image:\n' +
        (err.response?.data?.detail || err.message)
      )
    }
  }

  // ----- Browse modal controls -----
  const openBrowser  = (target) => { setBrowseTarget(target); setBrowsePath('/') }
  const closeBrowser = () => { setBrowseTarget(null) }

  const selectPath = (path) => {
    if (browseTarget === 'create') setDockerfilePath(path)
    else if (browseTarget === 'build') setBuildDockerfilePath(path)
    closeBrowser()
  }

  return (
    <div className="space-y-6">
      {/* Create Dockerfile */}
      <div className="card">
        <h2>Create Dockerfile</h2>
        <div className="space-y-4">
          {/* Folder picker */}
          <div>
            <label className="block mb-1 font-medium">Folder</label>
            <div className="flex">
              <input
                type="text"
                value={dockerfilePath}
                readOnly
                className="flex-1 border rounded-l px-3 py-2 bg-gray-100"
                placeholder="/path/to/folder"
              />
              <button
                onClick={() => openBrowser('create')}
                className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark"
              >
                Browse…
              </button>
            </div>
          </div>
          {/* Filename input */}
          <div>
            <label className="block mb-1 font-medium">Filename</label>
            <input
              type="text"
              placeholder="e.g. Dockerfile"
              value={dockerfileName}
              onChange={e => setDockerfileName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* Contents */}
          <div>
            <label className="block mb-1 font-medium">Contents</label>
            <textarea
              rows={6}
              value={dockerfileContent}
              onChange={e => setDockerfileContent(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleCreateDockerfile}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Create Dockerfile
          </button>
        </div>
      </div>

      {/* Build Docker Image */}
      <div className="card">
        <h2>Build Docker Image</h2>
        <div className="space-y-4">
          {/* Dockerfile picker */}
          <div>
            <label className="block mb-1 font-medium">Dockerfile Path</label>
            <div className="flex">
              <input
                type="text"
                value={buildDockerfilePath}
                readOnly
                className="flex-1 border rounded-l px-3 py-2 bg-gray-100"
                placeholder="/path/to/Dockerfile"
              />
              <button
                onClick={() => openBrowser('build')}
                className="bg-primary text-white px-4 py-2 rounded-r hover:bg-primary-dark"
              >
                Browse…
              </button>
            </div>
          </div>
          {/* Image tag */}
          <div>
            <label className="block mb-1 font-medium">Image Name:Tag</label>
            <input
              type="text"
              value={imageTag}
              onChange={e => setImageTag(e.target.value)}
              placeholder="e.g. myimage:latest"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleBuildImage}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Build Image
          </button>
        </div>
      </div>

      {/* List Docker Images */}
      <div className="card">
        <h2>List Docker Images</h2>
        <button
          onClick={fetchImages}
          className="mb-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Refresh
        </button>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Repository</th>
              <th className="border px-2 py-1">Tag</th>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Size</th>
            </tr>
          </thead>
          <tbody>
            {images.map(img => (
              <tr key={img.id}>
                <td className="border px-2 py-1">{img.repository}</td>
                <td className="border px-2 py-1">{img.tag}</td>
                <td className="border px-2 py-1">{img.id}</td>
                <td className="border px-2 py-1">{img.size}</td>
              </tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan={4} className="border px-2 py-1 text-center">
                  No images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* List Running Containers */}
      <div className="card">
        <h2>List Running Containers</h2>
        <button
          onClick={fetchContainers}
          className="mb-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Refresh
        </button>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Image</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Ports</th>
              <th className="border px-2 py-1">ID</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(c => (
              <tr key={c.id}>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.image}</td>
                <td className="border px-2 py-1">{c.status}</td>
                <td className="border px-2 py-1">{c.ports}</td>
                <td className="border px-2 py-1">{c.id}</td>
              </tr>
            ))}
            {containers.length === 0 && (
              <tr>
                <td colSpan={5} className="border px-2 py-1 text-center">
                  No containers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stop Container */}
      <div className="card">
        <h2>Stop Container</h2>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            value={stopContainerId}
            onChange={e => setStopContainerId(e.target.value)}
            placeholder="Container ID or name"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleStopContainer}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Stop
          </button>
        </div>
      </div>

      {/* Search Local Images */}
      <div className="card">
        <h2>Search Local Images</h2>
        <div className="flex space-x-4 items-center mb-4">
          <input
            type="text"
            value={searchLocalTerm}
            onChange={e => setSearchLocalTerm(e.target.value)}
            placeholder="Image name or tag"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSearchLocal}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Search
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border px-2 py-1">Repository</th>
              <th className="border px-2 py-1">Tag</th>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Size</th>
            </tr>
          </thead>
          <tbody>
            {searchLocalResults.map(img => (
              <tr key={img.id}>
                <td className="border px-2 py-1">{img.repository}</td>
                <td className="border px-2 py-1">{img.tag}</td>
                <td className="border px-2 py-1">{img.id}</td>
                <td className="border px-2 py-1">{img.size}</td>
              </tr>
            ))}
            {searchLocalResults.length === 0 && (
              <tr>
                <td colSpan={4} className="border px-2 py-1 text-center">
                  No matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Search on DockerHub */}
      <div className="card">
        <h2>Search on DockerHub</h2>
        <div className="flex space-x-4 items-center mb-4">
          <input
            type="text"
            value={searchHubTerm}
            onChange={e => setSearchHubTerm(e.target.value)}
            placeholder="Image name"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handleSearchHub}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Search
          </button>
        </div>
        <ul className="list-disc pl-5">
          {searchHubResults.map(res => (
            <li key={res.name} className="mb-2">
              <strong>{res.name}</strong>: {res.description}
            </li>
          ))}
          {searchHubResults.length === 0 && (
            <li className="text-gray-500">No results.</li>
          )}
        </ul>
      </div>

      {/* Pull Image */}
      <div className="card">
        <h2>Pull Image</h2>
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            value={pullImageRef}
            onChange={e => setPullImageRef(e.target.value)}
            placeholder="Image name:tag"
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            onClick={handlePullImage}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Pull
          </button>
        </div>
      </div>

      {/* Browse Modal */}
      {browseTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-3/4 max-h-3/4 overflow-auto p-6">
            <h3 className="text-lg font-semibold mb-4">
              Browse Path: {browsePath}
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
                          prev === '/' ? `/${item.name}` : `${prev}/${item.name}`
                        )
                      }
                      className="text-blue-600 hover:underline"
                    >
                      📁 {item.name}
                    </button>
                  ) : (
                    <button
                      onClick={() => selectPath(`${browsePath}/${item.name}`)}
                      className="text-green-600 hover:underline"
                    >
                      📄 {item.name}
                    </button>
                  )}
                </li>
              ))}
              {browseItems.length === 0 && (
                <li className="text-gray-500">— empty —</li>
              )}
            </ul>
            <div className="mt-6 text-right space-x-2">
              <button
                onClick={() => selectPath(browsePath)}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
              >
                Select This Folder
              </button>
              <button
                onClick={closeBrowser}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
