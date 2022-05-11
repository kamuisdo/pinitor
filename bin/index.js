#!/usr/bin/env node
const { program } = require('commander');

const packageInfo = require('../package.json')
const initRollup = require('../script/rollup-initor/index')

// console.log(packageInfo.version)
// 设置版本
program.version(packageInfo.version,'-v, --vers', 'output the current version')

// 设置初始化工具类库项目的命令
program
    .command('rollup <name>')
    .description('init a rollup package project')
    .action((name) => {
        initRollup(name)
    });

program.parse(process.argv)