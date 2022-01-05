// pages/editrecord/editrecord.js
const date = new Date()
const years = []
const months = []
const days = []
const outtype = ["早饭","午饭","晚饭","零食","饮料酒水","购物","交通","教育","娱乐","红包礼物","水电费","网费","话费","医疗","投资","其他"]
const intype = ["工资","投资收入","红包","借入","二手闲置","其他"]
for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:"",
    useinfo:{},
    recordid:"",
    account:[],
    oldaccountid:"",
    oldaccountbalance:0,
    oldaccountname:"",
    accountid:"",
    accountbalance:0,
    accountname:"",
    ios:[
      {value:"out",name:"支出",checked:"true"},
      {value:"in",name:"收入",}
    ],
    io:"out",
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 1,
    days: days,
    day: 1,
    messageremind:"请输入备注，默认为无",
    balanceremind:"请输入记账金额",
    oldbalance:0,
    balance:0,
    types:outtype,
    type:"早饭",
    message:"无",
    accountindex:[0],
    dataindex: [9999,0,0],
    typeindex:[0]
  },

  //删除记账
  deleterecord:function(){
    wx.showLoading({
      title: '删除中',
    })
    wx.cloud.database().collection('record').doc(this.data.recordid).remove().then(res=>{
      wx.cloud.database().collection('account').doc(this.data.oldaccountid).update({
        data:{
          accountbalance:Number(this.data.oldaccountbalance) - Number(this.data.oldbalance)
        }
      }).then(res=>{
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '删除成功',
            })
          },
        })
        wx.navigateBack({
          delta:1
        })
      })
    })
  },
  //修改记账
  editrecord:function () {
    var recordaccountid = this.data.accountid
    var recordyear = this.data.year
    var recordmonth = this.data.month
    var recordday = this.data.day
    var recordtype = this.data.type
    var oldrecordbalance = this.data.oldbalance
    var recordbalance = (this.data.io == "in") ? this.data.balance : -this.data.balance
    var recordmessage = this.data.message
    var recorddata = String(recordyear)+"-"+(String(recordmonth).length == 1 ?("0" + String(recordmonth)):String(recordmonth))+"-"+(String(recordday).length == 1 ?("0" + String(recordday)):String(recordday))
    if(isNaN(recordbalance)){
      wx.showToast({
        title: '金额应该是数字',
        icon:'error'
      })
      return;
    }
    wx.showLoading({
      title: '添加中',
    })
    wx.cloud.database().collection('record').doc(this.data.recordid).update({
      data:{
        recordaccountid:recordaccountid,
        recorddata:recorddata,
        recordtype:recordtype,
        recordbalance:recordbalance,
        recordmessage:recordmessage,
      },
      success:res=>{
        wx.cloud.database().collection('account').doc(this.data.oldaccountid).update({
          data:{
            accountbalance:Number(this.data.oldaccountbalance) - Number(oldrecordbalance)
          },
          success:res=>{
            wx.cloud.database().collection('account').doc(this.data.accountid).get().then(res=>{
              this.setData({
                accountbalance:res.data.accountbalance
              })
            wx.cloud.database().collection('account').doc(this.data.accountid).update({
              data:{
                accountbalance:Number(this.data.accountbalance) + Number(recordbalance)
              }
            })
            })
          },
          fail:res=>{},
        })
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '修改成功',
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
              title: '修改失败',
              icon:'error'
            })
          },
        })
      }
    })
  },

  //初始化
  getindex:function(){
    if(this.data.oldbalance > 0){
      this.setData({
        ios:[{value:"out",name:"支出",checked:"false"},{value:"in",name:"收入",checked:"true"}],
        types:intype
      })
    }
    var dataindex = [9999,0,0]
    var accountindex = [0]
    var typeindex = [0]
    for(let i = 0; i < this.data.years.length;i++){
      if(this.data.year == this.data.years[i]){
        dataindex[0] = i
      }
    }
    for(let i = 0; i < this.data.months.length;i++){
      if(this.data.month == this.data.months[i]){
        dataindex[1] = i
      }
    }
    for(let i = 0; i < this.data.days.length;i++){
      if(this.data.day == this.data.days[i])
      {dataindex[2] = i}
    }
    for(let i = 0; i < this.data.types.length;i++){
      if(this.data.type === this.data.types[i])
      {typeindex[0] = i}
    }
    for(let i = 0; i < this.data.account.length;i++){
      if(this.data.accountid === this.data.account[i]._id)
      {accountindex[0] = i}
    }
    this.setData({
      accountindex:accountindex,
      typeindex:typeindex,
      dataindex:dataindex
    })
    
  },
  // 获取输入
iochange:function(e){
  this.setData({
    io:e.detail.value,
  })
  if(e.detail.value == "in"){
    this.setData({
      types:intype,
      type:"工资"
    })
  }
  else{
    this.setData({
      types:outtype,
      type:"早餐"
    })
  }
  },
  
  accountChange: function (e) {
    const val = e.detail.value
    this.setData({
      accountid:this.data.account[val]._id,
      accountbalance:this.data.account[val].accountbalance,
      accountname:this.data.account[val].accountname
    })
  },
  
  typeChange: function (e) {
    const val = e.detail.value
    this.setData({
      type:this.data.types[val],
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
  oninputmessage:function (event) {
    this.setData({
      message:event.detail.value
    })
  },
  oninputbalance:function (event) {
    this.setData({
      balance:event.detail.value
    })
  },
  // 提示内容
    onfocusmessage: function (e) {
      this.setData({
        messageremind:""
      })
    },
    onblurmessage: function (e) {
      this.setData({
        messageremind:this.data.message
      })
    },
    onfocusbalance: function (e) {
      this.setData({
        balanceremind:""
      })
    },
    onblurbalance: function (e) {
      this.setData({
        balanceremind:this.data.balance
      })
    },

    //获取账户列表
getaccount: function () {
  wx.cloud.database().collection('account').get()
  .then(res =>{
    this.setData({
      account:res.data,
    })
}).catch(res =>{})
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      recordid:options.recordid
    })
    wx.cloud.database().collection('record').doc(this.data.recordid).get()
    .then(res => {
      var time = (res.data.recorddata).split("-");
      this.setData({
        oldbalance:res.data.recordbalance,
        balanceremind:(res.data.recordbalance > 0) ? res.data.recordbalance : -res.data.recordbalance,
        balance:(res.data.recordbalance > 0) ? res.data.recordbalance : -res.data.recordbalance,
        year:Number(time[0]),
        month:Number(time[1]),
        day:Number(time[2]),
        message:res.data.recordmessage,
        messageremind:res.data.recordmessage,
        oldaccountid:res.data.recordaccountid,
        accountid:res.data.recordaccountid,
        type:res.data.recordtype
      })
      this.getindex()
      wx.cloud.database().collection('account').doc(this.data.accountid).get().then(res=>{
        this.setData({
          accountname:res.data.accountname,
          accountbalance:res.data.accountbalance,
          oldaccountname:res.data.accountname,
          oldaccountbalance:res.data.accountbalance
        })
      })
    })
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
      openid:wx.getStorageSync('openid'),
      useinfo:wx.getStorageSync('userinfo'),
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