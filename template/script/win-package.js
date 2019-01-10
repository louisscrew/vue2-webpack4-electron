
const path = require('path');
const utils = require("../build/utils.js");

utils.logStats("windows packages is mading","blue");

const packager = require('electron-packager');
const assetsDir = path.join(utils.rootPath, 'assets');
const iconPath = path.join(assetsDir, 'app-icon','win','app.ico');
const appName = require('../package').name;
const companyName = require('../package').CompanyName;

let platformVal = "win32";
let archVal = "ia32";



//打包方法
function startPackage(){
    return new Promise((resolve, reject) => {
        utils.logStats(`start app package...` ,'yellow');
        packager({
            dir:utils.tempAppFoloder,
            asar:false,
            overwrite:true,
            platform:platformVal,
            arch:archVal,
            out:utils.outFoloder,
            icon:iconPath,
            win32metadata:{
                ProductName:appName,
                CompanyName:companyName
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


//创建临时目录
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
