import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
// 引入年级、课程信息
import {
    allGrade,
    allTerm,
    defaultSubject
} from '../../utils/baseData';
import {
    request
} from '../../utils/request';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        gradeList: [...allGrade], // 能够选择年级列表
        gradeRadio: '一年级', // 选择的年级
        termRadio: '上学期', // 选择的学期
        showGrade: '一年级', // 显示的年级
        showTerm: '上学期', // 显示的学期
        showGradeSelect: false, // 显示年级选择框
        termList: [...allTerm], // 所有学期列表
        course: [], // 默认课程信息
        showAddSubject: false, // 添加科目弹出框
        addSubjectName: '', // 新增的科目名称
    },
    // 控制科目添加弹出框
    handleAdd() {
        this.setData({
            showAddSubject: true
        })
    },
    // 添加科目
    confirm() {
        // 检查输入的文字是否为空值
        const inputValue = this.data.addSubjectName
        if (inputValue.trim() === '') {
            Toast('添加失败,科目名称不能为空值');
            this.setData({
                addSubjectName: ''
            })
            return
        }

        const course = this.data.course
        // 检查输入值是否重复
        const isRepeat = course.some(item => item.name === inputValue)
        if (isRepeat) {
            Toast('添加失败,科目名称不能重复');
            this.setData({
                addSubjectName: ''
            })
            return
        }
        course.push({
            name: inputValue,
            score: '',
            total: ''
        })
        this.setData({
            course,
            addSubjectName: ''
        })
    },
    // 取消添加
    cancel() {
        this.setData({
            addSubjectName: ''
        })
    },
    // 删除科目
    onDelete(event) {
        console.log(event);
        const index = event.currentTarget.dataset.index
        const course = this.data.course
        course.splice(index, 1)
        this.setData({
            course
        })
    },
    // 用户修改科目总分数据时的回调，双向数据绑定
    onInput(event) {
        console.log(event.detail);
        // 对输入值进行检查
        let value = event.detail
        // 如果是空值则不再往下
        if (!!value) {
            value = value >>> 0
        }
        const flag = event.currentTarget.id
        // 找到对应的科目并修改
        let course = this.data.course
        course = course.map(item => {
            if (item.name === flag) {
                item.total = value
            }
            return item
        })
        this.setData({
            course
        })
    },
    // 点击年级的回调
    handleGrade() {
        this.setData({
            showGradeSelect: true
        })
    },
    // 关闭年级选择弹出框
    onCloseGrade() {
        this.setData({
            showGradeSelect: false
        })
    },
    onConfirm() {
        this.setData({
            showGradeSelect: false,
            showGrade: this.data.gradeRadio,
            showTerm: this.data.termRadio
        })
        this.getCourse()
    },
    // 保存填写的学期科目信息
    async handleSave() {
        // 检查课程中是否有空值，有则禁止提交
        const subject = this.data.course
        const hasNull = subject.some(item => item.total === '')
        if (hasNull) {
            Toast('总分不能为空')
            return
        }
        // 发送请求
        try {
            wx.showLoading({
                title: '更新中...',
            })
            if (!this.hasOwnProperty('_id')) {
                const res = await request('add', {
                    collectionName: 'gradeSubject',
                    grade: this.data.showGrade,
                    term: this.data.showTerm,
                    course: this.data.course
                })
            } else {
                const res = await request('update', {
                    collectionName: 'gradeSubject',
                    _id: this._id,
                    grade: this.data.showGrade,
                    term: this.data.showTerm,
                    course: this.data.course
                })
            }
            wx.hideLoading()
            wx.showToast({
                title: '更新成功',
                icon: 'success'
            })
        } catch (error) {
            wx.showToast({
                title: '更新失败',
                icon: 'error',
                success: wx.hideLoading
            })
        }
    },
    // 获取选择学期的科目的信息
    async getCourse() {
        // 构造参数
        const params = {
            collectionName: 'gradeSubject',
            grade: this.data.showGrade,
            term: this.data.showTerm
        }
        try {
            wx.showLoading({
                title: '加载中...'
            })
            const res = await request('findAll', params)
            if (res.result.data.length > 0) {
                this._id = res.result.data[0]._id
                console.log('request', this._id);
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
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCourse()
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