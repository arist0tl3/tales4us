Router.route('/', function () {
  this.render('home');
});

Router.route('/stories/:_id', function(){
    this.render('main', {
        data: function(){
            currentStoryId = this.params._id;
        }
    });
});

Router.route('/create', function(){
    if (Meteor.userId()) {
      creatorId = Meteor.userId();
      Stories.insert({text: "", queue: [{order:1, _id:creatorId}]}, function(error, id){
        Router.go('/stories/'+id);
      });
    } else {
      Router.go('/login');
    }
});

Router.route('/login', function(){
  this.render('login');
});
