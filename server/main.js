import { Meteor } from 'meteor/meteor';
Resolutions = new Mongo.Collection("resolutions");

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.methods({
    addResolution: function (title) {
      Resolutions.insert({
        title: title,
        createdAt: new Date()
      });
    }
    ,
    update: function (id, checked) {
      Resolutions.update(id, { $set: { checked: checked } })
    }
    ,
    delete: function (id) {
      Resolutions.remove(id);

    }
  })

  ServiceConfiguration.configurations.remove({
    service: "google"
  });
  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: "123456789",
    loginStyle: "popup",
    secret: "8j4ldfjSECRET-HEREalkjf8slk"
  });

  ServiceConfiguration.configurations.remove({
    service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '2825859020848709',
    secret: '8616d863fc0a390ae27b9d93d3d954cd'
  });

  Accounts.onCreateUser(function (options, user) {

    if (!user.services.facebook) {
      return user;
    }
    user.username = user.services.facebook.name;
    user.emails = [{ address: user.services.facebook.email }];

    return user;
  });



});
