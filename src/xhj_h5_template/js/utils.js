/**
 * 所有的封装
 */

/**
 * 信息提示
 */
var Core = window['Core'] || {};
Core.CONFIG = {
    TwinkTime: 70, //提示框闪烁时长
    TwinkCount: 3, //提示框闪烁次数
    MsgTimeout: 1000, //minmessage 自动隐藏时间
};

Core.Center = function(box, setting) {
    var mainBox = $(window);;
    var cut = 0,
        t = 0,
        l = 0;
    var cssT = (mainBox.height() - box.height()) / 2.2 + cut + t;
    var cssL = (mainBox.width() - box.width()) / 2 + cut + l;
    if (cssT < 0) {
        cssT = 0;
    }
    if (cssL < 0) {
        cssL = 0;
    }
    var st = document.documentElement.scrollTop || document.body.scrollTop;
    if (st) {
        cssT += st;
    }
    box.css({
        top: cssT,
        left: cssL
    });
}

Core.MinMessage = (function() {
    var _temp = '<div class="popup-hint" style="background-color:rgba(0,0,0,0.7);border-radius:0.3rem;position:fixed;top:9999px;lefe:9999px;z-index:9999999999;display:none;">' +
        '<i class="" rel="type"></i>' +
        '<em class="sl"><b></b></em>' +
        '<span class="desc" style="color:#fff;font-size: 0.8rem;padding: 0.3rem 1rem; line-height: 1.5rem; display:block;" rel="con"></span>' +
        '<em class="sr"><b></b></em>' +
        '</div>';
    var _cache = {
            Type: {
                "suc": "hint-icon hint-suc-m",
                "war": "hint-icon hint-war-m",
                "err": "hint-icon hint-err-m",
                "load": "hint-loader",
            }
        },
        _dom, _timer, timeout = 3000;

    //创建消息DOM
    var create = function(obj) {
        if (!_dom) {
            _dom = $(_temp);
            $(document.body).append(_dom);
        }
        _dom.find("[rel='con']").html(obj.text);
        var icon = _dom.find("[rel='type']");
        for (var k in _cache.Type) {
            icon.removeClass(_cache.Type[k]);
        }
        icon.addClass(_cache.Type[obj.type]);
        _dom.fadeIn(300);
        Core.Center(_dom);
    }

    //隐藏
    var hide = function() {
        if (_timer) {
            window.clearTimeout(_timer);
        }
        if (_dom) {
            _dom.fadeOut(300);
        }
    }

    return {
        Show: function(obj) {
            if (!obj.type) {
                obj.type = "war";
            }
            create(obj);
            if (_timer) {
                window.clearTimeout(_timer);
            }
            if (!obj.timeout) return;
            if (timeout) {
                _timer = window.setTimeout(hide, timeout);
            }
        },
        Hide: function() {
            if (_dom) {
                _dom.fadeOut(300);
            }
        }
    }
})();

/**
 *提示弹窗
 */
(function($, window, undefined) {
    $.extend($, {
        alertTip: function(text, container, timer) {
            if ($.isNumeric(container)) {
                timer = container;
                container = null;
            }
            if (top.window.Core && top.window.Core.MinMessage) {
                top.window.Core.MinMessage.Show({
                    text: text,
                    type: "war",
                    window: container ? { warp: container } : null,
                    timeout: timer || 2000
                });
            } else {
                alert(text);
            }
        },
        showTip: function (text, container) {
            top.window.Core.MinMessage.Show({
                text: text,
                type: "war",
                window: container ? { warp: container } : null
            });
        },
        closeTip: function() {
            top.window.Core.MinMessage.Hide();
        }
    });
}(jQuery, window));

/**
 * 判断横屏还是竖屏
 */
function orient() {
    if (window.orientation == 90 || window.orientation == -90) {
        //ipad、iphone竖屏；Andriod横屏
        $("body").attr("id", "landscape");
        return false;
    } else if (window.orientation == 0 || window.orientation == 180) {
        //ipad、iphone横屏；Andriod竖屏
        $("body").attr("id", "portrait");
        return false;
    }
}

var localStorages = {
    Get: function(key){
        if (window.localStorage && window.localStorage['getItem']) {
            if(key){
                return window.localStorage.getItem(key);
            }
        }
    },
    Set: function(key, value){
        if (window.localStorage && window.localStorage['setItem']) {
            if (value && value) {
                return window.localStorage.setItem(key, value);
            }               
        }

    },
    Clear: function(name) {
        if(name){
            window.localStorage.removeItem(name);
        }else{
            window.localStorage.clear();
        }
    }
};

