// electron-packager . --overwrite --platform=linux --arch=x64 --out=out
const path = require('path');
const utils = require("../build/utils.js");

utils.logStats("linux packages is mading","blue");

const packager = require('electron-packager');

let archVal = "x64";//默认x64芯片
let chipIdx = process.argv.splice(2);
if(chipIdx && chipIdx.length > 0){
    archVal = chipIdx[0];
}

//打包方法
function startPackage(){
    return new Promise((resolve, reject) => {
        utils.logStats(`start app package...` ,'yellow');
        packager({
            dir:utils.tempAppFoloder,
            asar:false,
            overwrite:true,
            platform:'linux',
            arch:archVal,
            out:utils.outFoloder
        }, function (err, appPaths) {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

//创建临时目录
// utils.deleteTempDir()
//     .then(utils.createTempDir)
//     .then(startPackage)
//     .then(utils.deleteTempDir)
//     .then(function(){
//         utils.logStats(`The executable was created successfully.` ,'blue');
//     })
//     .catch((error) => {
//         utils.logStats(`Executable creation failed.` ,'red');
//         utils.logStats(error ,'red');
//         process.exit();
//     });
