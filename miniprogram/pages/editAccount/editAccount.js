// pages/editAccount/editAccount.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    name: "",
    balance: 0
  },
  //修改账户信息
  editaccount: async function () {
    var accountname = this.data.name
    var accountbalance = this.data.balance
    var accountIsNull = true;
    if (accountname === "") {
      wx.showToast({
        title: '账户名不应为空',
        icon: 'error'
      })
      return;
    }
    if (isNaN(accountbalance)) {
      wx.showToast({
        title: '金额应该是数字',
        icon: 'error'
      })
      return;
    }
    await db.collection('account').where({
      accountname: accountname
    }).get().then((res) => {
      if (res.data.length === 1 && res.data[0]._id !== this.data.id) {
        accountIsNull = false
        return
      }
    })
    if (!accountIsNull) {
      wx.showToast({
        title: '已有同名账户',
        icon: 'error'
      })
      return;
    }
    wx.showLoading({
      title: '保存中',
    })
    wx.cloud.database().collection('account').doc(this.data.id).update({
      data: {
        accountname: accountname,
        accountbalance: accountbalance
      },
      success: res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '保存成功',
            })
          },
        })
        wx.navigateBack({
          delta: 1
        })
      },

      fail: res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '保存失败',
              icon: 'error'
            })
          },
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  //删除账户
  removeaccount: function () {
    wx.showLoading({
      title: '删除中',
    })
    db.collection('account').doc(this.data.id).remove({

      success: res => {

        try {
          wx.cloud.callFunction({
            name: 'removeAccount',
            data: {
              accountId: this.data.id
            }
          })
        } catch (error) {
          console.log("fetch cloudfunction error", error)
        }

        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '删除成功',
            })
          },
        })
        wx.navigateBack({
          delta: 1
        })
      },

      fail: res => {
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '删除失败',
              icon: 'error'
            })
          },
        })
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },

  empty: function () {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.accountid,
      name: options.accountname,
      balance: options.accountbalance
    })
  }
})