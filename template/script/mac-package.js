//"package:mac2": "electron-packager . --overwrite --platform=darwin --arch=x64 --out=out --icon=assets/app-icon/mac/app.icns --osx-sign.identity='Developer ID Application:Neusoft Corporation (QV36977D8A)' --extend-info=assets/mac/info.plist",
const path = require('path');
const utils = require("../build/utils.js");

utils.logStats("MacOs packages is mading","blue");

const packager = require('electron-packager');
const assetsDir = path.join(utils.rootPath, 'assets');
const infoPlistPath = path.join(assetsDir,'mac','info.plist');
const iconPath = path.join(assetsDir, 'app-icon','mac','app.icns');

//开始创建包
function startPackage(){
    return new Promise((resolve, reject) => {
        packager({
            dir:utils.tempAppFoloder,
            asar:false,
            overwrite:true,
            platform:'darwin',
            arch:'x64',
            out:utils.outFoloder,
            icon:iconPath,
            extendInfo:infoPlistPath,
            osxSign:{
                identity:'Developer ID Application:Neusoft Corporation (QV36977D8A)'
            }
        }, function (err, appPaths) {
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    });
}

//开始执行
utils.deleteTempDir()
    .then(utils.createTempDir)
    .then(startPackage)
    .then(utils.deleteTempDir)
    .then(function(){
        utils.logStats(`The executable was created successfully.` ,'blue');
    })
    .catch((error) => {
        utils.logStats(`Executable creation failed.` ,'red');
        utils.logStats(error ,'red');
        process.exit();
    });