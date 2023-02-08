//  生产环境


const baseConfig =  require('./webpack.base.config');

const merge = require('webpack-merge');

let webpack = require('webpack');

// 合并基础配置扩展开发模式配置
module.exports = merge(baseConfig, {
    mode: 'production',
    plugins: [
        // 环境区分
        new webpack.DefinePlugin({
            ENV: JSON.stringify('procuction')
        }),
       
    ]
})
