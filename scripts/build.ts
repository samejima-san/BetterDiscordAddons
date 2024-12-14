/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import install from "./install";

import buildMeta from "./meta";


const pluginName = process.argv.slice(2)[0];

// Initialize bdFolder
const windows = process.env.APPDATA;
const mac = process.env.HOME + "/Library/Application Support";
const linux = process.env.XDG_CONFIG_HOME ? process.env.XDG_CONFIG_HOME : process.env.HOME + "/.config";
const bdFolder = (process.platform == "win32" ? windows : process.platform == "darwin" ? mac : linux) + "/BetterDiscord/";

// Setup input and output bases
const projectRoot = path.dirname(process.env.npm_package_json ?? "..");
const pluginsPath = path.join(projectRoot, "src");
const releasePath = path.join(projectRoot, "Plugins", pluginName);
const releaseFile = path.join(releasePath, `${pluginName}.plugin.js`);
const configTempFile = path.join(releasePath, `config.js`);
if (!fs.existsSync(pluginsPath)) fs.mkdirSync(pluginsPath, {recursive: true});
if (!fs.existsSync(releasePath)) fs.mkdirSync(releasePath, {recursive: true});

// Setup plugin specific paths
const pluginFolder = path.join(pluginsPath, pluginName);
const configPath = path.join(pluginsPath, pluginName, "config.ts");
const pluginFolderExists = fs.existsSync(pluginFolder);
const configExists = fs.existsSync(configPath);

async function buildPlugin() {
    console.log("");
    console.time("Build took");
    console.log(`Building ${pluginName} from ${configPath}`);

    if (!pluginFolderExists || !configExists) {
        console.error(`Could not build plugin ${pluginName}. Config not found.`);
        process.exit(1);
    }

    // Temporarily build the config
    await esbuild.build({
        entryPoints: [configPath],
        outfile: configTempFile,
    });

    const config = (await import("file://" + configTempFile)).default;
    const mainFilePath = path.join(pluginFolder, config.main);
    fs.rmSync(configTempFile);

    if (!fs.existsSync(mainFilePath)) {
        console.error(`Could not build plugin ${pluginName}. Main file (${config.main}) not found.`);
        process.exit(2);
    }

    const ctx = await esbuild.context({
        entryPoints: [mainFilePath],
        outfile: releaseFile,
        bundle: true,
        banner: {js: buildMeta(config) + "\n" + install},
        footer: {js: "\n/*@end@*/"},
        format: "cjs",
        target: ["chrome128"],
        loader: {".css": "text", ".html": "text"},
        logLevel: "info",
        metafile: true,
        minify: false
    });

    await ctx.rebuild();

    fs.writeFileSync(path.join(bdFolder, "plugins", `${pluginName}.plugin.js`), fs.readFileSync(releaseFile));

    console.log(`${pluginName} built successfully`);
    console.log(`${pluginName} saved as ${releaseFile}`);
    console.timeEnd("Build took");

    if (process.argv.includes("--watch")) await ctx.watch();
    else await ctx.dispose();
}

buildPlugin().catch(console.error);