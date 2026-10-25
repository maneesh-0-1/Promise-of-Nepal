import { useState } from 'react';
import { MountainScene } from './components/3d/MountainScene';
import { SiteNavigation } from './components/layout/SiteNavigation';
import { HeroOverlay } from './components/sections/HeroOverlay';
import { ComingSoonModal } from './components/ui/ComingSoonModal';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: '#040810',
      }}
    >
      {/* Realistic 3D Himalayan Mountain Peak with Active Alpine Breeze */}
      <MountainScene />

      {/* Top Navigation Bar with Clean AIESEC Logo */}
      <SiteNavigation />

      {/* Single Hero Section: "THE PROMISE OF NEPAL \n COMING SOON" */}
      <main style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        <HeroOverlay onOpenModal={() => setIsModalOpen(true)} />
      </main>

      {/* Pre-registration & Community Modal */}
      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
