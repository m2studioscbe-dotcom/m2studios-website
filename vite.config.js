import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { cpSync } from 'node:fs';
import { resolve } from 'path';

const copyAdminStatic = () => ({
  name: 'copy-admin-static',
  writeBundle() {
    cpSync(resolve(__dirname, 'admin'), resolve(__dirname, 'dist/admin'), {
      recursive: true,
    });
  },
});

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        'index': resolve(__dirname, 'src/index.html'),
        'services': resolve(__dirname, 'src/services.html'),
        'portfolio': resolve(__dirname, 'src/portfolio.html'),
        'movementz': resolve(__dirname, 'src/movementz.html'),
        'momentz': resolve(__dirname, 'src/momentz.html'),
      },
      output: {
        entryFileNames: 'assets/js/[name]-[hash].js',
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  publicDir: '../public',
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
      helpers: {},
    }),
    copyAdminStatic(),
  ],
  server: {
    open: true,
  },
});
