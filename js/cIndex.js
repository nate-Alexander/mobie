// 图片切换 需要doucument的ready事件后执行   
index = {
    init:function(){
        var _self=this;
        _self.addSilder();
        _self.addPageLoad();  
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });
        _self.showCountDown();
        $(".line-add-cart").click(function(event){   
            event.preventDefault();   
            if($(this).hasClass("can-add-good")){      
                var para = {offerItemId:$(this).data("id"),quantity:1};
                if($(this).hasClass("bond_product")){
                    if(metaoBase.isLogin){
                        var data = [];
                        data.push(para);
                        modelBase.getjsonp("/wap/cart/beforecheckout")({platform:'wap',is_cart_list:0,items:JSON.stringify(data)},function(json){
                            if(json.code==200){
                                var $form = $("#check-out-form");
                                $("#check-out-form input[name='checkId']").val(json.data);
                                $form.submit();
                            }else{
                                if(json.msg){
                                    metaoBase.alert(json.msg);
                                }
                            }
                        },function(){
                            
                        });
                    }else{
                        metaoBase.redirectLogin(window.location.href);
                    }
                }else{
                    metaoCart.addcart(para,function(result){
                        if(result.code=="200"){
                            if(result.msg){                         
                                metaoBase.alert(result.msg);
                            }else{
                                metaoBase.alert("加入购物车成功！");
                            }
                        }else{
                            if(result.msg){                         
                                metaoBase.alert(result.msg);
                            }
                        }
                    })
                }
            }else{
                metaoBase.alert("活动已结束或已抢光！");
            }
        });
    },
    showCountDown:function(){
        modelBase.getjsonp(metaoBase.wwwBasepath+"/time")({},function(json){
            if(json.code==200){                
                $(".line-p-time").each(function(index,elem){
                    var $elem = $(elem);
                    var stime = $elem.data("stime");
                    var etime = $elem.data("etime");
                    var amount = $elem.data("amount");
                    var active = $elem.data("active");
                    var promoamount = $elem.data("promo-amount");
                    new product({
                        spacetime:1000,
                        currenttime:json.time,
                        begintime:stime,
                        endtime:etime,
                        promotionActive:active,
                        prometionAmount:promoamount,
                        amount:amount,
                        $elem:$elem,
                        showtime:function(obj,time){
                            obj.$elem.find(".line-p-time-c").html(time);
                        },
                        showword:function(obj){
                            obj.$elem.find(".line-p-time-c").html("");
                            var $imgp = obj.$elem.parents(".line-p-detail").prev(".line-p-imgb");
                            switch(obj.status){
                                case "saleunstart":
                                    obj.$elem.find(".line-p-time-w").html("距离开始还有：");
                                    obj.$elem.parent().find(".line-add-cart").addClass("can-add-good");
                                    $imgp.append("<img class='hasnot-start' src='"+metaoBase.sourcepath+"/img/H5_jijiangkaishi.png'>");
                                    break;
                                case "unstart":
                                    obj.$elem.find(".line-p-time-w").html("距离开始还有：");
                                    obj.$elem.parent().find(".line-add-cart").removeClass("can-add-good");
                                    $imgp.append("<img class='hasnot-start' src='"+metaoBase.sourcepath+"/img/H5_jijiangkaishi.png'>");
                                    break;
                                case "started":
                                    obj.$elem.find(".line-p-time-w").html("距离结束还有：");
                                    obj.$elem.parent().find(".line-add-cart").addClass("can-add-good");
                                    $imgp.find(".hasnot-start").remove();
                                    break;
                                case "soldout":
                                    if($imgp.find(".has-solded").length==0){
                                        $imgp.append("<img class='has-solded' src='"+metaoBase.sourcepath+"/img/H5_yiqiangguang.png'>");
                                    }
                                    obj.$elem.find(".line-p-time-w").html("<em>活动已结束</em>");
                                    obj.$elem.parent().find(".line-add-cart").removeClass("can-add-good");
                                    $imgp.find(".hasnot-start").remove();
                                    break;
                                case "narmal":
                                    obj.$elem.find(".line-p-time-w").html("<em>已恢复平时售价</em>");
                                    obj.$elem.parent().find(".line-add-cart").addClass("can-add-good");
                                    $imgp.find(".hasnot-start").remove();
                                    break;
                                case "end":
                                    var $imgp = obj.$elem.parents(".line-p-detail").prev(".line-p-imgb");
                                    if($imgp.find(".has-solded").length==0){
                                        $imgp.append("<img class='has-solded' src='"+metaoBase.sourcepath+"/img/H5_yiqiangguang.png'>");
                                    }
                                    obj.$elem.find(".line-p-time-w").html("<em>活动已结束</em>");
                                    obj.$elem.parent().find(".line-add-cart").removeClass("can-add-good");
                                    $imgp.find(".hasnot-start").remove();
                                    break;
                                default:
                                    break;
                            }
                        }  
                    });
                });
            }
        });
    },
    addSilder:function(){
        if($("#slider .swiper-slide").length>1){            
            var mySlider= new Swiper ("#slider",{
                autoplay: 2500,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                loop: true
            });
        }else{
            var mySlider= new Swiper ("#slider",{
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false,
                loop: true
            });
        }
    },
    actlist:new pageLoad({
        $parentelem:$("#list-for-act"),
        templet:$("#actlist").html(),
        get:modelBase.getjsonp(metaoBase.basepath+"/wap/special_data"),
        para:{limit:10,type:"ing"},
        onstartload:function(){
            $("#loading-elem").show();
        },
        callback:function(){
            if(arguments.length>0){
                var data = arguments[0];
                this.pagenum=data.cursor;
                this.totalpage=data.totalPage;
                var $elem = $(this.template(data));
                $elem.find("img.lazy").lazyload({
                    effect: "fadeIn"
                });
                this.$parentelem.append($elem);
            }
            $("#loading-elem").hide();
        }
    }),
    comlist:new pageLoad({
        $parentelem:$("#list-for-come"),
        templet:$("#comlist").html(),
        get:modelBase.getjsonp(metaoBase.basepath+"/wap/special_data"),
        para:{limit:10,type:""},
        onstartload:function(){
            $("#loading-elem").show();
        },
        callback:function(){
            if(arguments.length>0){
                var data = arguments[0];
                this.pagenum=data.cursor;
                this.totalpage=data.totalPage;
                var $elem = $(this.template(data));
                $elem.find("img.lazy").lazyload({
                    effect: "fadeIn"
                });
                $elem.find(".schedul-bt").click(function(){
                    var id=$(this).data("sid");
                    var phone=$(this).prev(".schedul-input").val();
                    if(/^[0-9]{11}$/.test(phone)){
                        modelBase.getjsonp(metaoBase.basepath+"/wap/special/subscribe")({special_id:id,phone:phone},function(json){
                            metaoBase.alert(json.data);
                        },function(){

                        });
                    }else{
                        metaoBase.alert("手机号码有误！");
                    }
                });
                this.$parentelem.append($elem);
            }
            $("#loading-elem").hide();
        }
    }),
    bttop:0,                     //按钮offset top值
    addPageLoad:function(){
        var _self = this;
        var btposition=2;
        var showpart=_self.actlist;   
        setTimeout(function(){
            _self.getBtTop();
        },200);
        $(window).resize(function(){
            setTimeout(function(){
                _self.getBtTop();
            },200);
        }).bind("reheight",function(){
            setTimeout(function(){
                _self.getBtTop();
            },200);
        });
        $(".btlist-b>div").click(function(){
            if(!$(this).hasClass("select")){
                $(".btlist-b>.select").removeClass("select");
                $(".mt-special-content>div").hide();
                if($(this).hasClass("act_bt")){
                    $(".btlist-b .act_bt").addClass("select");
                    $(".btlist-bg").css("margin-left","0");
                    $("#list-for-act").show();
                    showpart=_self.actlist;                  
                }else if($(this).hasClass("come_bt")){  
                    $(".btlist-b .come_bt").addClass("select");   
                    $(".btlist-bg").css("margin-left","50%");                  
                    $("#list-for-come").show();
                    showpart=_self.comlist;
                }
            }
        });
        $(document).scroll(function(){
            //判断页面不在加载数据中，且数据没加载到最后一页
            var scrolltop = $(window).scrollTop();   
            if(_self.isBottom(scrolltop)){
                showpart.getdata();
            }
            if(scrolltop<_self.bttop&&btposition!=0){
                btposition=0;
                $("#btlist-outflow").hide();
            }else if(scrolltop>_self.bttop&&btposition!=1){
                btposition=1;
                $("#btlist-outflow").show();
            }
        });
    },
    getBtTop:function(){
        var _self=this;
        _self.bttop=$("#btlist-inflow").offset().top;
        if($(window).scrollTop()<_self.bttop){
            btposition=0;
            $("#btlist-outflow").hide();
        }else{
            btposition=1;
            $("#btlist-outflow").show();
        }
    },
    isBottom:function(scrolltop){
        var totalHeight = scrolltop+window.innerHeight;
        return $(document).height()-totalHeight<15;
    }
}       
index.init();

(function(){
    var utmsource = metaoBase.getQueryByName("utmsource");
    switch (utmsource){
        case "bdmobsem":
            $("#banner_app_link").attr("href","http://beilouweb.b0.upaiyun.com/public/mobileApp/metao_baidusem.apk");
            break;
        case "bdmobpz":
            $("#banner_app_link").attr("href","http://beilouweb.b0.upaiyun.com/public/mobileApp/metao_baidumobpz.apk");
            break;
        case "sgmob":
            $("#banner_app_link").attr("href","http://beilouweb.b0.upaiyun.com/public/mobileApp/metao_sougousem.apk");
            break;
        case "hsmob":
            $("#banner_app_link").attr("href","http://beilouweb.b0.upaiyun.com/public/mobileApp/metao_m360sem.apk");
            break;
        default :
            break;
    }
})();