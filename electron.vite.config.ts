import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
    main: {
        // publicDir: 'resources',
        base: '',
        plugins: [externalizeDepsPlugin()],
        build: {
            outDir: 'out',
            assetsDir: 'assets',
            rollupOptions: {
                input: {
                    app: resolve(__dirname, 'src/app.ts'),
                    'server/server': resolve(__dirname, 'src/server/server.ts'),
                    'server/anime_db': resolve(__dirname, 'src/server/anime_db.ts'),
                    'server/users_db': resolve(__dirname, 'src/server/users_db.ts'),
                    'server/routes/account': resolve(__dirname, 'src/server/routes/account.ts'),
                    'server/routes/anime': resolve(__dirname, 'src/server/routes/anime.ts'),
                    'server/routes/animelist': resolve(__dirname, 'src/server/routes/animelist.ts'),
                    'server/routes/for-copyright-holders': resolve(__dirname, 'src/server/routes/for-copyright-holders.ts'),
                    'server/routes/index': resolve(__dirname, 'src/server/routes/index.ts'),
                    'server/routes/search': resolve(__dirname, 'src/server/routes/search.ts'),
                    'server/routes/top': resolve(__dirname, 'src/server/routes/top.ts')
                },
                output: {
                    entryFileNames: `[name].js`,
                    chunkFileNames: `assets/[name].js`,
                    assetFileNames: `server/public/stylesheets/[name].[ext]`
                }
            }
        }
    }
})
