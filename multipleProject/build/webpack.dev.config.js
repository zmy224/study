//  dev 环境
const baseConfig =  require('./webpack.base.config');

const path = require('path');
// 自动引入打包后的js文件到index.html中 插件
const htmlPlugin = require('html-webpack-plugin');

// vue-loader插件 解析.vue格式文件
const { VueLoaderPlugin } = require("vue-loader")

//  将css提取打包到指定的文件中  ---去掉"style-loader", 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')



// 引入webpack 定义全局变量
const webpack  =  require('webpack');

const merge = require('webpack-merge');



// 合并基础配置扩展开发模式配置
module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    //
    devServer: {
        // 启动后访问目录，默认是项目根目录，这个设置到打包后目录
        contentBase: path.join(__dirname, '../dist'),// 控制根目录路径项目启动展示的页面  
        // 端口，默认8080
        port: '8099',
        open: true,
        progress: true

    },
    watch: true, // 在webpack中可以配置watch监听器时时打包,监听文件变更就打包
    watchOptions: {
        poll: 1000, // 每秒询问多少次
        aggregateTimeout: 500,  //防抖 多少毫秒后再次触发
        ignored: /node_modules/ //忽略时时监听
    },
    plugins: [
        // 环境区分
        new webpack.DefinePlugin({
            ENV: JSON.stringify('development')
        }),
       
    ]
})
