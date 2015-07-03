Template.main.helpers({
  meteorUser : function(){
    if (Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  },
  currentUserCount : function(){
    userCount = Stories.findOne({_id:currentStoryId}).queue.length;
    return userCount;
  },
  stories : function(){
    toReturn = Stories.find({_id:currentStoryId});
    return toReturn;
  },
  authors : function(){
    obj = Stories.findOne({_id:currentStoryId}).queue;
    result = [];
    for (var key in obj){
        result.push({authorData:obj[key]});
    }
    return result;
  },
  ableToAdd : function(){
    userCount = Stories.findOne({_id:currentStoryId}).queue.length;
    idToCheck = Meteor.userId();
    if (userCount < 20){
      for(x=0;x<userCount;x++){
        if(idToCheck === Stories.findOne({_id:currentStoryId}).queue[x]._id){
          return false;
        }
      }
      return true;
    }
    else {
      return false;
    }
  },
  isAuthor : function(){
    userCount = Stories.findOne({_id:currentStoryId}).queue.length;
    idToCheck = Meteor.userId();
    for(x=0;x<userCount;x++){
      if(idToCheck === Stories.findOne({_id:currentStoryId}).queue[x]._id){
        return true;
      }
    }
    return false;
  },
  myId : function(id){
    currentId = Meteor.userId();
    if(currentId === id){
      return true;
    } else {
      return false;
    }
  },
  isCurrentAuthor : function(myId){
    console.log('currentauthor');
    currentId = getCurrentAuthor();
    if (myId === currentId){
      return true;
    } else {
      return false;
    }
  }
});

Template.main.events({
  'submit' : function(e,t){
    e.preventDefault();
    myId = Meteor.userId();
    currentId = getCurrentAuthor();
    if (myId === currentId){
      lastText = Stories.findOne({_id:currentStoryId}).text;
      newText = lastText + " " + $('#text-input').val();
      Stories.update({_id:currentStoryId}, { $set: {"text" : newText} } );
      x = currentAuthorNumber;
      userCount = Stories.findOne({_id:currentStoryId}).queue.length;
      if (x+1 === userCount){
        currentAuthorNumber = 0;
      } else {
        currentAuthorNumber = currentAuthorNumber +1;
      }
      $('#text-input').val("");
    } else {
      Materialize.toast('Not your turn yet!', 4000);
    }
  },
  'click .join' : function(e,t){
    e.preventDefault();
    if (Meteor.userId()) {
      sizeOfQueue = Stories.findOne({_id:currentStoryId}).queue.length;
      idToInsert = Meteor.userId();
      if (sizeOfQueue < 20){
        newOrder = sizeOfQueue;
        Stories.update({_id:currentStoryId}, { $push: { queue: {order: newOrder, _id: idToInsert }}});
      }
    }
  }
});

function getCurrentAuthor(){
    if (currentAuthorNumber === undefined){
      currentAuthorNumber = 0;
    }
    x = Session.get("currentAuthorNumber");
    currentAuthor = Stories.findOne({_id:currentStoryId}).queue[x]._id;
    console.log(currentAuthor);
    return currentAuthor;
}
