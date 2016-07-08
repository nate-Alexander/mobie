function pageLoad(data){
    this.pagenum = data.pagenum||0;
    this.para={};
    this.$parentelem="";
    this.hasloaded=true;                    //是否加载完成
    this.status="active";
    this.totalpage=1;
    this.onstartload="";                     //function  开始请求是时界面方法
    this.templet = "";                       //string template的innerHTML
    this.template="";
    this.get = "";
    this.callback="";                        //function   请求成功回调
    $.extend(true,this,data);
    this.init();
};
pageLoad.prototype = {
    init : function(){
        var _self = this;
        _self.template = _.template(_self.templet);
    },
    getdata : function(){
        var _self = this;
        if(_self.status=="active"&&_self.hasloaded){
            _self.hasloaded=false;
            if(_self.onstartload||typeof _self.onstartload=="function"){
                _self.onstartload();
            }
            _self.get($.extend({page:_self.pagenum},_self.para),function(result){
                if(result.data.length==0){
                    _self.status="end";
                    _self.callback(result);
                }else if(_self.callback||typeof _self.callback=="function"){
                    _self.callback(result);
                }
                _self.hasloaded=true;
            },function(){
                if(_self.callback||typeof _self.callback=="function"){
                    _self.callback();
                }
                _self.hasloaded=true;
            })
        }
    },
    loaddata:function(){
        
    }
};