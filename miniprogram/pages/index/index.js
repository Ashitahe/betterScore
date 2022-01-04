import {
    request
} from '../../utils/request';
// 引入年级信息
import {
    allGrade
} from '../../utils/baseData';
const gradeList = [{
    name: '全部'
}, ...allGrade]
Page({
    /**
     * 页面的初始数据
     */
    data: {
        show: false, // 控制底部弹窗
        radio: '全部', // 底部弹框选择的值
        showRadio: '全部', // 用来展示的选择值
        gradeList: [...gradeList], // 选择框的年级列表
        showGrade: [], // 获取到的数据的年级列表
        recordList: [], // 查找到的所有成绩记录列表
        showRecordList: [], // 按年级分类好的成绩列表
        dialogData: {}, // 考试详情的数据
        showScore: false, // 查看考试详细情况弹出框
    },
    // 编辑考试成绩
    toEdit(event) {
        const _id = event.currentTarget.dataset.id
        console.log(_id);
        wx.reLaunch({
            url: `../record/record?_id=${_id}`,
        })
    },
    // 删除考试成绩
    async toDelete(event) {
        const _id = event.currentTarget.dataset.id
        try {
            const res = await request('removeOne', {
                collectionName: 'scores',
                _id
            })
            this.findRecord()
        } catch (error) {
            wx.showToast({
                title: '删除失败',
                icon: 'error'
            })
        }
    },
    // 对比成绩
    compareScore() {
        wx.navigateTo({
            url: '../compare/compare',
        })
    },
    // 显示考试成绩弹出框
    showDialog(event) {
        const flag = event.currentTarget.dataset.id
        // 查找到对应成绩的数据
        const showData = this.data.recordList
        const data = showData.find(item => item._id === flag)
        // 显示考试成绩框
        this.setData({
            showScore: true,
            dialogData: data.record
        })
    },
    // 控制底部弹窗
    handleShow() {
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
    // 查找用户信息
    async findRecord() {
        // 获取当前选中的值
        const grade = this.data.radio
        // 构造查询参数
        let params = {
            collectionName: 'scores'
        }
        if (grade !== '全部') {
            params = {
                collectionName: 'scores', // 查找的表
                record: {
                    grade
                }
            }
        }
        wx.showLoading({
            title: '加载中',
        })
        try {
            const res = await request('findAll', params)
            this.setData({
                showRadio: grade,
                recordList: res.result.data,
                show: false
            })
            // 对年级进行分类
            this.sortAll()
            wx.hideLoading()
        } catch (error) {
            wx.showToast({
                title: '操作失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 总分类列表
    sortAll() {
        // 获取查询到的所有年级
        const list = this.data.recordList
        // 拿到所有年级
        const gradeSet = new Set()
        list.forEach(item => gradeSet.add(item.record.grade))
        const Iteraltor = gradeSet.values()
        let flag = true
        let arr = []
        while (flag) {
            flag = Iteraltor.next().value
            if (flag) {
                arr.push(flag)
            } else {
                flag = false
            }
        }

        // 获取到所有查询到的年级列表
        arr = arr.map(item => {
            const childen = this.sortGrade(item)
            return {
                grade: item,
                recordList: childen
            }
        })
        // 分类好的数组
        this.setData({
            showRecordList: arr
        })
    },

    // 按年级分类数组
    sortGrade(grade) {
        let list = this.data.recordList
        // 按年级分类整理查询结果
        return list = list.filter(item => item.record.grade === grade)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        this.findRecord()
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