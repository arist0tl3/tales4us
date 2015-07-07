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
  amICurrentAuthor: function(id){
    currentAuthor = getCurrentAuthor();
    if(id === currentAuthor){
      return true;
    } else {
      return false;
    }
  },
  timeRemaining: function(){
    var currentTime = Session.get("time");
    var lastUpdated = Stories.findOne({_id:currentStoryId}).lastUpdated.valueOf();
    var difference = currentTime - lastUpdated;
    difference = difference / 1000;
    difference = Math.round(difference);
    difference = 60 - difference;
    Session.set("difference", difference);
    return difference;

  }
});


Template.main.events({
  'submit' : function(e,t){
    e.preventDefault();
    currentAuthor = getCurrentAuthor();
    thisId = Meteor.userId();
    if (thisId === currentAuthor){
      lastText = Stories.findOne({_id:currentStoryId}).text;
      idToInsert = Meteor.userId();
      newText = lastText + "<span title=' Posted by: " + idToInsert +"'>" + $('#text-input').val() + "</span> ";
      Meteor.call("addText", currentStoryId, newText);
      $('#text-input').val("");
      getNextAuthor();
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
        Stories.update({_id:currentStoryId}, { $push: { queue: {_id: idToInsert }}});
      }
    }
  },
  'click .getText' : function(e,t){
    e.preventDefault();
    var x=window.open();
    x.document.open();
    content = Stories.findOne({_id:currentStoryId}).text;
    x.document.write(content);
    x.document.close();
  }
});

function getCurrentAuthor(){
  idToReturn = Stories.findOne({_id:currentStoryId}).currentAuthor;
  return idToReturn;
}

function getNextAuthor(){
  currentAuthor = getCurrentAuthor();
  obj = Stories.findOne({_id:currentStoryId}).queue;
  array = [];
  for(x=0;x<obj.length;x++){
    array.push(obj[x]._id);
  }
  var a = array.indexOf(currentAuthor);
  if (a+1 >= obj.length){
    nextAuthor = array[0];
  } else {
    nextAuthor = array[a+1];
  }
  Stories.update({_id:currentStoryId}, {$set: {currentAuthor: nextAuthor}});
}

Meteor.setInterval(function() {
    if(Session.get("difference") <= 0){
      getNextAuthor();
      Meteor.call("resetTime", currentStoryId);
    }
    var date = new Date();
    var currentTime = date.valueOf();
    Session.set('time', currentTime);
}, 1000);
