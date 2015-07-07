Meteor.methods({
  addText: function(currentStoryId, newText){
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Stories.update({_id:currentStoryId}, { $set: {"text" : newText} } );
    var thisDate = new Date();
    Stories.update({_id:currentStoryId}, { $set: {"lastUpdated" : thisDate} } );
  },
  insertStory: function(creatorId){
    Stories.insert({text: "", queue: [{_id:creatorId}]}, function(error, id){
    });
  },
  resetTime: function(currentStoryId){
    var thisDate = new Date();
    Stories.update({_id:currentStoryId}, { $set: {"lastUpdated" : thisDate} } );
  }
});
