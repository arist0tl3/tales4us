Router.route('/', function () {
  this.render('home');
});

Router.route('/stories/:_id',{
    loadingTemplate: 'loading',

    waitOn: function () {
    // return one handle, a function, or an array
    return Meteor.subscribe('stories', this.params._id);
    },

    action: function () {
      this.render('main', {
          data: function(){
              currentStoryId = this.params._id;
          }
      });
    }
});

Router.route('/create', function(){
    if (Meteor.userId()) {
      creatorId = Meteor.userId();
      Stories.insert({text: "", queue: [{_id:creatorId}], currentAuthor: creatorId}, function(error, id){
        Router.go('/stories/'+id);
      });
    } else {
      Router.go('/login');
    }
});

Router.route('/login', function(){
  this.render('login');
});
