const path = require('path');
console.log(__dirname, '__dirname>>>>')

// 自动引入打包后的js文件到index.html中 插件
const htmlPlugin = require('html-webpack-plugin');

// vue-loader插件 解析.vue格式文件
const { VueLoaderPlugin } = require("vue-loader")

//  将css提取打包到指定的文件中  ---去掉"style-loader", 
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 清理打包后的dist目录文件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//  将源文件拷贝到指定目录下面
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 引入webpack 定义全局变量
const webpack  =  require('webpack');

module.exports = {
    mode: 'development',
    entry: './src/main.js',  // 相对于根目录
    output: {
        path: path.join(__dirname, '../dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            // css加载器
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            //  less加载器   less  和less-loader 版本一定要注意  不然容易报错 
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
            // babel loader  
            //   Babel 是一个 JavaScript 编译器，它是一个工具链，主要的用途就是在旧的浏览器或环境中将ECMAScript 2015+ 代码转换为向后兼容的 js 代码。
            // 注意 这个地方也有版本问题 https://blog.csdn.net/weixin_46760658/article/details/105659556
            {
                test: /\.js$/,
                exclude: /node_modules/,   // 要排除 node_modules
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            // vue加载器
            {

                test: /\.vue$/,
                use: ["vue-loader"]
            },
            // 图片加载器 url-loader  可以设置图片小于多少kb为base64，否则再产出文件
            // 讲图片提取到固定文件夹下面

            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 1020,
                        //  超过1020k就将资源放到img/下面
                        name: "image/[name].[hash:7].[ext]"

                    }
                }
            }
        ]
    },
    // 1、source-map：产生文件，产生行列
    // devtool: 'source-map',
    // 2、eval-source-map：不产生文件，产生行类
    //devtool: 'eval-source-map',
    // 3、cheap-source-map：产生文件，不产生列
    //devtool: 'cheap-module-source-map',
    // 4、cheap-module-eval-source-map：不产生文件，不产生列
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        // webpack中提供了DefinePlugin插件，可以设置环境变量
        // 注意：定义的值 ''是变量的定义，不是字符串
        new webpack.DefinePlugin({
            DEV: JSON.stringify('development'), 
            flag: 'true', 
            calc: '1 + 1'     // main.js 直接打印calc 结果是2 
          }), 
        new htmlPlugin(
            {
                template: './public/index.html',
                fileName: 'index.html',
                hash: true,

            }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            //  打包后生成的文件名称
            filename: 'css/main.css',

        }),
        //  打包前删除dist老文件插件
        new CleanWebpackPlugin({
            //  要删除的目录
            outputPath: '../dist'
        }),
        //  从指定目录复制文件到目标目录
        new CopyWebpackPlugin(
            [
                {
                    //  将当前目录的questions 复制到dist下面
                    from: path.join(__dirname, "../src/question.js"),
                    to: path.join(__dirname, '../dist/copyFile')
                }
            ]

        )


    ],
    // devserver 
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
    resolve:{
//         // 实际使用的第三方模块，比如react，vue都是默认放在项目根目录的node_modules里，所以可以指明路径，减少查找。
//         modules:[path.resolve(__dirname,'node_modules')],
//         // 默认值是[".wasm",".mjs",".js",".json"]。
// // 如果导入的模块没有扩展名，webpack会根据resolve.extensions指定的扩展名一 一查找，谁在前就先查找谁，就像刚刚Node解析webpack-cli模块那样。
        extensions:['.js', '.css', '.json', '.vue'],
        alias:{
            "@": path.resolve('src')
        }
    }
}