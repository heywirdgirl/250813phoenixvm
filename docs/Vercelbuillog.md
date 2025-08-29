[22:40:34.952] Running build in Washington, D.C., USA (East) – iad1
[22:40:34.952] Build machine configuration: 2 cores, 8 GB
[22:40:34.986] Cloning github.com/heywirdgirl/250813phoenixvm (Branch: main, Commit: ee66384)
[22:40:35.003] Skipping build cache, deployment was triggered without cache.
[22:40:35.268] Cloning completed: 282.000ms
[22:40:35.630] Running "vercel build"
[22:40:36.023] Vercel CLI 46.0.3
[22:40:36.405] Installing dependencies...
[22:40:39.657] npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
[22:40:40.744] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[22:40:41.216] npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
[22:40:41.922] npm warn deprecated @types/handlebars@4.1.0: This is a stub types definition. handlebars provides its own type definitions, so you do not need this installed.
[22:40:44.194] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[22:41:03.645] 
[22:41:03.646] added 878 packages in 27s
[22:41:03.647] 
[22:41:03.647] 109 packages are looking for funding
[22:41:03.647]   run `npm fund` for details
[22:41:03.704] Detected Next.js version: 15.3.3
[22:41:03.713] Running "npm run build"
[22:41:03.828] 
[22:41:03.828] > nextn@0.1.0 build
[22:41:03.828] > next build
[22:41:03.828] 
[22:41:04.449] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[22:41:04.450] This information is used to shape Next.js' roadmap and prioritize features.
[22:41:04.450] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[22:41:04.451] https://nextjs.org/telemetry
[22:41:04.451] 
[22:41:04.553]    ▲ Next.js 15.3.3
[22:41:04.553] 
[22:41:04.579]    Creating an optimized production build ...
[22:41:26.038]  ⚠ Compiled with warnings in 20.0s
[22:41:26.038] 
[22:41:26.039] ./node_modules/handlebars/lib/index.js
[22:41:26.040] require.extensions is not supported by webpack. Use a loader instead.
[22:41:26.040] 
[22:41:26.040] Import trace for requested module:
[22:41:26.040] ./node_modules/handlebars/lib/index.js
[22:41:26.040] ./node_modules/dotprompt/dist/index.js
[22:41:26.040] ./node_modules/@genkit-ai/core/lib/registry.js
[22:41:26.040] ./node_modules/genkit/lib/registry.js
[22:41:26.041] ./node_modules/genkit/lib/genkit.js
[22:41:26.041] ./node_modules/genkit/lib/index.mjs
[22:41:26.041] ./src/ai/flows/suggest-product-tags.ts
[22:41:26.041] ./src/app/actions.ts
[22:41:26.042] 
[22:41:26.042] ./node_modules/handlebars/lib/index.js
[22:41:26.042] require.extensions is not supported by webpack. Use a loader instead.
[22:41:26.042] 
[22:41:26.042] Import trace for requested module:
[22:41:26.042] ./node_modules/handlebars/lib/index.js
[22:41:26.043] ./node_modules/dotprompt/dist/index.js
[22:41:26.043] ./node_modules/@genkit-ai/core/lib/registry.js
[22:41:26.043] ./node_modules/genkit/lib/registry.js
[22:41:26.043] ./node_modules/genkit/lib/genkit.js
[22:41:26.043] ./node_modules/genkit/lib/index.mjs
[22:41:26.043] ./src/ai/flows/suggest-product-tags.ts
[22:41:26.044] ./src/app/actions.ts
[22:41:26.044] 
[22:41:26.044] ./node_modules/handlebars/lib/index.js
[22:41:26.044] require.extensions is not supported by webpack. Use a loader instead.
[22:41:26.044] 
[22:41:26.044] Import trace for requested module:
[22:41:26.045] ./node_modules/handlebars/lib/index.js
[22:41:26.045] ./node_modules/dotprompt/dist/index.js
[22:41:26.045] ./node_modules/@genkit-ai/core/lib/registry.js
[22:41:26.045] ./node_modules/genkit/lib/registry.js
[22:41:26.045] ./node_modules/genkit/lib/genkit.js
[22:41:26.045] ./node_modules/genkit/lib/index.mjs
[22:41:26.046] ./src/ai/flows/suggest-product-tags.ts
[22:41:26.046] ./src/app/actions.ts
[22:41:26.046] 
[22:41:34.711]  ✓ Compiled successfully in 26.0s
[22:41:34.714]    Skipping validation of types
[22:41:34.715]    Skipping linting
[22:41:35.020]    Collecting page data ...
[22:41:39.043]    Generating static pages (0/11) ...
[22:41:40.379]    Generating static pages (2/11) 
[22:41:40.379]    Generating static pages (5/11) 
[22:41:40.379]    Generating static pages (8/11) 
[22:41:41.709]  ✓ Generating static pages (11/11)
[22:41:42.183]    Finalizing page optimization ...
[22:41:42.184]    Collecting build traces ...
[22:41:49.709] 
[22:41:49.720] Route (app)                                 Size  First Load JS
[22:41:49.720] ┌ ○ /                                      185 B         109 kB
[22:41:49.721] ├ ○ /_not-found                            977 B         102 kB
[22:41:49.721] ├ ○ /admin/suggest-tags                  3.55 kB         113 kB
[22:41:49.721] ├ ○ /cart                                4.73 kB         123 kB
[22:41:49.721] ├ ○ /checkout                            9.64 kB         163 kB
[22:41:49.722] ├ ○ /login                               3.63 kB         155 kB
[22:41:49.722] ├ ƒ /order/[orderId]                       656 B         113 kB
[22:41:49.722] ├ ○ /products                              183 B         109 kB
[22:41:49.722] ├ ƒ /products/[id]                         18 kB         153 kB
[22:41:49.722] └ ○ /signup                              3.69 kB         155 kB
[22:41:49.722] + First Load JS shared by all             101 kB
[22:41:49.723]   ├ chunks/4bd1b696-5e93b743650a4b14.js  53.2 kB
[22:41:49.723]   ├ chunks/684-83cb542b6a5c4622.js       45.5 kB
[22:41:49.723]   └ other shared chunks (total)          1.92 kB
[22:41:49.724] 
[22:41:49.724] 
[22:41:49.725] ○  (Static)   prerendered as static content
[22:41:49.725] ƒ  (Dynamic)  server-rendered on demand
[22:41:49.725] 
[22:41:49.898] Traced Next.js server files in: 111.844ms
[22:41:50.159] Created all serverless functions in: 260.987ms
[22:41:50.171] Collected static files (public/, static/, .next/static): 5.089ms
[22:41:50.246] Build Completed in /vercel/output [1m]
[22:41:50.430] Deploying outputs...
[22:41:58.470] Deployment completed
[22:41:59.313] Creating build cache...
[22:42:22.340] Created build cache: 23.027s
[22:42:22.341] Uploading build cache [243.70 MB]
[22:42:26.139] Build cache uploaded: 3.797s