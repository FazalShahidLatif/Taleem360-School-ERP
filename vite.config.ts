import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || "AIzaSyAYtZocTPfSdCQ8T3brgMwV7YVIAQd_Eck"),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || "AIzaSyAYtZocTPfSdCQ8T3brgMwV7YVIAQd_Eck")
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
