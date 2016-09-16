import '../imports/accounts/accounts-config.js';
import '../imports/accounts/loginModal.html';
import '../imports/chat/chat.js';
import '../imports/chat/usersBar.js';
import '../imports/chat/messages.js';
import '../imports/chat/roomsBar.js';
import '../imports/chat/roomPage.js';
import '../imports/play/play.js';
import '../imports/layouts/homeLayout.html';
import '../imports/layouts/mainLayout.js';
import '../imports/partials/header.js';
import '../imports/partials/messanger.js';
import '../imports/partials/sideNav.html';
import '../imports/game/game.js';
import '../imports/game/gamePanel.js';
import '../imports/game/canvas.js';
import '../imports/game/buttons.js';
import '../imports/watch/watch.js';
import '../imports/game/gameChat.js';
import '../imports/profile/profile.js';
import '../imports/userButton/userButton.js';
import '../imports/login/login.js';
import '../imports/router/routes.js';

Meteor.startup(function(){

  $(window).bind('beforeunload', function(event) {
  	event.returnValue = null;
  	if(event.target.location.pathname === '/chat'){
      	closingWindow();
      }
  });

  UI.registerHelper('scrollDown', function(){
      out = Template.instance().messagesContainer;
        if(out){
        isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 30;
        if(isScrolledToBottom){
          setTimeout(function(){//otherwise it runs before DOM is actually updated
              out.scrollTop = out.scrollHeight - out.clientHeight;
          }, 10);   
          
        }
      }
  });

  UI.registerHelper('timeToMinutes', function(time){
      this.time = new Date(time);
      return (pad2(this.time.getHours()) + ":" + pad2(this.time.getMinutes()));
  });

  UI.registerHelper('writterCursor', function(name){
      return Meteor.users.find({username: name});
  });

  UI.registerHelper('mathFloor', function(num){
      return Math.floor(num);
  });

});

closingWindow = function(){
    if(Meteor.userId()){
      Session.set('closingChat', true);
    	Meteor.call('users.isChatF');
	}
}
pad2 = function(number) {
  return (number < 10 ? '0' : '') + number;
}