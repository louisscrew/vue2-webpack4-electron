# vue2-webpack4-electron脚手架
vue2-webpack4-electron脚手架
```
# 全局安装 vue-cli
npm install --global vue-cli
# 创建一个基于 webpack 模板的新项目
vue init louisscrew/vue2-webpack4-electron my-project
# 进入工程
cd my-project
# 安装依赖
npm install


# 运行命令有 
# dev:app 运行vue和electron
# dev:vue 只运行vue，可以通过http://localhost:8080进行访问
# build:vue 只编译vue，输出目录为dist
# build:all 编译vue和electron 比如打包windows程序 npm run build:all win(mac|linux)  
# package:win 只编译win可执行程序
# package:mac 只编译mac可执行程序
# package:linux 只编译linux可执行程序  npm run package:linux x64(mips64el)
# package:mac-dmg 给mac app打包成dmg
# package:mac-sign 给mac app签名，执行前确保 mac app已经被编译
```
