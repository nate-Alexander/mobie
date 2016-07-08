var metaoCart = {
	Domain:{expires: 1, path: "/", domain: metaoBase.Domain},
	isLogin:metaoBase.isLogin, 
	getadd:modelBase.getjsonp("/wap/cart/add"),
	getlist:modelBase.getjsonp("/wap/cart/list"),
	getedit:modelBase.getjsonp("/wap/cart/edit"),
	getdelete:modelBase.getjsonp("/wap/cart/delete"),
    localcart:function(){
    	var localcart = $.cookie("shoppingCart");
    	if(localcart){
	    	return JSON.parse(localcart);
	    }else{
	    	return [];
	    }
    },
    addcart:function(para,callback,errorback){                   //添加到购物车
    	var _self = this;
    	if(para&&para.hasOwnProperty("offerItemId")&&para.hasOwnProperty("quantity")){
    		if(para.quantity==0){
				if(callback&&typeof callback=="function"){
					callback({code:400,msg:"数量不能为０！"});
				}
				return false;
			}
			if(para.offerItemId==""){
				if(callback&&typeof callback=="function"){
					callback({code:400,msg:"商品规格为空！"});
				}
				return false;
			}
	    	if(_self.isLogin){
	    		var para = {items:"["+JSON.stringify(para)+"]"};
	    		_self.getadd(para,callback,errorback);
	    	}else{
    			
	    		var localcart  = _self.localcart();
	    		var haselem = false;
	    		$.each(localcart,function(index,elem){
	    			if(elem.offerItemId == para.offerItemId){
	    				elem.quantity+=para.quantity;
	    				haselem = index;
	    			}
	    		});
	    		if(haselem===false){
		    		localcart.push(para);
	    		}else{	    			
    				var optionelem = localcart[haselem];
    				localcart.splice(haselem,1);
    				localcart.push(optionelem);
	    		}
	    		_self.savedata(localcart);  			
				if(callback&&typeof callback=="function"){
					callback({code:200});
				}
    		}    	
		}else{
			if(callback&&typeof callback=="function"){
				callback({code:400,msg:"数据格式不正确！"});
			}
		}
    },
    editcart:function(para,callback,errorback){　　　　　　　　　　　　　　　　//编辑购物车
    	var _self = this;
    	if(_self.isLogin){
    		var para = {items:JSON.stringify(para)};
    		_self.getedit(para,callback,errorback);
    	}else{
    		if(para&&para.hasOwnProperty("offerItemId")&&para.hasOwnProperty("quantity")){
	    		var localcart  = _self.localcart();
	    		var haselem = false;
	    		$.each(localcart,function(index,elem){
	    			if(elem.offerItemId == para.offerItemId){
	    				elem.quantity=para.quantity;
	    				haselem = true;
	    			}
	    		});
	    		if(!haselem){
	    			localcart.push(para);
	    		}
	    		_self.savedata(localcart);  			
				if(callback&&typeof callback=="function"){
					callback({code:200});
				}
			}else{
				if(callback&&typeof callback=="function"){
					callback({code:400,msg:"数据格式不正确！"});
				}
			}
    	}
    },
    deletecart:function(para,callback,errorback){						//删除购物车
    	var _self = this;
    	if(_self.isLogin){
    		_self.getdelete(para,callback,errorback);
    	}else{
    		if(para.hasOwnProperty("offerItemId")){
	    		var localcart  = _self.localcart();
	    		var haselem = false;
	    		var cartlength = localcart.length;
	    		for (var i=0;i<cartlength;i++){
	    			if(localcart[i].offerItemId == para.offerItemId){	    				
	    				localcart.splice(i,1);
	    				i--;
	    				cartlength--;
	    			}
	    		}
	    		_self.savedata(localcart);  			
				if(callback&&typeof callback=="function"){
					callback({code:200});
				}
			}else{
				if(callback&&typeof callback=="function"){
					callback({code:400,msg:"数据格式不正确！"});
				}
			}
    	}
    },
    getcartlist:function(para,callback,errorback){								//获取购物车列表
		var _self = this;
		if(_self.isLogin){
			_self.getlist(para,callback,errorback);
		}else{
			if(para.platform="wap"){
	    		var localcart  = _self.localcart();
	    		if(localcart.length==0){
	    			callback({code:200,data:[]});
	    		}else{
		    		var items = JSON.stringify(localcart);
		    		_self.getlist({platform:"wap",items:items},callback,errorback);
		    	}
			}else{
				
			}
		}
    },
    savedata:function(json){
    	var _self=this;
    	$.cookie("shoppingCart",JSON.stringify(json), _self.Domain);
    },
    cleardata:function(){
    	var _self=this;
    	$.removeCookie("shoppingCart", _self.Domain);
    }
}