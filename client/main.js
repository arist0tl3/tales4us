Template.main.helpers({
  getChapterText : function(){
    return Chapters.findOne().text;
  },
  meteorUser : function(){
    if (Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },
  currentUserCount : function(){
    return Meteor.users.find().count();
  }
});

Template.main.events({
  'submit' : function(e,t){
    e.preventDefault();
    lastText = this.text;
    id = this._id;
    newText = lastText + " " + $('#text-input').val();
    Stories.update({_id : id}, { $set: {"text" : newText} } );
    $('#text-input').val("");
  }
});