//获取 url 的参数
function getQueryString (name) {
  //获取url中的参数
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 判断是否是安卓
 */
function _isAndroid() {
  var u = navigator.userAgent,
      isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端 
      isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端 
  if (isAndroid) return true;
  else return false;
}

/**
 * 图片加载处理
 */
function _loadImages(pics, callback, len) {
  len = len || pics.length;
  if (pics.length) {
      var IMG = new Image(),
          picelem = pics.shift();

      if (window._pandaImageLoadArray) {
          window._pandaImageLoadArray = window._pandaImageLoadArray
      } else {
          window._pandaImageLoadArray = [];
      }
      window._pandaImageLoadArray.push(picelem);
      IMG.src = picelem;
      // 从数组中取出对象的一刻，就开始变化滚动条
      _drawLoadProgress(window._pandaImageLoadArray.length / (len * len));
      // 缓存处理
      if (IMG.complete) {
          window._pandaImageLoadArray.shift();
          return _loadImages(pics, callback, len);
      } else {
          // 加载处理
          IMG.onload = function () {
              window._pandaImageLoadArray.shift();
              IMG.onload = null; // 解决内存泄漏和GIF图多次触发onload的问题
          }
          // 容错处理 todo 应该如何处理呢?
          // 目前是忽略这个错误，不影响正常使用
          IMG.onerror = function () {
              window._pandaImageLoadArray.shift();
              IMG.onerror = null;
          }
          return _loadImages(pics, callback, len);
      }
      return;
  }
  if (callback) _loadProgress(callback, window._pandaImageLoadArray.length, len);
}

/**
 * 监听实际的加载情况
 */
function _loadProgress(callback, begin, all) {
  var loadinterval = setInterval(function () {
      if (window._pandaImageLoadArray.length != 0 && window._pandaImageLoadArray.length != begin) {
          _drawLoadProgress((begin - window._pandaImageLoadArray.length) / all);
      } else if (window._pandaImageLoadArray.length == 0) {
          _drawLoadProgress(1)
          setTimeout(function () {
              callback.call(window);
          }, 500);
          clearInterval(loadinterval);
      }
  }, 300);
}

/**
 * 音乐播放
 */
var music = document.getElementById("Music");
function autoPlayMusic() {
  // 自动播放音乐效果，解决浏览器或者APP自动播放问题
  function musicInBrowserHandler() {
      musicPlay(true);
      document.body.removeEventListener('touchstart', musicInBrowserHandler);
  }
  document.body.addEventListener('touchstart', musicInBrowserHandler);
  // 自动播放音乐效果，解决微信自动播放问题
  function musicInWeixinHandler() {
      musicPlay(true);
      document.addEventListener("WeixinJSBridgeReady", function () {
          musicPlay(true);
      }, false);
      document.removeEventListener('DOMContentLoaded', musicInWeixinHandler);
  }
  document.addEventListener('DOMContentLoaded', musicInWeixinHandler);
  musicInBrowserHandler();
  musicInWeixinHandler();
}
function musicPlay(isPlay) {
  if (isPlay && music.paused) {
      music.play();
  }
  if (!isPlay && !music.paused) {
      music.pause();
  }
}
// autoPlayMusic();

/**
 * 去除iOS默认橡皮筋效果并仍可滚动某些元素
 */
function iosTrouchFn(el) {
  //el需要滑动的元素
  el.addEventListener('touchmove',function(e){
      e.isSCROLL = true;
  })
  document.body.addEventListener('touchmove',function(e){
    if(!e.isSCROLL){
        e.preventDefault(); //阻止默认事件(上下滑动)
    }else{
      //需要滑动的区域
      var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离 
      var scrollH = el.scrollHeight; //含滚动内容的元素大小
      var offsetH = el.offsetHeight; //网页可见区域高
      var cScroll = top + offsetH; //当前滚动的距离

      //被滑动到最上方和最下方的时候
      if(top == 0){
          top = 1; //0～1之间的小数会被当成0
      }else if(cScroll === scrollH){
            el.scrollTop = top - 0.1;
      }
    }
  }, {passive: false}) //passive防止阻止默认事件不生效
}

/**
 * Base64 加密解密 
 * var b = new Base64();
 * 加密  b.encode(str);
 * 解密  b.decode(str);
 */

function Base64() {
 
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }
 
    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }
 
    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
        return utftext;
    }
 
    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}



