# 中小学生个人成绩记录分析系统

采用`vant weapp` 组件库开发，基于微信小程序原生云开发搭建后台数据库

该程序提供可视化数据分析每次考试成绩

**启动本项目前请先上传云函数并在数据库创建`score`、`gradeSubject`文档集合**

## 在线demo

在微信中扫描下面二维码即可体验：

![gh_1f3f2ef697f1_258](https://i0.hdslb.com/bfs/album/3c8265f176872b2676d71954b2ac30090a32cf15.jpg)

## npm依赖

```sh
// vantUI
npm install @vant/weapp
// 计算属性
npm install miniprogram-computed
```

## 插件

[小程序版`echarts`](https://github.com/ecomfe/echarts-for-weixin)。若打包的小程序过大，请[在线构建`echarts`](https://echarts.apache.org/zh/builder.html)以减小体积。仅需将在线构建的`echarts.js`替换`ec-canvas`组件下的`echarts.js`既可

`echarts`构建配置

* 图表：柱状图、折线图、饼图、雷达图，
* 坐标系：直角坐标系
* 组件：标题、图例、提示框、标注

