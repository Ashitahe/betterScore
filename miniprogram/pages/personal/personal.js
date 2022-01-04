// 引入年级信息
import {
    allGrade
} from '../../utils/baseData';
// 引入全局变量
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        gradeList: [...allGrade], // 年级列表
        gradeRadio: app.data.defaultGrade, // 选中的年级
        showGrade: app.data.defaultGrade,
        show: false,
    },
    showGradeSelector() {
        this.setData({
            show: true
        })
    },
    // 关闭底部弹窗
    onClose() {
        this.setData({
            show: false
        })
    },
    onConfirm() {
        this.setData({
            show: false,
            showGrade: this.data.gradeRadio
        })
        app.data.defaultGrade = this.data.gradeRadio
    },
    // 跳转到课程配置页面
    toCourse() {
        wx.navigateTo({
            url: '../courses/courses',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    }
})