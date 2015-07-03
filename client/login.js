Template.login.helpers({
  meteorUser : function(){
    if (Meteor.userId()) {
      return true;
    } else {
      return false;
    }
  }
});
