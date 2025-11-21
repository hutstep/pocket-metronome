# Pocket Metronome

A professional-grade, high-precision metronome web application built for musicians. Features a modern UI, advanced timing capabilities, and offline support.

## Features

- **High Precision Audio Engine**: Built on the Web Audio API with lookahead scheduling for rock-solid timing.
- **Advanced Time Signatures**: Support for complex meters (e.g., 5/8, 7/8, 12/8) with customizable note values.
- **Visual Beat Indication**: Visualizer with accent support and subdivision indicators.
- **Interactive Beat Muting**: Click on any beat in the visualizer to mute it—perfect for practicing rhythm gaps.
- **Speed Trainer**: Automatically increase BPM over time or bars to build speed progressively.
- **Tap Tempo**: Quickly set the tempo by tapping.
- **Sound Presets**: Choose between different sounds (Beep, Click, Woodblock).
- **Timer**: Set a practice timer that automatically stops the metronome.
- **Preset Management**: Save and load your favorite settings for different songs or exercises.
- **Offline Capable**: Fully functional PWA (Progressive Web App) that works offline.
- **Dark Mode**: Automatic dark mode support based on system settings.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.1
- **State Management**: React Context + TanStack Query (for persistence)
- **Audio**: Web Audio API (Custom scheduling engine)
- **Storage**: LocalStorage (Adapter pattern)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hutstep/pocket-metronome.git
   cd pocket-metronome
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## License

MIT
