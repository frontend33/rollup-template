import nodeResolve from 'rollup-plugin-node-resolve';
import commonJs from 'rollup-plugin-commonjs';
import typeScript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import html from 'rollup-plugin-html';
import visualizer from 'rollup-plugin-visualizer';
import {sizeSnapshot} from "rollup-plugin-size-snapshot";
import {terser} from 'rollup-plugin-terser';

const rollupWatch = !process.env.ROLLUP_WATCH;


const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const server = () => {
    const Koa = require('koa');
    const Router = require('@koa/router');
    const router = new Router();
    const cors = require('@koa/cors');
    const send = require('koa-send');

    const app = new Koa();

    app.use(cors());

    router.get('/', async (ctx) => {
        console.log('ctx', ctx)
        await send(ctx, './public/index.html');
    });

    app.use(router.routes());

    const port = process.env.PORT || 3000;
    app.listen(port);

}

const getPlugins = (options) => [
        nodeResolve({
            mainFields: ['module', 'main', 'jsnext:main', 'browser'],
            extensions
        }), // подключение модулей node
    commonJs(),
    postcss(),
    html(),
    typeScript({
        tsconfig: "tsconfig.json",
        tsconfigOverride: { compilerOptions: { "target": options.target } }
    }),
    sizeSnapshot(),
    terser(),
    visualizer(),
];

const build = () => {
    if (!rollupWatch) {
        server();
    }

    return [
    // {
    // input: 'src/polyfills.ts',
    // output: [{ file: 'dist/polyfills.min.js', format: 'iife' }],
    // plugins: getPlugins({ target: "es5" })
    // },
    {
        input: 'src/index.ts',
        output: [{ file: 'dist/index.next.min.js', format: 'iife' }],
        plugins: getPlugins({ target: "esnext" })
    },{
        input: 'src/index.ts',
        output: [{ file: 'dist/index.es5.min.js', format: 'iife' }],
        plugins: getPlugins({ target: "es5" })
    },{
        input: 'src/index.ts',
        output: [{ file: 'dist/index.es3.min.js', format: 'iife' }],
        plugins: getPlugins({ target: "es3" })
    },
    // {
    //     input: 'src/serviceworker.ts',
    //     output: [{ file: 'dist/serviceworker.min.js', format: 'iife' }],
    //     plugins: getPlugins({ target: "es5" })
    // },{
    //     input: 'src/webworker.ts',
    //     output: [{ file: 'dist/webworker.min.js', format: 'iife' }],
    //     plugins: getPlugins({ target: "es5" })
    // }
]}

export default build;
// export default [{
//     input: 'src/index.ts',
//     output: [{ file: 'dist/index.r.min.js', format: 'iife' }],
//     plugins: [
//         nodeResolve({
//             mainFields: ['module', 'main', 'jsnext:main', 'browser'],
//             extensions
//         }), // подключение модулей node
//         commonJs(), // подключение модулей commonjs
//         postcss(), // подключение препроцессора postcc, а также стилей scss и less
//         html(), // подключение html файлов
//         // typeScript({tsconfig: "tsconfig.json"}), // подключение typescript
//         sizeSnapshot(), // напишет в консоль размер бандла
//         terser(), // минификатор совместимый с ES2015+, форк и наследник UglifyES
//         visualizer() // анализатор бандла,
//     ]
// }];

