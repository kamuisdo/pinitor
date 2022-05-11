# Project Initor

### install
```
npm i pinitor -g
```

### rollup initor
用于初始化基于rollup.js的工具类库，包含以下特性<br/>
- 支持typescript开发的项目
- 支持配置了typescript的ESlint
- 支持配置了typescript的单位测试Jest
- 编译结果包含common.js、ES Module、UMD模块加载方式
- Prettirer格式化，配合husky、lint-staged

初始化项目
```
pinitor rollup <project-name>
```