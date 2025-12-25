import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/swagger': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      // Прокси для MinIO (127.0.0.1:9000)
      '/minio': {
        target: 'http://127.0.0.1:9000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/minio/, ''),
      },
    },
  },
  base: '/RIP_2025_React/',
  build: {
    outDir: 'build',
  },
});

