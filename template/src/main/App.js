const path = require('path');
const config = require("../../config");
const electron = require('electron');

const dialog = require('electron').dialog;
const app = electron.app;//引入全局app对象
const BrowserWindow = electron.BrowserWindow;//引入窗口对象

let argvs = process.argv.splice(2);
let isDebug = false;
if("--development"==argvs[0]){
    isDebug = true;
}

//主窗口句柄
let mainWindow = null;


//单例模式
function makeSingleInstance () {
    // console.log(process.execPath)
    return app.makeSingleInstance(function () {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.restore();
            mainWindow.focus();
        }
    });
}

//创建主窗口
function createMainWindow(){

    var windowOptions = {
        width: 1100
        ,minWidth: 680
        ,height: 768
        ,title: "foor 模板工厂"
        // ,icon:AppConfig.appMainIcon
        ,maximizable:true//发布版本不允许最大化
        ,resizable:true//发布版本不允许改变大小
        ,autoHideMenuBar:false
        ,fullscreen:false
        ,fullscreenable:true//是否支持全屏显示
        ,show:false
        ,autoHideMenuBar:false
        ,backgroundColor:'#0e1a10'
        ,skipTaskbar:false//是否在任务栏中显示窗口. true则不显示在任务栏，false则显示在任务栏
        ,webPreferences: {
            plugins: true
        }
    };
    
    if (process.platform === 'darwin') {
        windowOptions['fullscreenable'] = false;//mac 取消全屏
        windowOptions['titleBarStyle'] = 'hidden';
        windowOptions['frame'] = false;
    }
    //创建主窗口实例
    mainWindow = new BrowserWindow(windowOptions);
    let indexUri = "";
    if(isDebug===true){
        let host = config.dev.host;
        let port = config.dev.port;
        indexUri = `http://${host}:${port}/`;
    }else{
        indexUri = path.resolve(__dirname, "../../dist/index.html");
    }
    mainWindow.loadURL(indexUri);
    //在加载页面时，进程第一次完成绘制时
    mainWindow.once('ready-to-show', function(){
        mainWindow.show();
        mainWindow.focus();
    });
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    
    if (isDebug) {
        mainWindow.setMaximizable(true);//开发模式允许最大化
        mainWindow.setResizable(true);//开发模式允许最大化
        if (process.platform === 'darwin') {
        }else{
            mainWindow.webContents.openDevTools();
        }
        mainWindow.maximize();
    }


    //获取主窗口的webContents
    const mainWindowWebContents = mainWindow.webContents;
    //主页面session对象
    const mainWindowSession = mainWindowWebContents.session;
    //清除缓存
    mainWindowSession.clearCache(function(){
        console.log("clearCached!");
    });

    //清除缓存
    mainWindowSession.clearHostResolverCache(function(){
        console.log("clearHostResolverCache!");
    });

    //绑定网络中断时执行的事件
    mainWindowSession.webRequest.onErrorOccurred(function(detailObject){
        try{
            mainWindowWebContents.send("randerer-error-occurred",detailObject);
        }catch(e){
            
        }
    });

    //网页下载的扩展方式
    mainWindowSession.on('will-download', (e, item) => {
        //开始下载
        console.log("start downloading");
        //获取文件的总大小
        const totalBytes = item.getTotalBytes();

        //监听下载过程，计算并设置进度条进度
        item.on('updated', () => {
            if(mainWindow){
                mainWindow.setProgressBar(item.getReceivedBytes() / totalBytes);
            }
        });

        //监听下载结束事件
        item.on('done', (e, state) => {
            //console.log(state);
            if(mainWindow){
                //如果窗口还在的话，去掉进度条
                if (!mainWindow.isDestroyed()) {
                    mainWindow.setProgressBar(-1);
                }

                //下载被取消或中断了
                if (state === 'interrupted') {
                    electron.dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
                }

                //下载完成，让 dock 上的下载目录Q弹一下下
                if (state === 'completed') {
                // app.dock.downloadFinished(filePath);
                }
            }
        });

    });

    //重新加载应用的方法
    mainWindow.custReload = function(){
        mainWindow.send('randerer-unbind-onbeforeunload');
        //重新启动应用
        app.relaunch({args: process.argv.slice(1).concat(['--relaunch'])})
        app.exit(0);
    }

    app.mainWindow = mainWindow;
}




//初始化方法
function initialize(){
    var shouldQuit = makeSingleInstance();
    if (shouldQuit) {
        return app.quit();
    }

    app.on('ready', function () {
        createMainWindow();
    });

    app.on('window-all-closed', function () {
        app.quit();
    });
    app.on('gpu-process-crashed', function (e,killed) {
        const options = {
            type: 'info',
            title: '提示信息',
            message: '主线程gpu崩溃',
            buttons: ['Close']
        }
        dialog.showMessageBox(options, function (index) {
            if (index === 0) {
                app.quit();//关闭系统
            }
        })
    });

    app.on('activate', function () {
        //对于ios系统来说，点击dock则现实主窗口
        if (mainWindow === null) {
            createMainWindow();
        }else{
            mainWindow.show();
        }
    });


}


module.exports = {
    initialize:initialize
}