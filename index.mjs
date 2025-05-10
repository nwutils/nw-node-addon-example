import child_process from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import stream from "node:stream";

import axios from "axios";
import * as semver from "semver";
import * as tar from "tar";

import nodeManifest from "./package.json" assert { type: "json"};

const version = nodeManifest.devDependencies.nw.slice(1);
const parsedVersion = semver.parse(version);
const nwVersion = `${parsedVersion.major}.${parsedVersion.minor}.${parsedVersion.patch}`;
const headersUrl = `https://dl.nwjs.io/v${nwVersion}/nw-headers-v${nwVersion}.tar.gz`;
const headersPath = path.resolve(process.cwd(), `nw-headers-v${nwVersion}.tar.gz`);

await main();

async function downloadHeaders() {

    const writeStream = fs.createWriteStream(headersPath);

    const response = await axios({
        method: 'get',
        url: headersUrl,
        responseType: 'stream'
    });

    await stream.promises.pipeline(response.data, writeStream);
}

async function decompressHeaders() {
    await fs.promises.rm('./node', { recursive: true, force: true });

    await tar.extract({
        file: headersPath,
        C: process.cwd(),
    });
}

async function rebuild() {
    child_process.execFileSync('node-gyp', ['rebuild', `--target=${nodeManifest.volta.node}`, `--nodedir=${path.resolve('node')}`]);
}

export async function main() {

    if (fs.existsSync(headersPath) === false) {
        await downloadHeaders();
    }

    await decompressHeaders();

    if (fs.existsSync(path.resolve('build', 'Release', 'hello.node')) === false) {
        rebuild();
    }
}