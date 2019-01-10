const path = require('path');//获取路径模块
const utils = require("../build/utils.js");
const dmger = require('electron-installer-dmg');
const fs = require('fs');

const version = require('../package').version;
const appName = require('../package').name;

//dmg目录
const dmgDir = path.resolve(__dirname,"../out/"+appName+"-DMG/");
const dmgName = appName+"-Setup-"+version;
const dmgIconPath = path.resolve(__dirname,"../assets/app-icon/mac/app.icns");
const appPath = path.resolve(__dirname,"../out/"+appName+"-darwin-x64/"+appName+".app");

//先删除目录
function deleteDMG(){
    return utils.deleteDir(dmgDir);
}
//创建dmg目录
function makeDMGDir(){
    return utils.mkDir(dmgDir);
}
//创建dmg文件
function createGMG(){
    return new Promise((resolve, reject) => {
        dmger({
            appPath:appPath
            ,name:dmgName
            ,overwrite:true
            ,out:dmgDir
            ,icon:dmgIconPath
        },function done(err){
            if(err){
                reject(error);
            }else{
                resolve();
            }
        });
    });
}


let appIsExist = fs.existsSync(appPath);
if(appIsExist===true){
    //先删除在创建文件夹，最后创建dmg文件
    deleteDMG()
        .then(makeDMGDir)
        .then(createGMG)
        .then(function(){
            utils.logStats(`DMG file created successfully.` ,'blue');
        })
        .catch((error) => {
            utils.logStats(`DMG file creation failed.` ,'red');
            utils.logStats(error ,'red');
            process.exit();
        });
}else{
    console.log("App does not exist, can not DMG, you sure this path has App?");
}
