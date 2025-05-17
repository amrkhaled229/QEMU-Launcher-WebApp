// frontend/components/Layout.js
import React, { useState } from 'react'

const tabs = ['Disk Manager', 'VM Manager', 'Docker Manager']

export default function Layout({ children }) {
  const [active, setActive] = useState(tabs[0])

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-[url('/images/background.jpg')]
        bg-cover bg-center
      "
    >
      {/* Blurry navbar with project name & centered tabs */}
      <nav
        className="
          sticky top-0 z-20 relative
          backdrop-blur-lg bg-white/30
          shadow-md p-4 flex justify-center
        "
      >
        {/* Project title */}
        <div
          className="
            absolute left-6 top-1/2
            -translate-y-1/2
            text-2xl font-bold text-blue-800
          "
        >
          QEMU Launcher
        </div>

        {/* Centered tab buttons */}
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`
              mx-3 px-4 py-2 rounded-lg transition
              ${active === tab
                ? 'bg-white/60 text-blue-700 font-semibold shadow-inner'
                : 'text-gray-700 hover:bg-white/50'}
            `}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {React.cloneElement(children, { activeTab: active })}
      </main>
    </div>
  )
}
