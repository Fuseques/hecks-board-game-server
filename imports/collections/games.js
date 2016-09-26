import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Rooms } from './rooms.js';

 //collection that holds the players currently playing.
export const Games = new Meteor.Collection('games');
//export const Test = new Meteor.Collection('test');

if (Meteor.isServer) {
  

	Meteor.publish('playerGames', function gamesPublication() {
    if(this.userId){
      return Games.find({result: false, $or:[{p1: this.userId}, {p2: this.userId}]});
    }
  });

  Meteor.publish('playerGameList', function gamesPublication(name) {
    if(this.userId){
      return Games.find({$or:[{name1: name}, {name2: name}]});
    }
  });


	Meteor.publish('singleGame', function singleGamePublication(id) {
    if(this.userId){
    	return Games.find(id);
    }
  });

  Meteor.publish('activeGames', function activeGamesPublication() {
    if(this.userId){
      return Games.find({result: false}, {
        fields: {
          "p1": 1,
          "p2": 1,
          "name1": 1,
          "name2": 1,
          "rating1": 1,
          "rating2": 1,
          "turn": 1,
          "result": 1
        }
      });
    }
  });
}


/*hexs = [
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1]
            ];

dots =  [
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1]
        ];*/

hexs = [
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
        [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      ];

dots = [
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],   
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
      ];

var dotArrayCreator = function(){
  var tempArray = new Array();
  for (i = 0; i < dots.length; i++) {
    tempArray[i] = new Array();
    for(j = 0; j< dots[0].length; j++){
      if(dots[i][j] === 0){
        tempArray[i][j] = 0;
      }
    }
  }
  return tempArray;
}

export function beginMatch(player1, player2, mainT, subT, ranked){
  var randomizer = Math.random();
  if(randomizer > 0.5){
    var tempPlayer = player1;
    player1 = player2;
    player2 = tempPlayer;
  }
  var player1Rating = Meteor.users.findOne(player1).rating;
  var player1Name = Meteor.users.findOne(player1).username;
  var player2Rating = Meteor.users.findOne(player2).rating;
  var player2Name = Meteor.users.findOne(player2).username;
  var tempTime = (new Date).getTime();
  var kifu = new Array();
  console.log(ranked);
  if(!Games.findOne(
  {result: false, $or: [{p1: {$in:[player1, player2]}}, {p2: {$in:[player1, player2]}}]})){
    Games.insert({
      p1: player1,
      p2: player2,
      p1Time: mainT * 1000,
      p2Time: mainT * 1000,
      subT: subT,
      lastMove: false,
      lastMoveTime: tempTime,
      timeStamp: tempTime,
      name1: player1Name,
      name2: player2Name,
      rating1: player1Rating,
      rating2: player2Rating,
      turn: 0,
      result: false,
      passCount: 0,
      kifu: kifu,
      dotsData: dotArrayCreator(),
      ranked: ranked,
      hc: false,
      yLength: 20,
      xLength: 19
    });
  }
}



var opponentHasLibs = (y, x, playah, game)=>{
  dotsData = game.dotsData;
  if(dotsData[y] && dotsData[y][x] && dotsData[y][x] === playah){
    if(!hasLibs(y, x, playah, game)){
      stoneRemover(y, x, playah, dotsData);
    }
  }
}

var stoneRemover = (y, x, playah, dotsData)=>{
  if(dotsData[y] && dotsData[y][x] === playah){
    dotsData[y][x] = 0;
    if(y%2 === 0){
      stoneRemover(y-1, x, playah, dotsData);
      stoneRemover(y+1, x-1, playah, dotsData);
      stoneRemover(y+1, x+1, playah, dotsData);
    }
    else{
      stoneRemover(y-1, x-1, playah, dotsData);
      stoneRemover(y-1, x+1, playah, dotsData);
      stoneRemover(y+1, x, playah, dotsData);
    }
  }
}


var hasLibs = (y, x, playah, game)=>{
  var libsCheckArray = new Array(game.yLength);
  for(i=0; i < game.yLength; i++){
    libsCheckArray[i] = new Array();
  }
  var dotsData = game.dotsData;
  return libsCheck(y, x, playah, libsCheckArray, dotsData);
}

var libsCheck = (y, x, playah, libsCheckArray, dotsData)=>{
  libsCheckArray[y][x] = true;
  if(y%2 === 0)
    return (stoneCheck(y-1, x, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x+1, playah, libsCheckArray, dotsData));     
  else
    return (stoneCheck(y-1, x-1, playah, libsCheckArray, dotsData) || stoneCheck(y-1, x+1, playah, libsCheckArray, dotsData) || stoneCheck(y+1, x, playah, libsCheckArray, dotsData));
}

var stoneCheck = (y, x, playah, libsCheckArray, dotsData)=>{
  if(dotsData[y] && dotsData[y][x] !== undefined){
    if(!libsCheckArray[y][x] && dotsData[y][x] === 0){
      return true;
    }
    else if(!libsCheckArray[y][x] && dotsData[y][x] === playah){
      return libsCheck(y, x, playah, libsCheckArray, dotsData);
    }
    else
      return false;           
  }
}




