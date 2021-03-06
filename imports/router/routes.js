if(Meteor.isClient){
	Accounts.onLogin(function(){
		FlowRouter.go('chat');
	});

	Accounts.onLogout(function(){
		FlowRouter.go('login');
		Meteor.call('users.isChatF');//mabye not have to
	});


	FlowRouter.triggers.enter([function(context, redirect){
		if(!Meteor.userId()){
			FlowRouter.go('login');
		}
	}]);
}	


FlowRouter.route('/', {
	name: 'home',
	action(){
		if(Meteor.userId()){
			FlowRouter.go('chat');
		}
		BlazeLayout.render('HomeLayout')
	}
});

FlowRouter.route('/login', {
	name: 'login',
	action(){
		if(Meteor.userId()){
			FlowRouter.go('chat');
		}
		else{
			BlazeLayout.render('Login');
		}
	}
});

FlowRouter.route('/chat', {
	name: 'chat',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Chat'});
	}
});

FlowRouter.route('/about', {
	name: 'about',
	action(){
		BlazeLayout.render('MainLayout', {main: 'About'});
	}
});

FlowRouter.route('/top100', {
	name: 'top100',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Top100'});
	}
});

FlowRouter.route('/play', {
	name:'play',
	action(){
		BlazeLayout.render('MainLayout', {main:'Play'});
	}
});

FlowRouter.route('/bot', {
	name:'bot',
	action(){
		BlazeLayout.render('MainLayout', {main:'Pvb'});
	}
});

FlowRouter.route('/game/:id', {
	name: 'game',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Pvp'});
	}
});

FlowRouter.route('/profile/:username', {
	name: 'profile',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Profile'});
	}
});

FlowRouter.route('/room/:name', {
	name: 'roomPage',
	action(){
		BlazeLayout.render('MainLayout', {main: 'RoomPage'});
	}
});

FlowRouter.route('/watch', {
	name:'watch',
	action(){
		BlazeLayout.render('MainLayout', {main:'Watch'});
	}
});