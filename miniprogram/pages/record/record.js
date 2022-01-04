// 引入通知函数
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
    request
} from '../../utils/request';
// 引入年级信息
import {
    allGrade,
    allTerm,
    defaultSubject
} from '../../utils/baseData';
// 引入全局变量
const app = getApp()
// 引入计算属性
const computedBehavior = require('miniprogram-computed').behavior;
Page({
    behaviors: [computedBehavior], // 使用计算属性
    /**
     * 页面的初始数据
     */
    data: {
        isNew: true, // 判断是否是新增数据
        showCircle: true, // 控制圆圈显示
        gradeList: [...allGrade], // 所有年级列表       
        termList: [...allTerm], // 所有学期列表
        gradeRadio: app.data.defaultGrade, // 年级选择框的值
        showGrade: app.data.defaultGrade, // 显示的年级值
        termRadio: '上学期', // 学期选择框的值
        showTerm: '上学期', // 显示的学期值
        examName: '', // 考试名称
        classRank: 1, // 在班级的排名
        gradeRank: 1, // 在年级的排名
        showGradeSelect: false, // 显示年级选择框
        showDateSelect: false, // 显示日期选择框
        examDate: new Date().getTime(), // 考试日期
        minDate: new Date(2010, 1, 1).getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            }
            if (type === 'month') {
                return `${value}月`;
            }
            return value;
        },
        // 科目信息
        course: [],
        // 控制可视化圆圈渐变色
        gradientColor: {
            '0%': '#9DF3C4',
            '100%': '#1FAB89',
        },
    },
    // 计算属性
    computed: {
        // 显示的考试时间
        showDate(data) {
            const date = new Date(data.examDate)
            const month = date.getMonth() + 1
            const day = date.getDate()
            const years = date.getFullYear()
            return `${years}-${month}-${day}`
        },
        // 总分
        totalScore(data) {
            return data.course.reduce((pre, item) => pre += item.total, 0)
        },
        // 获得的总分
        totalGetScore(data) {
            return data.course.reduce((pre, item) => {
                if (Number.isInteger(item.score)) {
                    pre += item.score
                }
                return pre
            }, 0)
        },
        // 百分比
        rate(data) {
            const total = data.totalScore
            const got = data.totalGetScore
            return (got / total) * 100
        },
        // 平均分
        averageScore(data) {
            return data.totalGetScore / data.course.length
        },
        // 最高分
        TopScore(data) {
            const scores = data.course.map(item => {
                if (Number.isInteger(item.score)) {
                    return item.score
                }
                return 0
            })
            return Math.max(...scores)
        },
        // 最低分
        LowerScore(data) {
            const scores = data.course.map(item => {
                if (Number.isInteger(item.score)) {
                    return item.score
                }
                return 0
            })
            return Math.min(...scores)
        },
    },
    // 输入分数时双向数据绑定
    handleInput(event) {
        // 获取当前输入的值
        const name = event.currentTarget.id
        let value = event.detail
        // 如果是空值则不再往下
        if (!!value) {
            value = value >>> 0
        }

        // 寻找匹配的值数据
        let {
            course
        } = this.data
        course = course.map(item => {
            if (item.name === name) {
                if (value <= item.total && value >= 0) {
                    item.score = value
                } else {
                    // 警告超过总分
                    Notify({
                        type: 'warning',
                        message: `不能超过总分${item.total}`
                    });
                    item.score = ''
                }
            }
            return item
        })
        // 重新赋值
        this.setData({
            course
        })
    },
    // 弹出日期选择框
    handleDate() {
        this.setData({
            showDateSelect: true,
            showCircle: false
        })
    },
    // 确认日期时的回调
    confirmDate(event) {
        this.setData({
            examDate: event.detail,
            showDateSelect: false,
            showCircle: true
        });
    },
    // 关闭年级选择弹出框
    onCloseGrade() {
        this.setData({
            showGradeSelect: false,
            showCircle: true
        })
    },
    onConfirm() {
        this.setData({
            showTerm: this.data.termRadio,
            showGrade: this.data.gradeRadio,
            showGradeSelect: false,
            showCircle: true
        })
        // 重新请求课程配置信息
        this.getCourse()
    },
    // 关闭日期选择弹出框
    onCloseDate() {
        this.setData({
            showDateSelect: false,
            showCircle: true
        })
    },
    // 点击年级的回调
    handleGrade() {
        this.setData({
            showGradeSelect: true,
            showCircle: false
        })
    },
    // 跳转到添加课程页面
    toCourses() {
        wx.navigateTo({
            url: '../courses/courses',
        })
    },
    // 检查输入的表单
    check() {
        // 检查考试名是否存在
        if (this.data.examName.trim() === '') {
            Toast('请输入考试名称!')
            return false
        }
        // 检查排名
        if (!!!this.data.classRank) {
            Toast('请输入班级排名!')
            return false
        }
        if (!!!this.data.gradeRank) {
            Toast('请输入年级排名!')
            return false
        }
        if (Number.isNaN(parseInt(this.data.classRank))) {
            Toast('班级排名必须为整数!')
            return false
        }
        if (Number.isNaN(parseInt(this.data.gradeRank))) {
            Toast('班级排名必须为整数!')
            return false
        }
        this.setData({
            gradeRank: this.data.gradeRank >>> 0,
            classRank: this.data.classRank >>> 0
        })
        return true
    },
    // 重置数据
    resetData() {
        this.setData({
            gradeRadio: '一年级', // 年级选择框的值
            showGrade: '一年级', // 显示的年级值
            termRadio: '上学期', // 学期选择框的值
            showTerm: '上学期', // 显示的学期值
            examName: '', // 考试名称
            classRank: 1, // 在班级的排名
            gradeRank: 1, // 在年级的排名
        })
    },
    // 添加记录信息
    async saveRecord() {
        // 检查输入
        if (!this.check()) return
        // 成绩记录表字段
        const record = {
            grade: this.data.showGrade,
            term: this.data.showTerm,
            examName: this.data.examName,
            examDate: this.data.examDate,
            formatDate: this.data.showDate,
            classRank: this.data.classRank,
            gradeRank: this.data.gradeRank,
            course: this.data.course,
            score: this.data.totalGetScore, // 获得总分
            rate: this.data.rate,
            averageScore: this.data.averageScore // 获得的平均分
        }
        try {
            wx.showLoading()
            // 如果是更新则更新
            if (this.hasOwnProperty('examId')) {
                await request('update', {
                    collectionName: 'scores',
                    record,
                    _id: this.examId
                })
            } else {
                await request('add', {
                    collectionName: 'scores',
                    record
                })
            }
            wx.hideLoading()
            // 保存后重置信息
            this.resetData()
            this.getCourse()
            wx.showToast({
                title: '保存成功',
                icon: 'success'
            })
        } catch (error) {
            wx.showToast({
                title: '保存失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 查找用户信息
    async findAllRecord() {
        try {
            wx.showLoading({
                title: '加载中...',
            })
            const params = {
                collectionName: 'scores',
            }
            const res = await request('findAll', params)
            wx.hideLoading()
        } catch (error) {
            wx.showToast({
                title: '操作失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 获取当前科目信息
    async getCourse() {
        // 构造参数
        const params = {
            collectionName: 'gradeSubject',
            grade: this.data.showGrade,
            term: this.data.showTerm
        }
        try {
            wx.showLoading({
                title: '加载中...',
            })
            const res = await request('findAll', params)
            if (res.result.data.length > 0) {
                this.setData({
                    course: res.result.data[0].course
                })
            } else {
                this.setData({
                    course: defaultSubject
                })
            }
            wx.hideLoading()
        } catch (error) {
            wx.showToast({
                title: '操作失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 获取本条考试信息
    async getEaxmInfo(_id) {
        try {
            const res = await request('findOne', {
                collectionName: 'scores',
                _id
            })
            const {
                result
            } = res
            this.setData({
                isNew: false,
                classRank: result.data.record.classRank,
                gradeRank: result.data.record.classRank,
                examName: result.data.record.examName,
                examDate: result.data.record.examDate,
                course: result.data.record.course,
                showGrade: result.data.record.grade,
                showTerm: result.data.record.term
            })
        } catch (error) {
            wx.showToast({
                title: '加载失败',
                icon: 'error'
            })
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 请求特定数据
        if (options.hasOwnProperty('_id')) {
            this.examId = options._id
            this.getEaxmInfo(this.examId)
        } else {
            this.resetData()
            this.setData({
                isNew: true
            })
            this.getCourse()
        }
        console.log(app);
        console.log('默认年级', app.data.defaultGrade);
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
        this.setData({
            gradeRadio: app.data.defaultGrade,
            showGrade: app.data.defaultGrade
        })
        this.getCourse()
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})