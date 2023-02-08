//  抽取公共配置文件

const path = require('path');

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

module.exports = {
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
    // devtool: 'cheap-module-eval-source-map',
    plugins: [
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
    optimization:{
        //  性能优化--将文件中的引入的公共的模块单独打包到js中

        // chunks:'all'-- 将文件中引入的nodemodules里面的公共包 单独打包到一个js中
        // splitChunk表示切割chunk模块，chunks的值如果是all，会将文件中引入的node_modules单独打包成一个chunk，也就是说如果我们文件中既引入了jquery，也引入了vue，此时webpack会将这两个打包到一起个chunk
        // 此时打包会多出一个vendor~main文件

        /** 
         * 
         *chunks: 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为async;推荐使用all
minSize: 表示在压缩前的最小模块大小，默认为0；
minChunks: 表示被引用次数，默认为1；
maxAsyncRequests: 最大的按需(异步)加载次数，默认为1；
maxInitialRequests: 最大的初始化加载次数，默认为1；
name: 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
cacheGroups: 缓存组。
缓存组是一个对象，其中包含上述其他参数，如果不额外配置，默认继承上面的选项。缓存组还包含其他只能在缓存组设置的参数。

priority: 表示缓存的优先级；
test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
reuseExistingChunk: 表示可以使用已经存在的块，即如果满足条件的块已经存在就使用已有的，不再创建一个新的块。

根据具体的需求，可以创建多个缓存组
         * 
         * 
         */
        splitChunks:{
            chunks: 'initial',
            maxAsyncRequests: 3,
            minSize: 1,
            name:true,
            cacheGroups: {
                //  生成的文件名称 vendors~XXXX
                vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10
                },
                default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        //         // 实际使用的第三方模块，比如react，vue都是默认放在项目根目录的node_modules里，所以可以指明路径，减少查找。
        //         modules:[path.resolve(__dirname,'node_modules')],
        //         // 默认值是[".wasm",".mjs",".js",".json"]。
        // // 如果导入的模块没有扩展名，webpack会根据resolve.extensions指定的扩展名一 一查找，谁在前就先查找谁，就像刚刚Node解析webpack-cli模块那样。
        extensions: ['.js', '.css', '.json', '.vue'],
        alias: {
            "@": path.resolve('src')
        }
    }
}