const path = require('path');
const { app } = require('electron');
const BaseDialog = require('./BaseDialog.js');
const utils = require('../utils/utils');
const config = require('../../../config');
const ProxyAuthDialog = require("./ProxyAuthDialog");
class MainDialog extends BaseDialog{
    constructor() {
        super();
        this.proxyDialog = null;//代理窗口
        this.init();
        this.bindEvent();
    }
    //绑定事件
    bindEvent(){
       
    }
    //初始化方法
    init(){
        let isDev = utils.isDev();//是否为调试模式
        let self = this;
        let windowOptions = {
            width: 1100,
            minWidth: 680,
            height: 768,
            title: "Foor 模板工厂"
        };
        self.setWinOpts(windowOptions);

        let indexUri = "";
        if (isDev === true) {
            let host = config.dev.host;
            let port = config.dev.port;
            indexUri = `http://${host}:${port}/`;
        } else {
            indexUri = path.resolve(__dirname, "../../dist/index.html");
        }
        indexUri = "http://www.baidu.com";
        self.pageHtmlUri = indexUri;

        //初始化UI
        self.initUI();
        //去掉菜单
        self.win.setMenu(null);
        
        //在加载页面时，进程第一次完成绘制时
        self.win.once('ready-to-show', function () {
            // console.log(1111)
            self.win.show();
            self.win.focus();
        });
        self.win.on('closed', function () {
            self.win = null;
        });

        //将主窗口给全局变量
        app.mainDialog = self.win;
        //添加其他窗口
        self.addDialogs();
        
    }

    //添加窗口的方法
    addDialogs(){
        //创建认证窗口
        this.proxyDialog = new ProxyAuthDialog(this);
    }

}

module.exports = MainDialog;