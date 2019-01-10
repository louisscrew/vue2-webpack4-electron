'use strict'
const path = require('path');
const config = require('../config');
const chalk = require('chalk');
const rootPath = path.join(__dirname, '..');
const tempAppFoloder = path.join(rootPath, 'tmpdir');
const svnDir = path.join(rootPath, '.svn');
const outFoloder = path.join(rootPath, 'out');
const buildDir = path.join(rootPath, 'build');
const scriptDir = path.join(rootPath, 'script');
const vueSrcDir = path.join(rootPath, 'src/render');

//取消空格
String.prototype.trim = function () {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}

//项目根目录
exports.rootPath = rootPath;
//临时文件夹目录
exports.tempAppFoloder = tempAppFoloder;
//可执行程序输出目录
exports.outFoloder = outFoloder;


exports.assetsPath = function (_path) {
	const assetsSubDirectory = process.env.NODE_ENV === 'production'
		? config.build.assetsSubDirectory
		: config.dev.assetsSubDirectory

	return path.posix.join(assetsSubDirectory, _path)
}

//打印electron日志
function electronLog(data, color) {
	logStats(data, color, "Electron");
}
exports.electronLog = electronLog;




//vue 日志
function logStats(data, color = 'white', proc = '') {
	let logArray = [];
	//综合日志
	if (typeof data === 'object') {
		let isBuffer = false;
		if (Buffer.isBuffer(data) == true) {
			data = data.toString();
			isBuffer = true;
		} else {
			data = data.toString({
				colors: true,
				chunks: false
			});
		}
		data.split(/\r?\n/).forEach(line => {
			
			if(line && line.length > 0){
				if (line.trim().length > 0) {
					let tempLog = line.trim();
					if(isBuffer===true){
						tempLog = chalk[color](tempLog);
					}
					logArray.push('  ' + tempLog + '\n');
				}
			}
		})
	} else {
		logArray.push(`  ${chalk[color](data)}\n`);
	}
	if (proc != undefined && proc.length > 0) {
		//插入头
		logArray.unshift(chalk['yellow'].bold(`┏ ${proc} Process ${new Array((99 - proc.length) + 1).join('-')} \n\n`));
		//插入尾巴
		logArray.push('\n' + chalk['yellow'].bold(`┗ ${new Array(108 + 1).join('-')}`) + '\n');
	}
	console.log(logArray.join(""))
}
exports.logStats = logStats;











//输入系统日志
function systemLog(data, color) {
	logStats(data, color);
}
exports.systemLog = systemLog;





const fs = require('fs-extra');//文件扩展方法
const rimraf = require('rimraf');//删除文件的工具
//删除目录的方法
function deleteDir(dirPath) {
	return new Promise((resolve, reject) => {
		logStats(`start delete ${dirPath}`, 'yellow');
		if (fs.existsSync(dirPath) === true) {
			fs.chmodSync(dirPath, 0o777);
			rimraf(dirPath, (error1) => {
				if (error1) {
					reject(error1);
				} else {
					logStats(`${dirPath} is deleted`, 'yellow');
					resolve();
				}
			})
		} else {
			logStats(`warning : ${dirPath} is not exists`, 'gray');
			resolve();
		}
	});
}
exports.deleteDir = deleteDir;





//创建临时目录
exports.createTempDir = function () {
	//创建文件夹
	return new Promise((resolve, reject) => {
		logStats(`start create tempDir...`, 'yellow');
		try {
			fs.ensureDirSync(tempAppFoloder);
			//拷贝文件
			fs.copySync(rootPath, tempAppFoloder, {
				filter: function (src, dest) {
					if (src.indexOf(svnDir) != -1) {
						return false;
					}
					if (src.indexOf(outFoloder) != -1) {
						return false;
					}
					if (src.indexOf(tempAppFoloder) != -1) {
						return false;
					}
					if (src.indexOf(buildDir) != -1) {
						return false;
					}
					if (src.indexOf(vueSrcDir) != -1) {
						return false;
					}
					return true;
				}
			});
			logStats(`TempDir directory created successfully`, 'yellow');
			resolve();
		} catch (err) {
			logStats(err, 'red')
			reject(err);
		}
	});
}

//删除临时文件夹
exports.deleteTempDir = function () {
	return deleteDir(tempAppFoloder);
}





const mkdirp =  require('mkdirp');
//创建目录
exports.mkDir = function (dir) {
	return new Promise((resolve, reject) => {
        mkdirp(dir, (error) => {
            error ? reject(error) : resolve()
        });
    });
}