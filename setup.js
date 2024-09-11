// setup.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = 'src';

const files = [
  {
    name: 'App.jsx',
    content: `
import React from 'react';
import CharacterSheet from './CharacterSheet';

const App = () => {
  return (
    <div className="App">
      <header className="bg-stone-800 text-amber-100 p-4 text-center">
        <h1 className="text-2xl font-bold">Character Sheet App</h1>
      </header>
      <main className="container mx-auto p-4">
        <CharacterSheet />
      </main>
    </div>
  );
}

export default App;
`
  },
  {
    name: 'main.jsx',
    content: `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`
  },
  {
    name: 'index.css',
    content: `
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #1c1917;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
`
  },
  {
    name: 'CharacterSheet.jsx',
    content: `
import React, { useState, useEffect } from 'react';
import { X, Zap, Minus } from 'lucide-react';

// Your CharacterSheet component code will go here
`
  }
];

const rootFiles = [
  {
    name: 'vite.config.js',
    content: `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
`
  },
  {
    name: 'tailwind.config.js',
    content: `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
  },
  {
    name: 'postcss.config.js',
    content: `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  }
];

function createOrUpdateFile(filePath, content) {
  fs.writeFileSync(filePath, content.trim());
  console.log(`Created/Updated ${filePath}`);
}

function setup() {
  // Create src directory if it doesn't exist
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
  }

  // Create/overwrite files in src directory
  files.forEach(file => {
    createOrUpdateFile(path.join(srcDir, file.name), file.content);
  });

  // Create/overwrite files in root directory
  rootFiles.forEach(file => {
    createOrUpdateFile(path.join(__dirname, file.name), file.content);
  });

  console.log('Setup complete! Don\'t forget to install dependencies and add your CharacterSheet component code to src/CharacterSheet.jsx.');
}

setup();