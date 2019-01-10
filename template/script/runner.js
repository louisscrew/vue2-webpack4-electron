const path = require('path');//引用path模块

const config = require('../config');
const utils = require("../build/utils.js");
const electron = require('electron');
const childProcess = require('child_process');
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const webpackDevConfig = require("../build/webpack.dev.config.js");

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;


//启动
function startVue(){
	return new Promise((resolve, reject) => {
    	//为了启动热部署额外添加的配置
		let hostStr = `http://${config.dev.host}:${config.dev.port}/`;
		webpackDevConfig.entry.build.unshift("webpack-dev-server/client?"+hostStr);
    	const compiler = webpack(webpackDevConfig);
		

		compiler.plugin('done', stats => {
			utils.logStats(stats ,'yellow','Renderer');
		});

		//创建server实例
		const server = new WebpackDevServer(
			compiler,
			{
				contentBase: false,
				quiet: true,
				setup (app, ctx) {
					resolve()
				}
			}
		)

    	server.listen(config.dev.port,config.dev.host, function(err) {
			if (err) {
				utils.logStats(stats ,'red','Renderer');
			}
		});
	})	
}


//启动electron
function startElectron(){
	electronProcess = childProcess.spawn(electron, ['.','--development']);
	electronProcess.stdout.on('data', data => {
    	utils.logStats(data, 'blue');
  	});
  	electronProcess.stderr.on('data', data => {
    	utils.logStats(data, 'red');
  	});
  	electronProcess.on('close', () => {
		if (!manualRestart) {
			process.exit();
		}
  	});
}
//执行
function run () {
	Promise.all([startVue()])
	.then(() => {
		startElectron();
	})
    .catch(err => {
      	console.error(err)
    })
}


run();