// pages/addaccount/addcount.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    balance:0,
    nameremind:"请输入账户名称",
    balanceremind:"请输入账户余额"
  },
// 添加账户
addaccount: async function () {
  var accountname = this.data.name
  var accountbalance = this.data.balance
  var accountIsNull = true;
  if(accountname===""){
    wx.showToast({
      title: '账户名不应为空',
      icon:'error'
    })
    return;
  }
  if(isNaN(accountbalance)){
    wx.showToast({
      title: '金额应该是数字',
      icon:'error'
    })
    return;
  }
  await db.collection('account').where({
    accountname:accountname
  }).get().then((res)=>{
    if(res.data.length!==0){
      accountIsNull=false
      return
    }
  })
  if(!accountIsNull){
    wx.showToast({
      title: '已有同名账户',
      icon:'error'
    })
    return;
  }
  wx.showLoading({
    title: '添加中',
  })
  wx.cloud.database().collection('account').add({
    data:{
      accountname:accountname,
      accountbalance:accountbalance
    },
    success:res=>{
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '添加成功',
          })
        },
      })
      wx.navigateBack({
        delta:1
      })
    },
    fail:res=>{
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '添加失败',
            icon:'error'
          })
        },
      })
    }
  })
},

// 获取输入
oninputname:function (event) {
  this.setData({
    name:event.detail.value
  })
},
oninputbalance:function (event) {
  this.setData({
    balance:event.detail.value
  })
},
// 提示内容
  onfocusname: function (e) {
    this.setData({
      nameremind:""
    })
  },
  onblurname: function (e) {
    this.setData({
      nameremind:"请输入账户名称"
    })
  },
  onfocusbalance: function (e) {
    this.setData({
      balanceremind:""
    })
  },
  onblurbalance: function (e) {
    this.setData({
      balanceremind:"请输入账户余额"
    })
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