import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Games } from '../../imports/collections/games.js';
import { countdown } from './gameSounds/gameSounds.js';
import './gamePanel.html';

Template.GamePanel.onCreated(function(){
	Session.set('canStartReview', false);
	this.gameId = FlowRouter.getParam('id');
	this.game = Games.findOne(this.gameId);
	this.kifu = this.game.kifu;
	this.gameId = this.game._id;
	this.turn = this.game.turn;
	this.timeFixer = Date.now() - this.game.lastMoveTime;//fixes to correct time after page reload
	this.p1Clock = new ReactiveVar(this.game.p1Time);//clock1
	this.p2Clock = new ReactiveVar(this.game.p2Time);//clock2
	this.p1Time = this.game.p1Time;
	this.p2Time = this.game.p2Time;
	this.lastMoveTime = this.game.lastMoveTime;
	this.countdown = false;
	this.syncFactor = 0;
	Session.set('moveNumBool', true);

	if(this.game.p1 === Meteor.userId()){
		this.player = 1;
	}
	else if(this.game.p2 === Meteor.userId()){
		this.player = 2;
	}
	else{
		this.player = 0;
	}

	if(!this.game.result){
		if(this.turn % 2 === 0){
			this.p1Clock.set(this.game.p1Time - this.timeFixer);
		}
		else{
			this.p2Clock.set(this.game.p2Time - this.timeFixer);
		}
	}

	


	this.clocksObserver = Games.find(this.gameId, {fields: {"result": 1, "p1Time": 1, "p2Time": 1, "turn": 1, "lastMoveTime": 1, "kifu": 1}}).observe({

		changed: (doc)=>{
			var tempTime = Date.now();
			this.p1Clock.set(doc.p1Time);
			this.p2Clock.set(doc.p2Time);

			var tempSync = doc.lastMoveTime - tempTime;
			if(tempSync > this.syncFactor){
				this.syncFactor = tempSync;
				console.log("Your PC clock is unsynced with the global clock");
			} 
			this.game.result = doc.result;
			this.kifu = doc.kifu;
			if(doc.turn !== this.turn && this.countdown === true){
				countdown.pause();
				countdown.currentTime = 0;
				this.countdown = false;
			}
			this.turn = doc.turn;
			this.p1Time = doc.p1Time;
			this.p2Time = doc.p2Time;
			this.lastMoveTime = doc.lastMoveTime;

			//cancels the interval when game is finished
			if(this.game.result !== false){
				this.clockWorker.terminate();
				if(this.countdown === true){
					countdown.pause();
					this.countdown = false;
				}
			}
		}
	});

	//fixes to correct time after reload using this.timeFixer
	if(!this.game.result){
		if(this.turn % 2 === 0){
			this.p1Clock.set(this.game.p1Time - this.timeFixer);
		}
		else{
			this.p2Clock.set(this.game.p2Time - this.timeFixer);
		}
	}

	if(!this.game.result){
		if(typeof(this.clockWorker) == "undefined") {
	    	this.clockWorker = new Worker("/clockWorker.js");
		}
		this.clockWorker.onmessage = ()=>{
			var time;
		    if(this.turn % 2 === 0){
		    	this.p1Clock.set(this.p1Time - this.syncFactor - (Date.now() - this.lastMoveTime));
				time = this.p1Clock.get();
				if(time < 10100 && this.countdown === false){
					countdown.currentTime = Math.max(0, (10000 - time)/1000);
					countdown.play();
					this.countdown = true;
				}
				
				if(this.player === 2 && this.p1Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
			else{
				this.p2Clock.set(this.p2Time - this.syncFactor - (Date.now() - this.lastMoveTime));
				time = this.p2Clock.get();
				if(time < 10100 && this.countdown === false){
					countdown.currentTime = Math.max(0, (10000 - time)/1000);
					countdown.play();
					this.countdown = true;
				}
				
				if(this.player === 1 && this.p2Clock.get() <= 0){
					Meteor.call('games.timeLoss', this.gameId);
				}
			}
		}; 
	}
	this.autorun(()=>{
		var variation = Session.get('myVar');
		if(variation){
			var num = Number(variation[0]) + variation.length - 1;
			document.getElementById('moveNumber').value = num;
		}
	});	

});

/*Template.GamePanel.onRendered(function(){
	if(this.game.result !== false){
		document.getElementById('moveNumber').value = this.game.kifu.length;
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	}
});*/

Template.GamePanel.onDestroyed(function () {
	if(this.clockWorker) {
	    this.clockWorker.terminate();
	}
	
});

Template.GamePanel.helpers({

	moveNumInitialValue: ()=>{
		Meteor.setTimeout(function(){
			Session.set('canStartReview', true);
		}, 20);
		return Template.instance().kifu.length;
	},

  	clock1: ()=> {
  		var rawTime = Math.ceil(Template.instance().p1Clock.get() / 1000);
  		var minutes = Math.floor(rawTime / 60);
  		var seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	clock2: ()=> {
  		var rawTime = Math.ceil(Template.instance().p2Clock.get() / 1000);
  		var minutes = Math.floor(rawTime / 60);
  		var seconds = rawTime - (minutes * 60);
  		return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  	},

  	redClock1: ()=> {
  		return (Math.ceil(Template.instance().p1Clock.get() / 1000) < 11);
  	},

  	redClock2: ()=> {
  		return (Math.ceil(Template.instance().p2Clock.get() / 1000) < 11);
  	},

  	timeInc: ()=> {
  		return "(+" + Template.instance().game.subT + ")";
  	},

  	player1: ()=> {//not supposed to be here
   		var game = Template.instance().game;
    	return game.name1 + "(" + Math.floor(game.rating1) + ")";
  	},

  	player2: ()=> {//not supposed to be here
    	var game = Template.instance().game;
    	return game.name2 + "(" + Math.floor(game.rating2) + ")";
  	},

  	turn: ()=> {
  		var game = Games.findOne(Template.instance().gameId);
  		if(!game.result){
  			if(game.turn % 2 === 0){
  				return game.name1 + "'s turn";
  			}
  			else{
  				return game.name2 + "'s turn";
  			}
  		}
  		else{
  			return game.result;
  		}	
  	}

});


Template.GamePanel.events({

	'click .resign'(event, instance) {
      Meteor.call('games.resign', instance.gameId);
    },

    'click .pass'(event, instance) {
      Meteor.call('games.pass', instance.gameId);
    },

    'click .shareVar'(event, instance) {
    	if(Session.get('myVar'))
     		Meteor.call('messages.variationInsert', Session.get('myVar'), instance.gameId);
    },

    'submit .changeMove'(event, instance){
		event.preventDefault();
		var num = Number(event.target.num.value);
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			var variation = Session.get('myVar');
			if(variation){
				if(num > variation[0] + variation.length - 1){
					document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
			else{
				if(num > instance.kifu.length){
					document.getElementById('moveNumber').value = instance.kifu.length;
				}
				else{
					document.getElementById('moveNumber').value = num;
				}
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .back10'(){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 10;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .back1'(){
		var num = Number(document.getElementById('moveNumber').value);
		num -= 1;
		if(num < 0){
			document.getElementById('moveNumber').value = 0;
		}
		else{
			document.getElementById('moveNumber').value = num;
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .forward1'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 1;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > instance.kifu.length){
				document.getElementById('moveNumber').value = instance.kifu.length;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},

	'click .forward10'(event, instance){
		var num = Number(document.getElementById('moveNumber').value);
		num += 10;

		var variation = Session.get('myVar');
		if(variation){
			if(num > variation[0] + variation.length - 1){
				document.getElementById('moveNumber').value = variation[0] + variation.length - 1;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		else{
			if(num > instance.kifu.length){
				document.getElementById('moveNumber').value = instance.kifu.length;
			}
			else{
				document.getElementById('moveNumber').value = num;
			}
		}
		Session.set('moveNumBool', !Session.get('moveNumBool'));
	},
});