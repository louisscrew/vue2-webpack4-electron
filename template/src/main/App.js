
const { app , dialog } = require('electron');  
const MainDialog = require("./dailogs/MainDialog");//引入主窗口对象

//创建APP基础类
class App {
    constructor() {
        this.mainDialog = null;
    }
    //创建主窗口的方法
    createMainWindow() {
        let self = this;
        if(!self.mainDialog){
            self.mainDialog = new MainDialog();
        }
    }
    //运行应用
    run() {
        let self = this;
        let shouldQuit = self.makeSingleInstance();
        if (shouldQuit) {
            return app.quit();
        }

        //应用准备
        app.on('ready', function () {
            self.createMainWindow();
        });

        //所有窗口关闭时执行
        app.on('window-all-closed', function () {
            app.quit();
        });

        //cup泵阔时执行
        app.on('gpu-process-crashed', function (e, killed) {
            const options = {
                type: 'info',
                title: '提示信息',
                message: '主线程gpu崩溃',
                buttons: ['Close']
            }
            dialog.showMessageBox(options, function (index) {
                if (index === 0) {
                    app.quit(); //关闭系统
                }
            })
        });


        //app激活时
        app.on('activate', function () {
            //对于ios系统来说，点击dock则现实主窗口
            if (self.mainDialog === null) {
                self.createMainWindow();
            } else {
                self.mainDialog.win.show();
            }
        });

        //坚挺是否需要代理
        app.on('login', function(event, webContents, request, authInfo, callback) {
            //阻止浏览器的默认行为
            event.preventDefault();
            if(self.mainDialog){
                self.mainDialog.proxyDialog.show(event, webContents, request, authInfo, callback);
            }
        });

    }
    //创建一个单例应用
    makeSingleInstance() {
        let self = this;
        return app.makeSingleInstance(function () {
            if (self.mainDialog) {
                self.mainDialog.win.show();
                self.mainDialog.win.restore();
                self.mainDialog.win.focus();
            }
        });
    }
}

//创建实例
const MainApp = new App();
module.exports = MainApp;