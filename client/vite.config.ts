import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// ********************************************************************************
// CONFIG
import dotenv from 'dotenv';
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   allowedHosts: [
  //     process.env.VITE_NGROK_CLIENT,
  //     // You can add more allowed hosts here if needed
  //   ]
  // }
  build: {
    outDir: 'build' // Change this to your desired build directory
  }
})
