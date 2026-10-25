# The Promise of Nepal | AIESEC in Nepal
### Cinematic 3D Coming Soon Digital Experience

> **"THE PROMISE OF NEPAL."**  
> *Rooted in Nepal. Connected to the World.*

An immersive, photorealistic 3D Himalayan environment and Coming Soon web experience engineered for **AIESEC in Nepal**.

---

## 🏔️ Experience Highlights

1. **Photorealistic 3D Himalayan Environment (`Three.js`)**:
   - **Ama Dablam Summit Peak (6,812m)**: Razor-sharp ridges, hanging glaciers, and soaring granite couloirs rendered with high-fidelity atmospheric depth.
   - **Interactive 3D Summit Waypoint Beacon**: A real-time 3D projected waypoint on Ama Dablam peak displaying elevation, Khumbu Massif geography, and live wind telemetry on hover.
   - **Active 3D Alpine Breeze Particle Systems**:
     - 420-particle summit spindrift wind banner streaming eastward with the jet stream.
     - 550 powdered snow flurry particles drifting through 3D space with depth.
     - Dynamic 3D cursor wind sparkles reacting in real-time to mouse velocity.
   - **Mouse Parallax**: Smooth camera parallax and subtle organic breathing sway.

2. **Antigravity UI Design & Motion Elements**:
   - **3D Spatial Perspective**: GPU-accelerated mouse-tracking tilt (`perspective: 1200px`) that makes the hero container feel weightless.
   - **Live Chapter Launch Countdown**: Frosted glass HUD capsule with live ticking seconds, minutes, hours, and days.
   - **Social Proof**: Real-time registered youth leader counter with multi-member avatar stack.
   - **Pillars of Impact**: Floating glass micro-cards (*Global Reach*, *Himalayan Impact*, *Leadership Labs*).
   - **Official Branding**: Official AIESEC Blue Wordmark floating cleanly on a deepened atmospheric gradient.

3. **Pre-registration & Community Registry**:
   - Working launch pre-registration modal with track selection (Youth Member, Global Volunteer, Global Talent, Partner).
   - Confetti celebration upon registration and `localStorage` persistence.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **3D Graphics**: Three.js (custom GLSL shaders, camera projection, particle systems, additive blending)
- **Styling**: Vanilla CSS Design Tokens (Antigravity glassmorphism, perspective transforms)
- **Icons**: Lucide Icons
- **Celebration Effects**: `canvas-confetti`

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build production bundle
npm run build
```

The application will be accessible at: `http://localhost:5173/`
