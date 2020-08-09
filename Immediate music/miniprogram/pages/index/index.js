// miniprogram/pages/index/index.js
var app = getApp()  
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reco:null,//推荐歌单
    swpers:null,//新专辑轮播
    news:null,//新歌
  },
  //跳转播放页
  getsrc(e){
    // console.log(e.currentTarget.dataset.src);
    let src=e.currentTarget.dataset.src
    let img=e.currentTarget.dataset.img
    let cid=e.currentTarget.dataset.cid
    let name=e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../play/play?src='+src+'&img='+img+'&cid='+cid+'&name='+name,
    })
  },
// 跳转歌单
getlist(e){
  let id=e.currentTarget.dataset.id
  let num=e.currentTarget.dataset.num
  wx.navigateTo({
    url: '../lists/lists?id='+id+"&num="+num,
  })
},
// 跳转专辑
getalb(e){
  let id=e.currentTarget.dataset.id
  wx.navigateTo({
    url: '../album/album?id='+id,
  })
  // console.log(id)
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    // 获取推荐歌单
    wx.request({
      url: 'http://api.migu.jsososo.com/recommend/playlist',
      data:{
      },
      success(res){
        that.setData({
          reco:res.data.data.list
        })
        // console.log(that.data.reco)
      }
    })
    // 获取轮播图
    wx.request({
      url: 'http://api.migu.jsososo.com/new/albums',
      data:{
      },
      success(res){
        that.setData({
          swpers:res.data.data.list
        })
        // console.log(that.data.swpers)
      }
    })
    // 获取新歌歌单
    wx.request({
      url: 'http://api.migu.jsososo.com/new/songs',
      data:{
      },
      success(res){
        that.setData({
          news:res.data.data.list
        })
        // console.log(that.data.news)
      }
    })
    // 获取推荐单曲
    // wx.request({
    //   url: 'http://api.migu.jsososo.com/singer/albums?id=112',
    //   data:{
    //     pageNo:1
    //   },
    //   success(res){
    //     that.setData({
    //       sing:res.data.data.list
    //     })
    //     console.log(res.data.data.list)
    //   }
    // })
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