//使用rem策略，不断更新html的fontsize
(function(){
    function sizeHtml(){
        window.mtSizeBase = $(window).width()/16;
        window.mtSizeBase = window.mtSizeBase>45?45:window.mtSizeBase;
        $("html").css("font-size",window.mtSizeBase+"px");
    }
    sizeHtml();
    $(window).resize(function(){
        setTimeout(function(){
            sizeHtml();
        },300);
    });
})();
//判断浏览器
var browser={
    versions:function(){
        var u = navigator.userAgent;
        return {         //移动终端浏览器版本信息
            weibo:u.toLowerCase().match(/Weibo/i)=="weibo",
            micromessenger:u.toLowerCase().match(/MicroMessenger/i)=="micromessenger",          //是否是微信
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            isSAUMSUNG:u.indexOf('SAMSUNG')>-1,
            isMomo:u.indexOf('momoWebView')>-1,
            isApp:u.indexOf('haigou')>-1
        };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
};
function createAlert(){
    this.html = '<div id="prompt-info-b" style = "display:none; z-index:11000; width:100%; position:fixed; top:200px;"><div class="prompt-info" style="width:16em; text-align:center; border-radius:5px; -moz-border-radius:5px; background-color:black; color:white; padding:1em 2em; margin:0px auto;"></div></div>';
    this.init();
};
createAlert.prototype={
    isShow:"",
    init:function(){
        var _self=this;
        $("body").append(_self.html);
    },
    alert:function(word,callback){
        var _self=this;
        $("#prompt-info-b").children(".prompt-info").html(word);
        if($("#prompt-info-b").css("display") == "none"){
            $("#prompt-info-b").show();
            _self.isShow = setTimeout(function(){
                $("#prompt-info-b").fadeOut("normal");
            },2000);
        }else{
            clearTimeout(_self.isShow);
            $("#prompt-info-b").finish().show();
            isShow = setTimeout(function(){
                $("#prompt-info-b").fadeOut("normal");
            },2000);
        }
        if(callback&& typeof callback == "function"){
            callback();
        }
    }
};
function creatConfirm(){
    var html = [];
    html.push('<div class="mt-confirm">');
    html.push('<div class="confirm-img"></div>');
    html.push('<p class="confirm-w"></p>');
    html.push('<div class="confirm-bt">');
    html.push('<div class="confirm-c-bt">取消</div>');
    html.push('<div class="confirm-s-bt">确认</div>');
    html.push('</div>');
    html.push('</div>');
    this.html = html.join("");
    this.$confirm = "";
    this.callback=function(){},
    this.init();
};
creatConfirm.prototype = {
    isShow:"",
    init:function(){
        var _self=this;
        _self.$confirm = $(_self.html);
        $("body").append(_self.$confirm);
        _self.$confirm.find(".confirm-c-bt").click(function(){
            _self.hide();
        });        
        _self.$confirm.find(".confirm-s-bt").click(function(){
            _self.callback();
            _self.hide();
        });
    },
    show:function(){
        var _self=this;
        _self.$confirm.show();
        setTimeout(function(){
            _self.$confirm.css("opacity","1");
        },100);        
    },
    hide:function(){
        var _self=this;
        _self.$confirm.css("opacity","0");
        setTimeout(function(){
            _self.$confirm.hide();
        },500);
    },
    confirm:function(word,callback){
        var _self=this;
        _self.$confirm.find(".confirm-w").html(word);
        _self.show();
        if(callback&&typeof callback=="function"){
            _self.callback = callback;
        }
    }
};
//model基础的post和get方法
var modelBase = {
    post:function(url,isasync){
        var isasync = isasync===false?false:true;
        return function(data,sback,eback){
            $.ajax({
                type:"post",
                data:data,
                url:url,
                dataType:"json",
                async:isasync,
                success:function(data){
                    sback(data);
                },
                error:function(){                    
                    if(typeof eback==="function"){
                        eback();
                    }
                }
            });
        }
    },
    get:function(url,isasync){
        var isasync = isasync===false?false:true;
        return function(data,sback,eback){
            $.ajax({
                type:"post",
                data:data,
                url:url,
                dataType:"json",
                async:isasync,
                success:function(data){
                    sback(data);
                },
                error:function(){                    
                    if(typeof eback==="function"){
                        eback();
                    }
                }
            })
        }
    },
    getjsonp:function(url,isasync){
        var isasync = isasync===false?false:true;
        return function(data,sback,eback){
            $.ajax({
                type: "get",
                jsonp: "callback",
                data:data,
                url: url,
                dataType: "jsonp",
                async:isasync,
                success:function(data){
                    sback(data);
                },
                error:function(){                    
                    if(typeof eback==="function"){
                        eback();
                    }
                }
            })
        }
    }
};
metaoBase = {
    getQueryByName:function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },
    openAppProduct:function(id,type){
        if(navigator.userAgent.indexOf('Weibo') != -1 || navigator.userAgent.indexOf("MicroMessenger") != -1) {
            this.showCoverLayer();
            //window.location.href = "http://mp.weixin.qq.com/mp/redirect?url=haitaocn%3A%2F%2Fproducts%2F"+id;
        }else{            
            var url = window.location.href;
            if(browser.versions.isSAUMSUNG){
                window.location.href = "haitaocn://products/" + id;
            }else{                
                var ifr = document.createElement("iframe");
                ifr.src="haitaocn://products/" + id;
                $(document.body).append(ifr);
            }
            setTimeout(function () { window.location.href =  url; }, 25);
            //
        }
    },
    openApp:function(id,todownload){            //如果todownload为true 没安装app的情况下跳转到下载页面，如果为false，提示用户去下载。 不能完美的判断，对手机自带浏览器兼容性好些。
        var _self=this;
        var timeout,t = 1000;   
        var ifr = document.createElement("iframe");  
        var t1 = Date.now();  
        ifr.setAttribute("src","haitaocn://products/" + id);
        ifr.setAttribute("style","display:none");
        document.body.appendChild(ifr);
        setTimeout(function(){
            var t2 = Date.now();
            if(!t1||t2-t1<t+100){
                if(todownload){                             
                    window.location.href = "http://app.metao.com/";
                }else{
                    try{
                        showAlert.alert("您还未安装蜜淘app客户端！");
                    }catch(e){
                        alert("您还未安装蜜淘app客户端！");
                    }
                }
            }          
            document.body.removeChild(ifr);
            //_self.openApp(id);
        },t);
        /*if(navigator.userAgent.indexOf('Weibo') != -1 || navigator.userAgent.indexOf("MicroMessenger") != -1) {
            this.showCoverLayer();
        }*/
    },
    showCoverLayer:function(){
        if(arguments[0]){
            $(document.body).append('<div class="leader-cover"><img src="'+arguments[0]+'"/></div>');
        }else{
            $(document.body).append('<div class="leader-cover"><img src="'+metaoBase.sourcepath+'/img/wap_10.png"/></div>');
        }
        $(".leader-cover").click(function(){
            $(this).unbind("click");
            $(this).remove();
        })
    },
    appClassify:{
        "products":"haitaocn://products/",                  //代购商品详情页
        "specials":"haitaocn://specialsProducts/",         //特卖商品详情
        "collections":"haitaocn://collections/",           //专题页
        "activities":"haitaocn://activities/",            //跳转到活动
        "pages":"haitaocn://pages/",                 //跳转到网页
        "search":"haitaocn://search/",                //跳转到搜索结果页
        "cart":"haitaocn://cart/",                  //购物车
        "likes":"haitaocn://my-likes/",              //我的喜欢
        "orders":"haitaocn://my-orders/",             //我的订单
        "forum":"haitaocn://forum/",                 //我要买什么首页
        "new":"haitaocn://topics/new",            //我要买什么—我也提一个
        "topics":"haitaocn://topics/",                //我要买什么详情
        "categories":"haitaocn://categories/",            //分类频道
        "specialset":"haitaocn://specialset/",            //特卖合集
        "specialActivities":"haitaocn://specialActivities/",            //特卖活动 haitaocn://specialActivities/22
        "profile":"haitaocn://profile/",             //小背篓
        "home":"haitaocn://home/",                   //首页
        "ziying":"haitaocn://ziying/",               //免税自营
        "zhiyou":"haitaocn://zhiyou/"                //直邮
    },
    getPath:function(type,para){
        var result = "haitaocn://";                //代购商品详情页
        if(typeof type !=undefined && type!=""){
            result = this.appClassify[type];
        }
        result = result+para;
        return result;
    },
    isLogin:$.cookie("nickname") != undefined && $.cookie("email") != undefined,
    logout:function(callback){
        $.removeCookie("nickname",{path: "/", domain:metaoBase.Domain});
        $.removeCookie("email",{path: "/", domain:metaoBase.Domain});
        $.removeCookie("avatar", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("sessionID", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("totalRowCount", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("pendOrderCount", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("tothird", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("third-session", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("car_num", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("PLAY_SESSION", {path: "/", domain:metaoBase.Domain});
        $.removeCookie("orderList", {path: "/", domain:metaoBase.Domain});
        if(callback&&typeof callback=="function"){
            callback();
        }
    },
    redirectLogin:function(url){
        window.location.href = metaoBase.baseLoginUrl+"?redirectUrl="+url;
    },
    alert:window.alert,
    confirm:window.confirm
};
$(function(){
    metaoBase.alert = new createAlert().alert;
    metaoBase.mtoption =  new creatConfirm();
    if(metaoBase.isLogin){
        $("#login-control").addClass("has-login").find(".bar-title").html("注销");
    }else{
        $("#login-control").removeClass("has-login").find(".bar-title").html("登录");
    }
    if($("#metao-leader").length==1){
        var animates ="";
        function switchleard(){
            $("#metao-leader .mt-leader-bt").click(function(){
                var $this = $(this);
                $this.unbind("click");
                var $leader = $this.next(".leader-list");
                clearTimeout(animates);
                if($this.hasClass("open-bt")){
                    $this.removeClass("open-bt");
                    $leader.css("opacity","0");
                    animates=setTimeout(function(){
                        $leader.hide();
                        switchleard();
                    },500);
                }else{
                    $this.addClass("open-bt");
                    $leader.show();
                    animates=setTimeout(function(){
                        $leader.css("opacity","1");
                        switchleard();
                    },100);
                }
            });
        }
        switchleard();
        $("#login-control").click(function(){
            var $this = $(this);
            if($this.hasClass("has-login")){
                metaoBase.mtoption.confirm("您好，您确定要注销此账号吗？",function(){
                    metaoBase.logout();
                    window.location.href=metaoBase.basePassport+"/logout?redirectUrl="+window.location.href;
                });
            }else{
                metaoBase.redirectLogin(window.location.href);
            }
        });
    }
});

if(!browser.versions.micromessenger){
    $(document).delegate("a[app-type]","click",function(){
        var type = $(this).attr("app-type");
        var para = $(this).attr("app-para");
        var paras="";
        var url = $(this).attr("href");
        if(para==undefined){
            paras="?from="+metaoBase.visitFrom;
        }else{
            paras=para+"?from="+metaoBase.visitFrom;
        }
        //alert(navigator.userAgent);
        if(browser.versions.isMomo){
        }else if(browser.versions.isSAUMSUNG){
            window.location.href = metaoBase.getPath(type,paras);
        }else{
            var ifr = document.createElement("iframe");
            ifr.src=metaoBase.getPath(type,paras);
            $(document.body).append(ifr);
        }
        if(metaoBase.visitFrom!="app"){
            setTimeout(function () {window.location.href =  url; }, 25);
        }else{
            setTimeout(function () {window.location.href =  window.location.href; }, 25);
        }
        //window.location.href = metaoBase.getPath(type,paras);
        return false;
    });
}

function mtCountDown(data){
    //this.isAll=data.isAll===false?false:true;
    this.interval = data.interval||1000;
    this.format = data.format||0;                   //显示几位毫秒
    this.time = data.time;
    this.currenttime = data.currenttime||0;
    this.endtime = data.endtime||0;
    this.timeType=data.timeType||"data";
    this.baseSecent = false;
    this.callback = data.callback||null;
    this.init();
}
mtCountDown.prototype={
    init:function(){
        var _self=this;
        if(_self.timeType == "data"){
            _self.time = _self.endtime*1-_self.currenttime*1;
        }else if(_self.timeType == "left"){
            _self.time = _self.time*1;
        }else{
            console.log("unkown timeType on CountDown");
            return false;
        }
        if(_self.baseSecent){
            if(_self.format>=1||_self.format<=3){
                _self.baseSecent = Math.pow(10,3-Math.round(_self.format));
            }
        }
        _self.start();
    },
    start:function(){
        var _self=this;
        _self.play = setInterval(function(){
            _self.time-=_self.interval;
            _self.showCountDown();
        },_self.interval);
        var now = new Date();

    },
    showCountDown:function(){
        var _self=this;
        var secends = _self.time;
        var h = Math.floor(secends/3600000);
        var m = Math.floor(secends%3600000/60000);
        var s = Math.floor(secends%60000/1000);
        h = h<10?"0"+h:h;
        m = m<10?"0"+m:m;
        s = s<10?"0"+s:s;
        _self.show = h+":"+m+":"+s;
        if(_self.baseSecent){
            var num = Math.floor(secends%1000/_self.baseSecent);
            var left = num/(1000/_self.baseSecent);
            if(left<0.1){
                num = "0"+num;
            }else if(left<0.01&&left>0){
                num = "00"+num;
            }else if(left==0){
                if(_self.format==2){
                    num = "0"+num;
                }else if(_self.format==3){
                    num = "00"+num;
                }
            }
            _self.show = _self.show+":"+num;
        }
        if(typeof _self.callback=="function"){
            _self.callback(_self,secends);
        }
    },
    stop:function(){
        var _self=this;
        clearInterval(_self.play);
    }
}
function product(data){
    this.spacetime = "";
    this.currenttime = "";            //当前时间
    this.begintime = "";            //促销开始时间
    this.endtime = "";              //促销结束时间
    this.promotionActive="";
    this.prometionAmount = "";      //活动库存
    this.amount = "";                 //库存
    this.timedown = "";             //倒计时
    this.$elem = "";
    this.normalprice = "";
    this.salepric = "";
    this.showtime = "";
    this.showword = "";
    this.status = "";
    $.extend(this,data);
    this.init();
}

product.prototype = {
    init:function(){                //换 差值
        var _self = this;
        _self.$elem.product = function(){
            return _self;
        }
        _self.currenttime = _self.currenttime/1;
        _self.begintime = _self.begintime/1;
        _self.endtime = _self.endtime/1;
        _self.prometionAmount = _self.prometionAmount/1;
        _self.amount = _self.amount/1;
        _self.getState();
    },
    setState:function(){
        var _self=this;
        _self.currenttime+=_self.spacetime;
        //_self.getState();
    },
    getState:function(){
        var _self = this;
        var word = "";
        var starttime = _self.begintime-_self.currenttime;
        var endtime = _self.endtime-_self.currenttime;
        if(starttime > 0) {   
            if(_self.amount>0){                 
                _self.status = "saleunstart";
            }else{
                _self.status = "unstart";
            }      
            _self.createTimeDown(starttime);
        } else {
            if(endtime > 0){
                if (_self.prometionAmount > 0) {
                    _self.status="started";
                    _self.createTimeDown(endtime);
                }else {
                    _self.status="soldout";
                }
            } else {
                if(_self.amount>0){
                    _self.status="narmal";
                }else{
                    _self.status="end";
                }
            }
        } 
        _self.showword(_self);
    },
    parseTime:function(time){
        var _self=this;
        var list = time.split(/[-|\s|:]/g);
        if(list.length == 6){
            return new Date(list[0],list[1]-1,list[2],list[3],list[4],list[5]).getTime();
        }
    },
    createTimeDown:function(time){
        var _self=this;
        _self.timedown = new mtCountDown({
            time:time,            
            timeType:"left",
            interval:_self.spacetime,
            format:0,
            callback:function(obj,secend){              
                if( secend <= 0 ){
                    obj.stop();
                    setTimeout(function(){
                        _self.setState();
                        _self.getState();
                    },_self.spacetime);
                }else{
                    if( _self.showtime&&typeof _self.showtime == "function"){
                        _self.showtime(_self,obj.show);
                    }
                }
                _self.setState();
            }
        });
    }
}