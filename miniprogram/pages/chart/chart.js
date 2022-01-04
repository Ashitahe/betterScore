// 引入echart插件
import * as echarts from '../../components/ec-canvas/echarts';
import {
  request
} from '../../utils/request';
// 引入年级信息
import {
  allGrade,
  allTerm
} from '../../utils/baseData';
// 图表数据
const radarIndicator = []
const radarData = []
const pieData = []
const barGot = []
const barTotal = []
const barX = []
const categoryData = []
const categoryX = []

const getRadarOptions = () => ({
  title: {
    text: '各科成绩雷达图',
    textStyle: {
      fontSize: 14
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  backgroundColor: "#ffffff",
  radar: {
    indicator: radarIndicator,
    shape: 'circle',
    radius: 60
  },
  series: [{
    name: '各科得分',
    type: 'radar',
    data: [{
      value: radarData
    }]
  }]
})

const getPieOptions = () => ({
  title: {
    text: '各科成绩与总分占比',
    textStyle: {
      fontSize: 14
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  backgroundColor: "#ffffff",
  legend: {
    top: 'bottom',
  },
  series: [{
    name: '得分',
    type: 'pie',
    radius: '50%',
    roseType: 'radius',
    itemStyle: {
      borderRadius: 2
    },
    label: {
      formatter: '{per|{d}%}',
      backgroundColor: '#F6F8FC',
      borderColor: '#8C8D8E',
      borderWidth: 1,
      borderRadius: 4,
      rich: {
        per: {
          color: '#fff',
          backgroundColor: '#4C5058',
          padding: [3, 4],
          borderRadius: 4
        }
      }
    },
    data: pieData
  }]
})

const getBarOptions = () => ({
  title: {
    text: '各科成绩对比',
    textStyle: {
      fontSize: 14
    },
    left: 'center'
  },
  backgroundColor: "#ffffff",
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top: 'bottom'
  },
  xAxis: {
    type: 'category',
    data: barX
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '总分',
    data: barTotal,
    type: 'bar'
  }, {
    name: '得分',
    data: barGot,
    type: 'bar'
  }]
})

const getCategoryOptions = () => ({
  title: {
    text: '本学期考试成绩折线图',
    textStyle: {
      fontSize: 14
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  backgroundColor: "#ffffff",
  xAxis: {
    type: 'category',
    data: categoryX
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: categoryData,
    type: 'line',
    markPoint: {
      data: [{
          type: 'max',
          name: 'Max'
        },
        {
          type: 'min',
          name: 'Min'
        }
      ]
    },
  }]
})
const app = getApp()
// 引入计算属性
const computedBehavior = require('miniprogram-computed').behavior;
Page({
  behaviors: [computedBehavior], // 使用计算属性
  /**
   * 页面的初始数据
   */
  data: {
    gradeList: [...allGrade], // 年级
    termList: [...allTerm], // 学期
    examList: [], // 考试列表
    showExamName: '', // 展示的考试名称
    showGrade: app.data.defaultGrade, // 展示的年级
    showTerm: '上学期', // 展示的学期
    gradeRadio: app.data.defaultGrade,
    termRadio: '上学期',
    showGradeSelect: false, // 年级选择框
    showExamSelect: false,
    showExamSelect: false,
    showChart: false,
    showIndicate: false,
    radarChart: {
      onInit(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(getRadarOptions());
        return chart;
      },
    },
    pieChart: {
      onInit(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(getPieOptions());
        return chart;
      },
    },
    barChart: {
      onInit(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(getBarOptions());
        return chart;
      },
    },
    categoryChart: {
      onInit(canvas, width, height, dpr) {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio: dpr // new
        });
        canvas.setChart(chart);
        chart.setOption(getCategoryOptions());
        return chart;
      },
    },
  },
  /**
   * 计算属性
   */
  computed: {
    // 考试名列表
    examNameList(data) {
      if (data.examList.length <= 0) return []
      return data.examList.map(item => item.examName)
    }
  },
  // 初始化图表数据
  initChartData() {
    radarIndicator.length = 0
    radarData.length = 0
    pieData.length = 0
    barX.length = 0
    barGot.length = 0
    barTotal.length = 0
    categoryX.length = 0
    categoryData.length = 0
  },
  // 更新图表
  setChartData(examName) {
    const target = this.data.examList.find(item => item.examName === examName)
    if (target === undefined) return
    // 更新数据前清空数据
    this.initChartData()
    // 更新数据
    target.course.forEach(item => {
      radarIndicator.push({
        name: item.name,
        max: item.total
      })
      radarData.push(item.score)
      pieData.push({
        value: item.score,
        name: item.name
      })
      barGot.push(item.score)
      barTotal.push(item.total)
      barX.push(item.name)
    })
    this.data.examList.forEach(item => {
      categoryX.push(item.examName)
      categoryData.push(item.score)
    })
    // 数据处理完才更新显示图表
    this.setData({
      showChart: true
    })
    return 0
  },
  // 关闭年级选择框
  onCloseGrade() {
    this.setData({
      showGradeSelect: false,
      showChart: true
    })
  },
  onConfirm() {
    this.setData({
      showGradeSelect: false,
      showTerm: this.data.termRadio,
      showGrade: this.data.gradeRadio
    })
    this.getExamRecord()
  },
  // 显示年级选择框
  handleGrade() {
    this.setData({
      showGradeSelect: true,
      showChart: false
    })
  },
  // 显示考试选择框
  handleExam() {
    if (this.data.examList.length <= 0) return
    this.setData({
      showExamSelect: true,
      showChart: false,
    })
  },
  onCloseExam() {
    this.setData({
      showExamSelect: false,
      showChart: true
    })
  },

  // 确认考试框
  onConfirmExam(event) {
    const examName = event.detail.value
    this.setData({
      showExamSelect: false,
      showExamName: examName
    })
    this.setChartData(examName)
  },
  // 处理考试记录
  dealRecord(list) {
    if (list.length <= 0) {
      this.setData({
        showIndicate: true
      })
      return
    }
    list = list.map(item => item.record)
    this.setData({
      examList: list,
      showExamName: list[0].examName
    })
    this.setChartData(list[0].examName)

  },
  // 获取该学期的所有考试记录
  async getExamRecord() {
    // 请求数据前清空所有数据
    this.initChartData()
    this.setData({
      examList: [],
      examNameList: [],
      showExamName: '',
      showChart: false
    })
    try {
      wx.showLoading({
        title: '加载中...',
      })
      const res = await request('findAll', {
        collectionName: 'scores',
        record: {
          grade: this.data.showGrade,
          term: this.data.showTerm,
        }
      })
      // 有数据才处理数据
      if (res.result.data.length > 0) this.dealRecord(res.result.data)
      wx.hideLoading()
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'error',
        success: wx.hideLoading
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    this.setData({
      showGrade: app.data.defaultGrade,
      gradeRadio: app.data.defaultGrade
    })
    this.getExamRecord()
  }
})