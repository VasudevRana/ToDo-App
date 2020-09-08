
import './main.html';


Resolutions = new Mongo.Collection("resolutions");



if (Meteor.isClient) {


  Meteor.subscribe("resolution");

  Template.body.helpers({
    resolutions: function () {

      return Resolutions.find();

    }
  });

  Template.body.events({
    'submit .new-todo ': function (event) {
      var title = event.target.title.value;
      Meteor.call("addResolution", (title));

      event.target.title.value = "";
      return false;
    }

  });
  Template.resolution.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  })

  Template.resolution.events({
    'click .strikethrough': function () {
      Meteor.call("update", this._id, !this.checked)

    },
    'click .delete': function () {
      Meteor.call("delete", this._id);
    },
    'click .toggle-private': function () {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });



  //   Template.login.events({
  //     'click .login-facebook': function(e) {
  //         e.preventDefault();

  //         Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
  //             if (err) {
  //                 console.log('Handle errors here: ', err);
  //             }
  //         });
  //     }
  // });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

    Meteor.methods({
      addResolution: function (title) {
        Resolutions.insert({
          title: title,
          createdAt: new Date(),
          owner: Meteor.userId()
        });
      }
      ,
      update: function (id, checked) {
        Resolutions.update(id, { $set: { checked: checked } })
      }
      ,
      delete: function (id) {
        Resolutions.remove(id);

      },
      setPrivate: function (id, private) {
        var res = Resolutions.findOne(id);

        if (res.owner !== Meteor.userId()) {
          throw new Meteor.Error('not-authorized');
        }
        Resolutions.update(id, { $set: { private: private } })
      }
    })
  })


  Meteor.publish("resolution", function () {
    return Resolutions.find();
  })
}



