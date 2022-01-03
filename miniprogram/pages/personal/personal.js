import {
    request
} from '../../utils/request';
// 引入年级信息
import {
    allGrade
} from '../../utils/baseData';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        gradeList: [...allGrade], // 年级列表
        termRadio: '一年级', // 选中的年级
        showTerm: '一年级',
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
            showTerm: this.data.termRadio
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow:function(){
        
    }
})