const date = new Date()
const years = []
const months = []
const days = []
const outtype = ["早饭", "午饭", "晚饭", "零食", "饮料酒水", "购物", "交通", "教育", "娱乐", "红包礼物", "水电费", "网费", "话费", "医疗", "投资", "其他"]
const intype = ["工资", "投资收入", "红包", "借入", "二手闲置", "其他"]
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}


// pages/addrecord/addrecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    useinfo: {},
    account: [],
    accountid: "",
    accountName: "",
    oldaccountid: "",
    accountbalance: 0,
    ios: [{
        value: "out",
        name: "支出",
        checked: "true"
      },
      {
        value: "in",
        name: "收入",
      }
    ],
    io: "out",
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 1,
    days: days,
    day: 1,
    datavalue: [9999, 0, 0],
    messageremind: "请输入备注，默认为无",
    balanceremind: "请输入记账金额",
    balance: 0,
    types: outtype,
    type: "早饭",
    message: "无",
  },


  //获取账户列表
  getaccount: function () {
    wx.cloud.database().collection('account').get()
      .then(res => {
        this.setData({
          account: res.data,
          accountid: res.data[0]._id,
          accountbalance: res.data[0].accountbalance,
          accountName: res.data[0].accountname
        })
      }).catch(res => {})
  },

  // 获取输入
  iochange: function (e) {
    this.setData({
      io: e.detail.value,
    })
    if (e.detail.value == "in") {
      this.setData({
        types: intype,
        type: "工资"
      })
    } else {
      this.setData({
        types: outtype,
        type: "早餐"
      })
    }
  },

  accountChange: function (e) {
    const val = e.detail.value
    this.setData({
      accountid: this.data.account[val]._id,
      accountbalance: this.data.account[val].accountbalance,
      accountName: this.data.account[val].accountname
    })
  },

  typeChange: function (e) {
    const val = e.detail.value
    this.setData({
      type: this.data.types[val],
    })
  },

  dataChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  oninputmessage: function (event) {
    this.setData({
      message: event.detail.value
    })
  },
  oninputbalance: function (event) {
    this.setData({
      balance: event.detail.value
    })
  },
  // 提示内容
  onfocusmessage: function (e) {
    this.setData({
      messageremind: ""
    })
  },
  onblurmessage: function (e) {
    this.setData({
      messageremind: "请输入备注，默认为无"
    })
  },
  onfocusbalance: function (e) {
    this.setData({
      balanceremind: ""
    })
  },
  onblurbalance: function (e) {
    this.setData({
      balanceremind: "请输入记账金额"
    })
  },

  //添加记账
  addrecord: function () {
    var recordaccountid = this.data.accountid
    var recordaccountname = this.data.accountName
    var recordyear = this.data.year
    var recordmonth = this.data.month
    var recordday = this.data.day
    var recordtype = this.data.type
    var recordbalance = (this.data.io == "in") ? this.data.balance : -this.data.balance
    var recordmessage = this.data.message
    var recorddata = String(recordyear) + "-" + (String(recordmonth).length == 1 ? ("0" + String(recordmonth)) : String(recordmonth)) + "-" + (String(recordday).length == 1 ? ("0" + String(recordday)) : String(recordday))
    if (recordaccountid === "") {
      wx.showToast({
        title: '请先创建账户',
        icon: 'error'
      })
      return;
    }
    if (isNaN(recordbalance)) {
      wx.showToast({
        title: '金额应该是数字',
        icon: 'error'
      })
      return;
    }
    wx.showLoading({
      title: '添加中',
    })
    wx.cloud.database().collection('record').add({
      data: {
        recordaccountid: recordaccountid,
        recorddata: recorddata,
        recordtype: recordtype,
        recordbalance: recordbalance,
        recordmessage: recordmessage,
        recordaccountname: recordaccountname
      },
      success: res => {
        var newbalance = Number(this.data.accountbalance) + Number(recordbalance)
        wx.cloud.database().collection('account').doc(this.data.accountid).update({
          data: {
            accountbalance: newbalance
          },
          success: res => {},
          fail: res => {},
        })
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '添加成功',
            })
          },
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail: res => {
        console.log('添加失败', res)
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '添加失败',
              icon: 'error'
            })
          },
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
      openid: wx.getStorageSync('openid'),
      useinfo: wx.getStorageSync('userinfo'),
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