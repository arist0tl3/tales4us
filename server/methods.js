Meteor.methods({
  addText: function(currentStoryId, newText){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Stories.update({_id:currentStoryId}, { $set: {"text" : newText} } );
  },
  insertStory: function(creatorId){
    Stories.insert({text: "", queue: [{_id:creatorId}]}, function(error, id){
    });
  }
});
