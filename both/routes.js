Router.route('/', function () {
  this.render('home');
});

Router.route('/stories/:_id', function(){
    this.render('main', {
        data: function(){
            var currentStory = this.params._id;
            return Stories.findOne({ _id: currentStory });
        }
    });
});

Router.route('/create', function(){
    Stories.insert({text: ""}, function(error, id){
      Router.go('/stories/:'+id);
    });
});
