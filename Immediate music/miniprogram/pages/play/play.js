// pages/play/play.js
var _animation; // 动画实体
var _animationIndex =0; // 动画执行次数index（当前执行了多少次）
var _animationIntervalId = -1; // 动画定时任务id，通过setInterval来达到无限旋转，记录id，用于结束定时任务
const _ANIMATION_TIME = 5000; // 动画播放一次的时长ms
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //文稿数组，转化完成用来在wxml中使用
    storyContent:[],
    //文稿滚动距离
    marginTop:0,
    //当前正在第几行
    currentIndex222:0,
    show:1,
    animation: '',//动画 
    src:"",//音乐链接
    img:'',//背景图片
    cid:'',//歌词
    name:'1',//歌曲名
  },
  //播放音乐
  player(audio) {
    var that = this
    //title不写或放空会报错哦，即使不报错ios系统会不播放，所以必须加
    audio.title = that.data.name
 
    //这点需知微信小程序上线不能超过2M,音乐文件会很大，所以要放在服务器上才可以
    audio.src = that.data.src
    
    //音乐播放结束后继续播放此音乐，循环不停的播放
    audio.onEnded(() => {
      that.player(wx.getBackgroundAudioManager())
    })
  },
  // 开始
  play(){
    var that=this
    wx.request({
      url: 'http://api.migu.jsososo.com/lyric?cid='+that.data.cid,
      method: 'GET',
      success: function(res) {
        that.setData({
          show:1,//显示隐藏
          storyContent: that.sliceNull(that.parseLyric(res.data.data))
        })
        that.startAnimationInterval();//开启动画
        that.player(wx.getBackgroundAudioManager())//播放音乐
      }
    })
    
  },

  parseLyric: function (text) {
    var result = [];
    var lines = text.split('\n'); //切割每一行
    var pattern = /\[\d{2}:\d{2}.\d{2}\]/g; //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
    //去掉不含时间的行
    while(!pattern.test(lines[0])) {
      lines = lines.slice(1);
    };
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function (v /*数组元素值*/, i /*元素索引*/, a /*数组本身*/) {
      //提取出时间[xx:xx.xx]
      var time = v.match(pattern);
        //提取歌词
      var value = v.replace(pattern, '');
      // 因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
      time.forEach(function (v1, i1, a1) {
        //去掉时间里的中括号得到xx:xx.xx
        var t = v1.slice(1, -1).split(':');
        //将结果压入最终数组
        result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
      });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function (a, b) {
      return a[0] - b[0];
    });
    return result;
  },

  //去除空白
  sliceNull: function (lrc) {
    var result = []
    for (var i = 0; i < lrc.length; i++) {
      if (lrc[i][1] == "") {
      } else {
        result.push(lrc[i]);
      }
    }
    return result
  },

  // 暂停
  stop(){
    this.stopAnimationInterval();//关闭动画
    this.setData({
      show:0
    });
    wx.getBackgroundAudioManager().pause();//暂停音乐
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取歌曲信息
    this.setData({
      src:options.src,
      img:options.img,
      cid:options.cid,
      name:options.name
    })
    var that=this
    wx.request({
      url: 'http://api.migu.jsososo.com/lyric?cid='+that.data.cid,
      method: 'GET',
      success: function(res) {
        that.setData({
          show:1,//显示隐藏
          storyContent: that.sliceNull(that.parseLyric(res.data.data))
        })
      }
    })

     // 背景音频播放进度更新事件
     const backgroundAudioManager = wx.getBackgroundAudioManager();
     backgroundAudioManager.onTimeUpdate(function() {
      
      if (that.data.currentIndex222 >= 2) {//超过6行开始滚动
        that.setData({
          marginTop: (that.data.currentIndex222 -2) * 30
        })
      }
      // 文稿对应行颜色改变
      if (that.data.currentIndex222!=that.data.storyContent.length - 1){//
        var j = 0;
        for (var j = that.data.currentIndex222; j < that.data.storyContent.length; j++) {
          // 当前时间与前一行，后一行时间作比较， j:代表当前行数
          if (that.data.currentIndex222 == that.data.storyContent.length - 2) {
           //最后一行只能与前一行时间比较
            if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(that.data.storyContent[that.data.storyContent.length - 1][0])) {
              that.setData({
                currentIndex222: that.data.storyContent.length - 1
              })
              return;
            }
          } else {
            if (parseFloat(backgroundAudioManager.currentTime) > parseFloat(that.data.storyContent[j][0]) && parseFloat(backgroundAudioManager.currentTime) < parseFloat(that.data.storyContent[j + 1][0])) {
              that.setData({
                currentIndex222: j
              })
              return;
            }
          }
        }
      }
    });
  



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面旋转
    _animationIndex = 0;
    _animationIntervalId = -1;
    this.data.animation = '';
    this.startAnimationInterval();//开启动画
    this.player(wx.getBackgroundAudioManager())//播放音乐
  },
    
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面旋转
    _animation = wx.createAnimation({
      duration: _ANIMATION_TIME,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0'
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

  },
   /**
   * 实现image旋转动画，每次旋转 120*n度
   */
  rotateAni: function (n) {
    _animation.rotate(120 * (n)).step()
    this.setData({
      animation: _animation.export()
    })
  },

  /**
   * 开始旋转
   */
  startAnimationInterval: function () {
    var that = this;
    that.rotateAni(++_animationIndex); // 进行一次旋转
    _animationIntervalId = setInterval(function () {
      that.rotateAni(++_animationIndex);
    },  _ANIMATION_TIME); // 每间隔_ANIMATION_TIME进行一次旋转
  },

  /**
   * 停止旋转
   */
  stopAnimationInterval: function () {
    if (_animationIntervalId> 0) {
      clearInterval(_animationIntervalId);
      _animationIntervalId = 0;
    }
  },
})