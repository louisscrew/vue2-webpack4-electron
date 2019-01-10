const webpack = require('webpack');
const path = require('path');
const config = require('../config');
// vue-loader 插件
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// html插件
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 使用happypack
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });


function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
		build: ['babel-polyfill','./src/render/index.js']
	},
    output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: config.dev.assetsPublicPath
	},
    resolve: {
		modules: [
			"node_modules",
			resolve('src')
		],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
			'jquery': 'lib/jquery/jquery.min.js',
			'webuploader': 'lib/uploader/webuploader.js'//上传插件
		},
		extensions: ['.js', '.vue', '.json']
	},
	module: {
        rules: [
            {
                test: /\.js$/,
                //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
                loader: 'happypack/loader?id=happyBabel',
                //排除node_modules 目录下的文件
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
		new HappyPack({
			//用id来标识 happypack处理那里类文件
			id: 'happyBabel',
			//如何处理  用法和loader 的配置一样
			loaders: [{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
			}],
			//共享进程池
			threadPool: happyThreadPool,
			//允许 HappyPack 输出日志
			verbose: true,
		}),
        // 解决vender后面的hash每次都改变
        new webpack.HashedModuleIdsPlugin(),
		//处理html
		new HtmlWebpackPlugin({
			filename: config.build.index,
			template: './src/render/index.html'
		})
	]
}
