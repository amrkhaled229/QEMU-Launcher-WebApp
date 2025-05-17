// frontend/pages/index.js
import DiskManager from '../components/DiskManager'
import VMManager from '../components/VMManager'
import DockerManager from '../components/DockerManager'

export default function Home({ activeTab }) {
  return (
    <>
      {activeTab === 'Disk Manager' && <DiskManager />}
      {activeTab === 'VM Manager'   && <VMManager />}
      {activeTab === 'Docker Manager'&& <DockerManager />}
    </>
  )
}
