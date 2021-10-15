const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

const syncDirectory = require('../index');

const srcDir = path.join(__dirname, 'srcDir');
const targetDir = path.join(__dirname, 'targetDir');
const srcSymlink = path.join(__dirname, 'symlink');
const toSymlink = path.join(__dirname, 'srcDir/symlink');

if (fs.existsSync(toSymlink)) {
    fse.removeSync(toSymlink);
}

if (fs.existsSync(targetDir)) {
    fse.removeSync(targetDir);
}

// fse.ensureSymlinkSync(srcSymlink, toSymlink);

const delay = () => new Promise(r => setTimeout(r, 2000))

console.log(111);
(async () => {
    console.log(1);
    await syncDirectory.async(srcDir, targetDir, {
        watch: false,
        type: 'copy',
        deleteOrphaned: true,
        supportSymlink: true,
        exclude: [ 'b' ],
        forceSync(file) {
            return /b/.test(file)
        },
        async afterEachSync({ type, relativePath }) {
            console.log(type, relativePath);
            await delay();
        },
        chokidarWatchOptions: {
            awaitWriteFinish: {
                stabilityThreshold: 2000,
                pollInterval: 100
            }
        },
        onError(e) {
            console.log('in onError: ', e);
        }
    });
    console.log(2);
})()