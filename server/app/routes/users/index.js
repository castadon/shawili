var router = require('express').Router();
var mongoose = require('mongoose');
var Users = mongoose.model("User");
var ZipCodes = mongoose.model("ZipCode");

//TODO: introduce id and all except de one with the userID
router.get('/getCoordsAndTotals', function (req, res, next) {
  Users.find({}, 'coords total_items', function(err, users) {
    if (err)  { 
        console.log(err);
        return next(err);
      }
    res.send(users);
  });
});

router.get('/:zipCode/zipCode', function (req, res, next) {

  ZipCodes.findOne({ zipCode: req.params.zipCode }, function(err, zC) {
    if (err)  { 
        console.log(err);
        return next(err);
      }

      var coords = {};
      coords.latitude = zC.loc[1];
      coords.longitude = zC.loc[0];

    res.send(coords);
  });
});

router.put('/:id/updateUserTotalItems', function (req, res, next) {

    Users.findById(req.params.id, function (err, user){
      if (err)  { 
        console.log(err);
        return next(err);
      }
      
      user.total_items = req.body.total_items;
      user.save(function(err, savedUser){
         if (err)  { 
        console.log(err);
        return next(err);
      }
         res.send(savedUser);
      });
    });
});

router.put('/:id/updateUserCoords', function (req, res, next) {

    Users.findById(req.params.id, function (err, user){
      if (err)  { 
        console.log(err);
        return next(err);
      }
      
      user.coords = req.body.coords;
      user.save(function(err, savedUser){
         if (err)  { 
        console.log(err);
        return next(err);
      }
         res.send(savedUser);
      });
    });
});

module.exports = router;