// page/personalCenter/personalCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 用户信息
     userinfo:{},
    if_login:false,
     //用户账户总余额
     totalBalance:0,
     //用户账户
    account:[]
  },

  login(){
    wx.getUserProfile({
      desc:"获取用户信息"
    })
    .then(res=>{
      var data=res.userInfo;
      this.setData({
        userinfo:data,
        if_login:true
      })
    })
  },

  exit(){
    this.setData({
      if_login:false
    })
  },

  onGoUserInfo: function(event){
    wx.showLoading({
      title: '登录中',
    })
    this.setData({
      userinfo:event.detail.userInfo
    })

    const that = this
    wx.cloud.callFunction({
      name:"login",

      success:res=>{
        that.setData({
          openid:res.result.openid,
          userinfo:event.detail.userInfo
        })
        that.data.userinfo.openid = that.data.openid
        wx.setStorageSync('openid', that.data.openid)
        wx.setStorageSync('userinfo', that.data.userinfo)
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '登录成功',
        })
      },
      fail:res=>{
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '登录失败',
          icon:'error'
        })
      }
    })
  },

  // 跳转到账户编辑界面
  goToEditAccount: function (event) {
    wx.navigateTo({
      url: '../editAccount/editAccount?accountid='+ event.target.dataset.accountid +
      '&accountname=' + event.target.dataset.accountname +
      '&accountbalance=' + event.target.dataset.accountbalance
    })
  },

  //跳转到添加账户界面
  gotoaddaccount: function () {
    wx.navigateTo({
      url: '../addaccount/addcount'
    })
  },

//获取账户列表
getaccount: function () {
    wx.cloud.database().collection('account').get()
    .then(res =>{
      this.setData({
        account:res.data
      })

      //计算总余额
      var total = 0
      for(var i = 0;i <this.data.account.length;i++){
        var tmp = Number(this.data.account[i].accountbalance)
        total = total + tmp
      }
      this.setData({
        totalBalance:total
      })
  }).catch(res =>{})
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
    this.getaccount()
    this.setData({
      userinfo:wx.getStorageSync('userinfo'),
      openid:wx.getStorageSync('openid')
    })
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