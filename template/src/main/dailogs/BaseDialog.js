
const { dialog, BrowserWindow} = require('electron');

//窗口基础类
class BaseDailog {
    constructor() {
        this.winOpts = {
            width: 1100,
            height: 768,
            title: "窗口",
            maximizable: true,
            resizable: true,
            autoHideMenuBar: false,
            fullscreen: false,
            fullscreenable: true,
            show: false,
            autoHideMenuBar: false,
            skipTaskbar: false
        };
        this.pageHtmlUri = "";
        //创建实例
        this.win = undefined;
    }

    //设置参数的方法
    setWinOpts(config){
        let self = this;
        self.winOpts = Object.assign({}, self.winOpts, config);
    }
    show(){
        if(this.win){
            this.win.show();
        }
    }
    hide(){
        if(this.win){
            this.win.hide();
        }
    }
    //初始化UI
    initUI() {
        let self = this;
        //创建窗口实例
        self.win = new BrowserWindow(this.winOpts);
        //设置url
        self.win.loadURL(self.pageHtmlUri);

        //获取主窗口的webContents
        const mainWindowWebContents = self.win.webContents;
        //主页面session对象
        const mainWindowSession = mainWindowWebContents.session;


        //清除缓存
        mainWindowSession.clearCache(function () {
            console.log("clearCached!");
        });
        mainWindowSession.clearHostResolverCache(function () {
            console.log("clearHostResolverCache!");
        });

        //网页下载的扩展方式
        mainWindowSession.on('will-download', (e, item) => {
            //开始下载
            console.log("start downloading");
            //获取文件的总大小
            const totalBytes = item.getTotalBytes();

            //监听下载过程，计算并设置进度条进度
            item.on('updated', () => {
                if (self.win) {
                    self.win.setProgressBar(item.getReceivedBytes() / totalBytes);
                }
            });

            //监听下载结束事件
            item.on('done', (e, state) => {
                //console.log(state);
                if (self.win) {
                    //如果窗口还在的话，去掉进度条
                    if (!self.win.isDestroyed()) {
                        self.win.setProgressBar(-1);
                    }

                    //下载被取消或中断了
                    if (state === 'interrupted') {
                        dialog.showErrorBox('下载失败', `文件 ${item.getFilename()} 因为某些原因被中断下载`);
                    }

                    //下载完成，让 dock 上的下载目录Q弹一下下
                    if (state === 'completed') {
                        // app.dock.downloadFinished(filePath);
                    }
                }
            });

        });
    }
}

module.exports = BaseDailog;