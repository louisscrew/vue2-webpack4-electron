const path = require('path');//获取路径模块
const utils = require("../build/utils.js");
const sign = require('electron-osx-sign');
const fs = require('fs');
const version = require('../package').version;
const appName = require('../package').name;
const appPath = path.resolve(__dirname,"../out/"+appName+"-darwin-x64/"+appName+".app");

let appIsExist = fs.existsSync(appPath);
if(appIsExist===true){
    utils.logStats(`Start signing for your app` ,'blue');
    sign({
        app:appPath
    },function done(err){
        if(err){
            utils.logStats(err ,'red');
            return;
        }
        utils.logStats(`App signature has been successful` ,'blue');
    });
}else{
    utils.logStats(`App does not exist, can not sign, you sure this path has app?` ,'red');
}
