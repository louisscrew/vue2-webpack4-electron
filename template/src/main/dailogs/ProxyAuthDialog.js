const path = require('path');
const BaseDialog = require('./BaseDialog.js');
const { ipcMain } = require('electron');


//创建应用主窗口
class ProxyAuthDialog extends BaseDialog {
    constructor(parentDialog) {
        super();
        this.init(parentDialog);
        this.bindEvent();
    }
    //事件绑定
    bindEvent() {
        let self = this;
        //关闭事件
        ipcMain.on('ProxyAuthDialog-main-hide', function (event, args) {
            self.hide();
        });

        
    }
    //初始化方法
    init(parentDialog) {
        if (parentDialog) {
            let self = this;
            let windowOptions = {
                width: 450,
                height: 260,
                show: false,
                alwaysOnTop: true,
                skipTaskbar: true,
                resizable: false,
                closable: false,
                title: "设置网络代理"
            };
            self.pageHtmlUri = path.resolve(__dirname, "../electron-browser/proxy/auth.html");

            //当前激活的窗口
            windowOptions.parent = parentDialog.win;
            windowOptions.modal = true;
            self.setWinOpts(windowOptions);
            //初始化UI
            self.initUI();
            //将菜单去掉
            self.win.setMenu(null);
        }
    }

    show(event, webContents, request, authInfo, callback) {
        let self = this;
        //proxy认证
        ipcMain.on('ProxyAuthDialog-main-login', function (event,args) {
            //得到当前窗口
            console.log(args)
            try{
                callback(args.username, args.password);
            }catch(e1){
                console.log(e1)
            }
        });

        super.show();
        //设置信息
        setTimeout(function(){
            self.win.send('ProxyAuthDialog-renderer-setInfo',authInfo);
        },1000)
    }

}
module.exports = ProxyAuthDialog;