/**
 * 生成从minNum到maxNum的随机数
 * @param {[type]} minNum [description]
 * @param {[type]} maxNum [description]
 */
function RandomNum(minNum, maxNum) {
  var Range = maxNum - minNum;
  var Rand = Math.random();
  if(Math.round(Rand * Range)==0){
      return minNum + 1;
  }else if(Math.round(Rand * maxNum)==maxNum)
  {
      return maxNum - 1;
  }else{
      var num = minNum + Math.round(Rand * Range) - 1;
      return num;
  }
}

/**
 * 判断是否微信
 */
var ua = navigator.userAgent.toLowerCase();
var isWeixin = ua.indexOf('micromessenger') != -1;

/**
 * 获取微信用户信息
 */
function getUserInfo(){
    if(isWeixin){
        if(Cookies.get('userInfo')){
            console.log(Cookies.getJSON('userInfo'));
        }else if(getQueryString("wx_profile")){
            var wx_profile = getQueryString("wx_profile");
            var b = new Base64();  
            var userInfoStr = b.decode(wx_profile);
            Cookies.set('userInfo',userInfoStr);
        }else{
            window.location.href = "//api-a.xhangjia.com/wechat/userinfo?redirect_uri="+window.location.href;
        }
    }else{
        var testUser = {"id":"oe_RNwDaXS-x9b41Zlw9t4vHrE4A","name":"测试用户","nickname":"测试用户","avatar":"http://img.xhangjia.com/test/20180927072145mGLXOi16XPG8.jpg","email":null,"original":{"openid":"oe_RNwDaXS-x9b41Zlw9t4vHrE4A","nickname":"测试用户","sex":1,"language":"zh_CN","city":"\u5e7f\u5dde","province":"\u5e7f\u4e1c","country":"\u4e2d\u56fd","headimgurl":"http://img.xhangjia.com/test/20180927072145mGLXOi16XPG8.jpg","privilege":[]},"token":{"access_token":"17_J1LaFpILHO_0gZj0aH3tNcsXKR6MsJZFtJz4iEKbrNqGEA4e5rSK8ERPBbwpiP6vSJlBLVyIDkrRhkFgcyJFvA","expires_in":7200,"refresh_token":"17_tTM-goTTfgDK5n2uOtPl_zrqOK1TAAjAs1yOt6K3UoTFWUVP-ikMSm5c1m9rOUDB420tfVIFDke8014qV70SQw","openid":"oe_RNwDaXS-x9b41Zlw9t4vHrE4A","scope":"snsapi_userinfo"},"provider":"WeChat"}
        Cookies.set('userInfo',testUser);
    }
    
}
// getUserInfo();


function wechatInit(){
    var url = window.location.href.split("#")[0];
    $.ajax({
        type:'GET',
        url:'//api-a.xhangjia.com/api/wechat/jssdk',
        data:{
            url:url 
        },
        headers:{
            "Accept":'application/json'
        },
        success:function(data){
            var apilist = [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ];
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: apilist
            });
      

        },
        error:function(error){
            console.log(error)
        }
        
    });
  }

if(isWeixin){
    wechatInit()
}

/**
 * [微信分享]
 * @param  {[type]} shareTitle [分享标题及朋友圈文案]
 * @param  {[type]} shareDesc  [分享描述]
 * @param  {[type]} link       [分享链接]
*/
function wechatShare(shareTitle,shareDesc,link){
    if(!link){ var link = location.href; }
    if(!wx){
        wechatInit();
    }
    wx.ready(function () {
        // 分享给朋友事件绑定
        wx.onMenuShareAppMessage({
            title: shareTitle,
            desc: shareDesc,
            link: link,
            imgUrl: 'http://img.xhangjia.com/test/20180927072145mGLXOi16XPG8.jpg',   //分享的缩略图
            success: function () { 

            }
        });

        // 分享到朋友圈
        wx.onMenuShareTimeline({
            title:shareTitle,
            link: link,
            imgUrl: 'http://img.xhangjia.com/test/20180927072145mGLXOi16XPG8.jpg',   //分享的缩略图
            success: function () { 

            }
        });
    })
}
wechatShare('分享标题','分享文案')
  