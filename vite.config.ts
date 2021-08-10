import * as path from 'path';
import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'esnext',
        emptyOutDir: false,
        outDir: 'dist',
        terserOptions: {
            ecma: 5,
            module: true,
        },
        brotliSize: false,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'suit',
            formats: ['es', 'umd', 'cjs'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
            plugins: [visualizer()],
        },
    },
});
