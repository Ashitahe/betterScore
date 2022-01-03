import * as echarts from '../../components/ec-canvas/echarts';
import {
    request
} from '../../utils/request';
// 引入年级信息
import {
    allGrade
} from '../../utils/baseData';
const barX = []
const barData = []
const categoryData = []
const categoryX = []
const getBarOptions = () => ({
    title: {
        text: '每次考试各科成绩对比',
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
    series: barData
})
const getCategoryOptions = () => ({
    title: {
        text: '本学年考试成绩折线图',
        textStyle: {
            fontSize: 14
        },
        left: 'center'
    },
    legend: {
        top: 'bottom'
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
    series: categoryData
})
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false, // 控制底部弹窗
        gradeRadio: '一年级', // 底部弹框选择的值
        showGrade: '一年级', // 用来展示的选择值
        gradeList: [...allGrade], // 选择框的年级列表
        recordList: [],
        showChart: false,
        barChart: {
            onInit(canvas, width, height, dpr) {
                const chart = echarts.init(canvas, null, {
                    width: width,
                    height: height,
                    devicePixelRatio: dpr // new
                });
                canvas.setChart(chart);
                chart.setOption(getBarOptions());
                console.log(chart);
                return chart;
            }
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
        }
    },
    // 控制底部弹窗
    handleShow() {
        this.setData({
            show: true,
            showChart: false
        })
    },
    // 关闭底部弹窗
    onClose() {
        this.setData({
            show: false,
            showChart: true
        })
    },
    // 查找用户信息
    async findRecord() {
        // 获取当前选中的值
        const grade = this.data.gradeRadio
        // 构造查询参数
        let params = {
            collectionName: 'scores',
            record: {
                grade
            }
        }
        try {
            wx.showLoading({
                title: '加载中...',
            })
            const res = await request('findAll', params)
            this.setData({
                showGrade: grade,
                recordList: res.result.data,
                show: false
            })
            this.updateCharts(res.result.data)
            wx.hideLoading()
        } catch (error) {
            wx.showToast({
                title: '操作失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 更新图表
    updateCharts(recordList) {
        if (recordList.length <= 0) return
        recordList = recordList.map(item => item.record)
        categoryX.length = 0
        categoryData.length = 0
        barX.length = 0
        barData.length = 0
        recordList.forEach((item, idx) => {
            // 装填折线图数据
            let courseData = []
            item.course.forEach(e => {
                courseData.push(e.score)
                if (idx === 0) {
                    categoryX.push(e.name)
                    barX.push(e.name)
                }
            })
            categoryData.push({
                name: item.examName,
                data: courseData,
                type: 'line'
            })
            barData.push({
                name: item.examName,
                data: courseData,
                type: 'bar'
            })
        })
        this.setData({
            showChart: true
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.findRecord()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    }
})