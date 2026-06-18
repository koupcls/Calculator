<div align="center">
  
# Calculator

**Interactive educational tool for cryptography, compression algorithms, and tree structures**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00DC82?style=for-the-badge&logo=vercel&logoColor=white)](https://koupcls.github.io/Calculator/)

</div>



## Features

### Cipher Algorithms
- **Vigenere Cipher** — classical polyalphabetic substitution cipher with customizable alphabet
- **Columnar Transposition** — transposition cipher with column-based encryption
- **Alphabet Editor** — create and manage custom alphabets for encryption

### Compression Algorithms
- **LZ77** — sliding window-based compression algorithm
- **LZ78** — dictionary-based compression method
- **LZSS** — improved LZ77 with enhanced compression ratio
- **LZW** — Lempel-Ziv-Welch algorithm for efficient data compression
- **Interactive Code Editor** — view and edit compression codes in real-time

### Tree Structures
- **Huffman Tree** — optimal prefix code construction with frequency analysis
- **Shannon-Fano Tree** — top-down tree construction algorithm
- **Visual Tree Representation** — interactive visualization of tree structures
- **Metrics & Statistics** — detailed analysis of compression efficiency, entropy, and code length

### User Interface
- **Responsive Design** — works seamlessly on desktop and mobile devices
- **Dark/Light Theme** — toggle between themes for comfortable viewing
- **Modern UI Components** — clean and intuitive interface built with Vue 3
- **Real-time Updates** — instant calculation and visualization



## Installation and Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/koupcls/Calculator.git
   cd Calculator/app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be generated in the `dist` directory.



## Project Structure

```
app/
├── src/
│   ├── components/     # Reusable Vue components
│   ├── core/           # Core algorithms and utilities
│   ├── stores/         # Pinia state management
│   ├── views/          # Page components
│   └── router/         # Vue Router configuration
├── public/             # Static assets
└── vite.config.ts      # Vite configuration
```



## Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production

<div align="center">

**[View Live Demo](https://koupcls.github.io/Calculator/)** • **[Report Issue](https://github.com/koupcls/Calculator/issues)**

</div>
