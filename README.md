# vote
虎牙投票


voteM=VoteUtil({
		quesIds: [28,29,30,31,59,60,61,62,63,66,67,57]
	});
	
//cbFunc针对该问卷的已投项进行的处理
//cbFunc(quesId,voteId){}
voteM.checkQuesIds([28,29,30,31,57],cbFunc)	//对于已投项的处理
	
	
//cbFunc是投票成功之后的操作
//cbFunc(quesId,voteId){}

voteM.vote(quesId,voteId,cbFunc);//投票
