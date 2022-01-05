// pages/search/search.js
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
    years: years,
    startyear: date.getFullYear(),
    endyear:date.getFullYear(),
    months: months,
    startmonth: 1,
    endmonth:1,
    days: days,
    startday: 1,
    endday:1,
    dataindex: [9999,0,0],
    record:[],
    totalout:0,
    totalin:0
  },
  startdataChange: function (e) {
    const val = e.detail.value
    this.setData({
      startyear: this.data.years[val[0]],
      startmonth: this.data.months[val[1]],
      startday: this.data.days[val[2]]
    })
  },
  enddataChange: function (e) {
    const val = e.detail.value
    this.setData({
      endyear: this.data.years[val[0]],
      endmonth: this.data.months[val[1]],
      endday: this.data.days[val[2]]
    })
  },
  search:function(){
    var startyear = this.data.startyear
    var startmonth = this.data.startmonth
    var startday = this.data.startday
    var startdata = String(startyear)+"-"+(String(startmonth).length == 1 ?("0" + String(startmonth)):String(startmonth))+"-"+(String(startday).length == 1 ?("0" + String(startday)):String(startday))
    var endyear = this.data.endyear
    var endmonth = this.data.endmonth
    var endday = this.data.endday
    var enddata = String(endyear)+"-"+(String(endmonth).length == 1 ?("0" + String(endmonth)):String(endmonth))+"-"+(String(endday).length == 1 ?("0" + String(endday)):String(endday))
    const db = wx.cloud.database()
    db.collection('record').where({
      recorddata:db.command.gte(startdata),
    }).where({
      recorddata:db.command.lte(enddata)
    }).orderBy('recorddata','desc').get()
    .then(res =>{
      this.setData({
        record:res.data
      })
      console.log('Search_DB completed.')
      console.log('startdata:'+String(startdata))
      console.log('enddata:'+String(enddata))
      console.log(this.data.record)
      var totalout = 0
      var totalin = 0
      for(var i = 0;i<this.data.record.length;i++){
        if(this.data.record[i].recordbalance > 0){
          totalin = totalin + Number(this.data.record[i].recordbalance)
        }
        else{
          totalout = totalout + Number(this.data.record[i].recordbalance)
        }
      }
      totalout = -totalout
      this.setData({
        totalin:totalin,
        totalout:totalout
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