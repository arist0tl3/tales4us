Stories = new Mongo.Collection("stories");

Stories.allow({
  insert: function(userId, doc){
    // only allow posting if you are logged in
    return !! userId;
  },
  update: function(userId, doc){
    // only allow posting if you are logged in
    return !! userId;
  }
});
