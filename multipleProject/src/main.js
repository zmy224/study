//  引入css
import './common/stylecommon.css'
// 引入less
import './common/stylecommonless.less';
// @babel/polyfill  polyfill的本质就是通过ES5甚至ES3的代码来实现新的特性
// import '@babel/polyfill';

import "./test.js"
import "./test1.js"
import { createApp } from 'vue'

import App from './App.vue'

createApp(App).mount('#app')

import  {  add } from "./utils/index";
add(5,6);
let arry = [1, 2, 3];
console.log(ENV,'00000000000000000');

let reg = /^[\d\+a-zA-Z%\.\-]{1,22}$/s;

console.log(reg.test('5-7.9%'),'>>>>>>>>>>>')


function formatKey(content) {
    let reg = /最高\d+万?元|最长\d+个?(月|年)/g;
  
    let newStr= content;
    if (reg.test(content)) {
        // content = content.replace(
        //     reg,
        //     `<span class='format-keywords'>${content}</span>`
        // );
        newStr =  str.replace(reg,function(item){
            return `<span style="color:red">${item}</span>`
        })
        console.log(1111111111111,newStr,'????/////')

    }
    return  newStr;
}

let  str="hdsd最长30年,最高20万元";
formatKey(str)

