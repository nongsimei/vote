/** 通用ajax方法**/
function getData(ajaxURL,data,callback,callbackName){

	if(callbackName){
		if(!window[callbackName]){
			window[callbackName] = function(data){
				callback(data);
			}
			
		}
		$.ajax({
			type : 'get',
			url : ajaxURL,
			data: data || '',
			dataType : 'jsonp',
			jsonpCallback: callbackName,
			cache: true
		});

	}else{
		$.ajax({
			type : 'get',
			url : ajaxURL,
			data: data || '',
			dataType : "jsonp",
			timeout: 3000,
			success : function(data){
				callback(data);
			},
			error: function(data){
				//alert(data);
			}
		});
	}
}


function log (s) {
    window.console && window.console.log && window.console.log(s)
}


var preUrl='http://www.huya.com/hd/questionnaire/index.php?m=Api';



function VoteUtil(options){
	if ( !(this instanceof VoteUtil) ) {
        return new VoteUtil(options)
    }

	this.votedList = {};    // 用户的投票列表
	this.callbacks = $.Callbacks();
	this.checkCallbacks = $.Callbacks();
	this.voteCallbacks = $.Callbacks();
	this.isReady = false;

	this.init(options.quesIds||[]);
}




VoteUtil.prototype={
	constructor: VoteUtil,
	init: function(quesIds){

		var _this=this;

		$.ajax({
	        url: preUrl+'&do=getVoteItem',
	        data:{quesId:quesIds.join(',')},
	        type: 'GET',
	        dataType: 'JSONP',
	        cache: false

	    }).done(function(result){
	        if(+result.status==200){
				_this.votedList=result.data&&result.data||{};

			} else {
	            log('获取投票列表失败：' + result.msg);
	        }

	    }).fail(function(xhr, code) {
	        log('获取投票列表失败：' + code);

	    }).always(function(){ 
	        _this.isReady = true;
	        
	        _this.callbacks.fire();
	        _this.checkCallbacks.fire();
	        _this.voteCallbacks.fire();

	    });
	},
	checkQuesIds: function(quesIds,cbFunc){

		if(this.isReady){
			fn();
		}else{
			this.callbacks.add(fn);
		}

		function fn(){
			check(quesIds,cbFunc);
		}

		var _this=this;

		function check(quesIds,cbFunc){
			var i,j,k,lenI,lenJ,item,
				votedList=_this.votedList;
			for(i=0,lenI=quesIds.length;i<lenI;i++){
				k=quesIds[i];
				item=votedList[k]||[];
				for(j=0,lenJ=item.length;j<lenJ;j++){
					cbFunc(k,item[j]);
				}
			}
		}
		
		
	},
	check: function(quesId, voteId){//查看是否投了某个项


		var _this=this;


		if(this.isReady){
			return check(quesId, voteId);
		}else{
			this.checkCallbacks.add(fn);
		}

		

		function fn(){
			return check(quesId, voteId);
		}

		
		function check(quesId, voteId){
			if(_this.votedIdState){
				return _this.votedIdState[quesId][voteId];
			}else{
				var votedIdState={};
				var j,k,lenJ,item
					votedList=_this.votedList;
				for(k in votedList){
					item=votedList[k];
					for(j=0,lenJ=item.length;j<lenJ;j++){
						if(votedIdState[k]){
							votedIdState[k][item[j]]=true;
						}else{
							votedIdState[k]={};
						}
					}
				}
				_this.votedIdState=votedIdState;
				return votedIdState[quesId][voteId];
			}
		}
	},
	vote: function(quesId,voteId,cbFunc){//投票

		var _this=this;


		if(this.isReady){
			return vote(quesId, voteId, cbFunc);
		}else{
			this.voteCallbacks.add(fn);
		}


		function fn(){
			return vote(quesId, voteId, cbFunc);
		}

		function vote(quesId, voteId,cbFunc){
			getData(preUrl+'&do=doVote',{quesId:quesId,voteId:voteId},function(result){

				if(result.status==200&&result.data&&result.data.status==200){
						cbFunc(quesId,voteId);

				}else{
					log(result.data&&result.data.msg||result.msg)
				}

			});
		}
	}
}


module.exports=VoteUtil;
