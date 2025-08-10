# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run setup` - Run setup script (setup.js)

## Architecture Overview

This is a React TypeScript dice rolling application for tabletop RPGs built with Vite. The app uses a dice-based ability system where characters have 6 abilities (Brains, Handle, Grit, Charm, Flight, Brawn) each mapped to different dice sizes (D20 to D4).

### Core Components

- **App.tsx**: Main application component that manages roll history state and coordinates between CharacterSheet and ActionPanel
- **CharacterSheet.tsx**: Central component handling character state, dice rolling, ability modifiers, strengths/flaws management 
- **ActionPanel.tsx**: Action selection interface with predefined actions grouped by category (Social, Athletics, Academics, Perception)
- **AbilitySelector.tsx**: Dice rolling interface for the 6 core abilities
- **RollHistory.tsx**: Display component for roll results and history
- **CharacterInfo.tsx**: Character biographical information form

### Key Data Structures

- **Abilities**: Each ability has a die type (D4-D20) and label
- **Actions**: Combine two abilities for rolls, have categories and descriptions
- **Roll Outcomes**: Track ability, die type, roll results, modifiers, and final totals
- **Strengths/Flaws**: Modify ability scores (+2 for strengths, -1 for flaws)

### Styling

Uses Tailwind CSS with a retro terminal/character sheet aesthetic using monospace fonts, gray color scheme, and bordered layouts.

### TypeScript Configuration

Uses strict TypeScript with separate configs for app (tsconfig.app.json) and Node (tsconfig.node.json).