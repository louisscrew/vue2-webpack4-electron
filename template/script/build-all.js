const config = require('../config');
const utils = require("../build/utils.js");
const webpack = require("webpack");
const webpackProdConfig = require("../build/webpack.prod.config.js");
const childProcess = require('child_process');


let electronProcess = null;
let manualRestart = false;

let npm = "npm";
if (process.platform === 'win32') {
    npm = "npm.cmd";
}

//编译vue
function buildVue() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackProdConfig, function (err, stats) {
            if (err) {
                utils.logStats(err, 'red');
            }
            utils.logStats(stats, 'yellow', 'Renderer');
            resolve();
        }); 
    })
};

//得到编译哪个环境
let platformIndex = process.argv.splice(2);
let chipIdx = process.argv.splice(3);
let chip = "";
if(chipIdx && chipIdx.length > 0){
    chip = chipIdx[0];
}
//编译electron
function buildElectron() {
    let platformName = "";
    if (platformIndex && platformIndex.length > 0) {
        platformIndex = platformIndex[0];
    } else {
        utils.electronLog("No choice of platform to be generated", 'red');
        return;
    }
    if (platformIndex === "win") {
        platformName = "windows win32";
    } else if (platformIndex === "mac") {
        platformName = "mac os";
    } else if (platformIndex === "linux") {
        platformName = "linux os";
    }
    utils.electronLog(`The project is being compiled into a ${platformName} executable, please wait......`, 'blue');
    //子进程使用父线程的stdio
    electronProcess = childProcess.spawn(npm, ['run', `package:${platformIndex}`, `${chip}`], { stdio: 'inherit' });
}

//执行程序
function run() {
    Promise.all([buildVue()])
    .then(() => {
        buildElectron()
    })
    .catch(err => {
        console.error(err)
    });
}

run();