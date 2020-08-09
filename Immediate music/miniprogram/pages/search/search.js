// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sear:'',//获取歌曲信息
  },
  //输入框失去焦点时触发
getdata(e){
  // console.log(e.detail.value)
  //检索信息
  var that=this
  wx.request({
    url: 'http://api.migu.jsososo.com/search',
    data:{
      keyword:e.detail.value
    },
    success(res){
      that.setData({
        sear:res.data.data.list
      })
      // console.log(res)
    }
  })
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
    // console.log(src,img,cid,name)
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