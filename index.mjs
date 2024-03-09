import child_process from "node:child_process";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import process from "node:process";

import tar from "tar";

import nodeManifest from "./package.json" assert { type: "json"};

const nwVersion = nodeManifest.devDependencies.nw.slice(1);
const headersUrl = `https://dl.nwjs.io/v${nwVersion}/nw-headers-v${nwVersion}.tar.gz`;
const headersPath = path.resolve(process.cwd(), `nw-headers-v${nwVersion}.tar.gz`);

await main();

async function downloadHeaders() {
    const writeStream = fs.createWriteStream(headersPath);

    return new Promise((resolve, reject) => {
        https.get(headersUrl, (res) => {

            let chunks = 0;

            res.on("data", (chunk) => {
                chunks += chunk;
            });

            res.on("end", () => {
                resolve(chunks);
            });

            res.on("error", (error) => {
                reject(error);
            });

            res.pipe(writeStream);
        });
    });
}

async function decompressHeaders() {
    await fs.promises.rm('./node', { recursive: true, force: true });

    await tar.extract({
        file: headersPath,
        C: process.cwd(),
    });
}

async function rebuild() {
    child_process.exec(`node-gyp rebuild --nodedir=${path.resolve('node')}`);
}

export async function main() {

    if (fs.existsSync(headersPath) === false) {
        await downloadHeaders();
    }

    await decompressHeaders();

    rebuild();
}