// 初始化工具类库包
const fs = require('fs-extra')
const path = require('path')
const os = require('os')
const chalk = require('chalk')
const spawn = require('cross-spawn')

function getPinitorPath(){
    const result = spawn.sync('which', ['pinitor'], { encoding:'utf8' });
    if(result.error) {
        console.log(chalk.red(`ERROR: 获取命令位置失败，${result.stderr}`));
        process.exit(1)
    }
    const templatePath = path.resolve(result.stdout,'..','..','lib','node_modules','project-initor','script','rollup-initor','template')
    console.log("template path: ",templatePath)
    return templatePath
}

function start(name){
    // 检测目录是否存在，已经存在的话，报错返回
    const root = path.resolve(process.cwd(),name)
    if(fs.existsSync(root)){
        console.log(chalk.red(`ERROR: ${name} already exists`))
        process.exit(1)
    }
    // 创建目录
    fs.ensureDirSync(root)
    // 切换到root目录
    process.chdir(root)
    // 初始化写入package.json
    const packageJson = {
        "name": name,
        "version": "1.0.0",
        "description": "",
        "main": "dist/index.js",
        "module": "dist/index.es.js",
        "types": "dist/index.d.ts",
        "scripts": {
            "prepare": "husky install",
            "start": "rollup -c rollup.config.js -w",
            "test": "jest --coverage --config jest.config.js"
        },
        "author": "",
        "lint-staged": {
            "src/**/*": [
                "npx prettier --write src/"
            ]
        }
    }
    fs.writeFileSync(
        path.join(root, 'package.json'),
        JSON.stringify(packageJson, null, 2) + os.EOL
    );
    // 拷贝模板文件到root，写入README.md
    // 通过which pinitor找到本地命令代码的位置，从而确定template的位置
    const templatePath = getPinitorPath()
    fs.copySync(templatePath,root)
    fs.writeFileSync(
        path.join(root, 'README.md'),
        `#${name}`
    );
    console.log(chalk.green(`SUCCESS: folder init success`))
    // 执行npm安装命令
    const args = [
        'install',
        '--no-audit', // https://github.com/facebook/create-react-app/issues/11174
        '--save-dev',
        '--save-exact',
        '--loglevel',
        'error',
        'eslint',
        'eslint-config-prettier',
        'eslint-plugin-prettier',
        'prettier',
        'typescript',
        'lint-staged',
        'husky',
        'jest',
        '@types/jest',
        'babel-jest',
        '@babel/preset-typescript',
        '@babel/core',
        '@babel/preset-env',
        'rollup',
        'rollup-plugin-typescript2',
        '@rollup/plugin-eslint'
    ]
    const installResult = spawn.sync('npm', args, { stdio: 'inherit' });
    if(installResult.error) {
        console.log(chalk.red(`ERROR: package install failed`))
        process.exit(1)
    }
    console.log(chalk.green(`SUCCESS: package install success`))
    // 初始化git
    const gitResult = spawn.sync('git', ['init'], { stdio: 'inherit' });
    if(gitResult.error) {
        console.log(chalk.red(`ERROR: git init failed`))
        process.exit(1)
    }
    // 初始化husky
    const huskyInstallResult = spawn.sync('npx', ['husky','install'], { stdio: 'inherit' });
    const huskyResult = spawn.sync('npx', ['husky','add','.husky/pre-commit','"npx lint-staged"'], { stdio: 'inherit' });
    if(huskyResult.error || huskyInstallResult.error) {
        console.log(chalk.red(`ERROR: husky init failed`))
        process.exit(1)
    }
    console.log(chalk.green(`SUCCESS: husky init success`))

    console.log(chalk.green(`SUCCESS: git init success`))
}

module.exports = start