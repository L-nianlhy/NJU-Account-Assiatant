// page/recordList/recordList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    useinfo:{},
    record:[]
  },
// 跳转到记账编辑界面
goToEditrecord: function (event) {
  wx.navigateTo({
    url: '../editrecord/editrecord?recordid='+ event.target.dataset.recordid
  })
},

//获取记账列表
getrecord: function () {
  wx.cloud.database().collection('record').orderBy('recorddata','desc').get()
  .then(res =>{
    this.setData({
      record:res.data
    })
}).catch(res =>{})
},

//跳转到记账界面
gotoaddrecord: function () {
  wx.navigateTo({
    url: '../addrecord/addrecord'
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
    this.getrecord()
    this.setData({
      openid:wx.getStorageSync('openid'),
      useinfo:wx.getStorageSync('userinfo')
    });
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