Meteor.methods({

  'games.timeLoss'(id){
    this.moveTime = (new Date).getTime();//current time
    this.game = Games.findOne(id);
    if(this.userId && this.game && !this.game.result){
      this.turn = this.game.turn;
      this.lastMoveTime = this.game.lastMoveTime;//time of last move played

      //time left for the player
      if(this.turn % 2 === 0){
        this.playerTime = this.game.p1Time;
        modifier = {$set: {
          result: "G+T",
          p1Time: 0
        }};
      }
      else{
        this.playerTime = this.game.p2Time;
        modifier = {$set: {
          result: "S+T",
          p2Time: 0
        }};
      }

      //time left after reducing time spent
      this.playerTime -= this.moveTime - this.lastMoveTime;
      if(this.playerTime <= 0){


        Games.update(id, modifier);

        //rating adjustment
        if (Meteor.isServer && this.game.ranked) {
          if(this.turn > 3){
            Qa = this.game.rating1;
            Qb = this.game.rating2;

            if(this.turn % 2 !== 0){
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }

            else{
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }


            Meteor.users.update(this.game.p1, {$set: {rating: Qa}});

            Meteor.users.update(this.game.p2, {$set: {rating: Qb}});
          }
        }
      } 
    }
  },
  


  'games.makeTurn'(k, m ,id){

    if(Meteor.isServer) {
      check(k, Number);
      check(m, Number);
      this.moveTime = (new Date).getTime();//current time
      this.game = Games.findOne(id);
      if(!this.game || !this.userId){
        return;
      }
      this.dotsData = this.game.dotsData;
      this.turn = this.game.turn;
      this.kifu = this.game.kifu;
      this.yLength = this.game.yLength;
      this.xLength = this.game.xLength;
      this.lastMoveTime = this.game.lastMoveTime;//time of last move played
      this.fischerParam = this.game.subT * 1000; // to be changed later into time setting
      if(this.dotsData[k] && this.dotsData[k][m] !== undefined){
        this.dot = this.dotsData[k][m];
      }
      else{
        return
      }

      //time left for the player
      if(this.turn % 2 === 0){
        this.playerTime = this.game.p1Time;
        player = 1;
        opponent = 2;
      }
      else{
        this.playerTime = this.game.p2Time;
        player = 2;
        opponent = 1;
      }

      
      if(((this.userId === this.game.p1 && this.turn % 2 === 0) || (this.userId === this.game.p2 && this.turn % 2 !== 0)) && this.game.result === false){
        if(this.dot === 0 && hasLibs(k, m, player, this.game)){         
          this.dotsData[k][m] = player;
          //time left after reducing time spent
          this.playerTime -= this.moveTime - this.lastMoveTime - this.fischerParam;
          if(this.playerTime < this.fischerParam){
            Meteor.call('games.timeLoss', id); //need to see if requires to break from method if this is true
          }
          
          var moveString = m.toString(36) + k.toString(36);
          this.kifu[this.kifu.length] = moveString;
          this.lastMove = moveString;

          //dealing with opponent's touching stones

          if(k%2 === 0){
            opponentHasLibs(k-1, m, opponent, this.game);
            opponentHasLibs(k+1, m-1, opponent, this.game);
            opponentHasLibs(k+1, m+1, opponent, this.game);
          }
          else{
            opponentHasLibs(k-1, m-1, opponent, this.game);
            opponentHasLibs(k-1, m+1, opponent, this.game);
            opponentHasLibs(k+1, m, opponent, this.game);
          }




          
          if(this.turn % 2 === 0){
            var modifier = {$set: {
              dotsData: this.dotsData,
              turn: this.turn + 1,
              kifu: this.kifu,
              passCount: 0,
              lastMove: this.lastMove,
              lastMoveTime: this.moveTime,
              p1Time: this.playerTime
            }};
          }
          else{
            var modifier = {$set: {
              dotsData: this.dotsData,
              turn: this.turn + 1,
              kifu: this.kifu,
              passCount: 0,
              lastMove: this.lastMove,
              lastMoveTime: this.moveTime,
              p2Time: this.playerTime
            }};
          }

          //Test.insert({n: this.turn + 1});
          Games.update(id, modifier);
        }
      }
    }
  },

  'games.pass'(id) {
    this.game = Games.findOne(id); 
    if(this.userId && this.game && this.game.result === false){
      this.turn = this.game.turn;
      this.kifu = this.game.kifu
      if((this.userId === this.game.p1 && this.game.turn % 2 === 0) || (this.userId === this.game.p2 && this.game.turn % 2 !== 0)){

        if(this.turn % 2 === 0){
          this.playerTime = this.game.p1Time;
        }
        else{
          this.playerTime = this.game.p2Time;
        }

        var tempPassCount = this.game.passCount;
        var tempTurn = this.game.turn;
        this.moveTime = (new Date).getTime();
        this.lastMoveTime = this.game.lastMoveTime;
        this.fischerParam = this.game.subT * 1000;
        
        this.playerTime -= this.moveTime - this.lastMoveTime - this.fischerParam;
        if(this.playerTime < this.fischerParam){
          Meteor.call('games.timeLoss', this.game._id); //need to consider breaking out of method when reachign here
        }
        
        this.kifu[this.kifu.length] = "pass";
        

        if(this.game.passCount === 1){

          //tells the loop which hexs are legit


          //holds the hexs values while looping
          this.hexsData = [
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                          ];

                      
          this.dotsData = this.game.dotsData;

          //changes values of hexagons
          changeValues = function(y, x, operator){
            if(hexs[y] && hexs[y][x] === 0){
              that.hexsData[y][x] += operator;
            }
          }

          //searching for stones
          that = this;
          for(i = 0; i < dots.length; i++){
            for(j = 0; j < dots[0].length; j++){
              if(dots[i][j] === 0){
                //find the owner
                if(this.dotsData[i][j] === 1){
                  this.operator = 1;
                }
                else if(this.dotsData[i][j] === 2){
                  this.operator = -1;
                }
                else{
                  continue;
                }
                //finds nearby hexagons and updates values
                if(i % 2 === 0){
                  changeValues((i - 2) / 2, j - 2, this.operator);
                  changeValues((i - 2) / 2, j, this.operator);
                  changeValues(i / 2, j - 1, this.operator);
                }
                else{
                  changeValues((i - 3) / 2, j - 1, this.operator);
                  changeValues((i - 1) / 2, j - 2, this.operator);
                  changeValues((i - 1) / 2, j, this.operator);
                }




              }
            }
          }
          var p1Points = 0;
          var p2Points = 0;

          //calculates points of each players in the end
          for(i = 0; i < hexs.length; i++){
            for(j = 0; j < hexs[0].length; j++){
              if(hexs[i][j] === 0){
                if(that.hexsData[i][j] > 0){
                  p1Points ++;
                }
                if(that.hexsData[i][j] < 0){
                  p2Points ++;
                }
              }
            }
          }
          combinedPoints = p1Points - p2Points - 1.5;

          if (Meteor.isServer) {
            
            //rating of players
            Qa = this.game.rating1;
            Qb = this.game.rating2;

            //finds the amount of rating to change and changes it for both players
            if(combinedPoints > 0){
              endText = "S+" + combinedPoints;
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }
            else{
              endText = "G+" + Math.abs(combinedPoints);
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }

            if(this.turn % 2 === 0){
              var modifier = {$set: {
                passCount: tempPassCount + 1, 
                turn: tempTurn + 1,
                kifu: this.kifu, 
                lastMove: "pass",
                lastMoveTime: this.moveTime,
                p1Time: this.playerTime,
                result: endText
              }};
            }
            else{
              var modifier = {$set: {
                passCount: tempPassCount + 1, 
                turn: tempTurn + 1,
                kifu: this.kifu,  
                lastMove: "pass",
                lastMoveTime: this.moveTime,
                p2Time: this.playerTime,
                result: endText
              }};
            }

            //updates games collection with new result
            Games.update(id, modifier);

            if(tempTurn > 2 && this.game.ranked){
              Meteor.users.update(this.game.p1, {$set: {rating: Qa}});

              Meteor.users.update(this.game.p2, {$set: {rating: Qb}});
            }
          }
        }
        else{
          if(this.turn % 2 === 0){
            var modifier = {$set: {
              passCount: tempPassCount + 1, 
              turn: tempTurn + 1,
              kifu: this.kifu, 
              lastMove: "pass",
              lastMoveTime: this.moveTime,
              p1Time: this.playerTime
            }};
          }
          else{
            var modifier = {$set: {
              passCount: tempPassCount + 1, 
              turn: tempTurn + 1,
              kifu: this.kifu,  
              lastMove: "pass",
              lastMoveTime: this.moveTime,
              p2Time: this.playerTime
            }};
          }
          Games.update(id, modifier);
        }
      }
    }
  },

  'games.resign'(id){
    this.game = Games.findOne(id);
    if(this.game && !this.game.result && (this.userId === this.game.p1 || this.game.p2)){

      if(this.game.p1 === this.userId){
        var modifier = {$set: {
          result: "G+R"
        }};
      }
      else if(this.game.p2 === this.userId){
        var modifier = {$set: {
          result: "S+R"
        }};
      }

      if(modifier){  
        Games.update(id, modifier);

        if (Meteor.isServer && this.game.ranked) {
          if(this.game.turn > 3){
            Qa = this.game.rating1;
            Qb = this.game.rating2;

            if(this.game.p2 === this.userId){
              ratingOperator = 40 * (Math.pow(10 , Qb/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa += ratingOperator;
              Qb -= ratingOperator;
            }

            else{
              ratingOperator = 40 * (Math.pow(10 , Qa/400) / (Math.pow(10 , Qa/400) + Math.pow(10 , Qb/400)));

              Qa -= ratingOperator;
              Qb += ratingOperator;
            }

            Meteor.users.update(this.game.p1, {
              $set: {rating: Qa}});

            Meteor.users.update(this.game.p2, {
              $set: {rating: Qb}});
          }
        }
      }
    }
  }

});