/**
 * 构建离线HTML版本：核心JS和资源文件包括在HTML中， 下载后可以使用(就是单文件版本的wiki)
 * @param {string} distDir 目标路径，空或者不填则默认为'dist'
 * @param {string} htmlName HTML名称，空或者不填则默认为'index.html'
 * @param {boolean} minify 是否最小化JS和HTML，默认为true
 * @param {string} excludeFilter 要排除的tiddler的过滤表达式，默认为'-[is[draft]]'
 */

cd(path.join(__dirname, '..'));

let [_, distDir, htmlName, minify, excludeFilter] = argv._;
if (typeof distDir !== 'string' || distDir.length === 0) distDir = 'dist';
if (typeof htmlName !== 'string' || htmlName.length === 0) htmlName = 'index.html';
if (typeof minify !== 'boolean') minify = true;
if (typeof excludeFilter !== 'string') excludeFilter = '-[is[draft]]';

// 构建HTML
const flags = [
  ` --deletetiddlers "[[$:/UpgradeLibrary]] [[$:/UpgradeLibrary/List]]"`,
  `--rendertiddler "$:/plugins/tiddlywiki/tiddlyweb/save/offline" index-raw.html text/plain "" publishFilter "${excludeFilter}"`,
];
await $`tiddlywiki . --output ${distDir + flags.join(' ')}`;

// 最小化：HTML
if (minify) {
  await $`npx html-minifier-terser -c html-minifier-terser.config.json -o ${distDir}/${htmlName} ${distDir}/index-raw.html && rm ${distDir}/index-raw.html`;
} else {
  await $`mv ${distDir}/index-raw.html ${distDir}/${htmlName}`;
}
