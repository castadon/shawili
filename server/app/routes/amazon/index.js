var router = require('express').Router();
var request = require('request');
var cheerio = require('cheerio');
var RSVP = require('rsvp');
var mongoose = require('mongoose');
var Items = mongoose.model("Item");
var User = mongoose.model("User");


module.exports = router;

function getNumPages ( html ) {
	var $ = cheerio.load(html);
	var	num_pages = $('ul.a-pagination').children().length - 2;//Previous and next
	if (!num_pages || num_pages<2) num_pages = 1;
	return num_pages;
}

function getItemsFromPage(url) {
	
	return new RSVP.Promise(function(fulfill, reject) {
    request(url, function(error, response, html){
		if(!error){
			var items = [];
			var $ = cheerio.load(html);
		
			$('a').filter(function(i, el) {
				if ( /^itemName_*/.test($(this).attr('id')) ) {
					
					items.push({ title: $(this).attr('title'), itemId: $(this).attr('id').substr(9) });
				}//if
			});
			fulfill(items);
  	}//if(!error)
  	else reject(error);
	});
  });
}

// Trick : Joe's code for scrapping

// var request = require('request');
// var cheerio = require('cheerio');
// var bluebird = require('bluebird');

// bluebird.promisifyAll(request);

// var promise = request.getAsync('http://www.reddit.com');

// promise.get(1).then(function (htmlbody) {
//  var $ = cheerio.load(htmlbody);
//  console.log($('.title').text());
// });

router.get('/:id', function (req, res, next) {
  
  var url = "http://www.amazon.com/gp/registry/wishlist/" + req.params.id;
  
  return new RSVP.Promise(function(fulfill, reject) {
	
	request(url, function(error, response, html){
		if(!error){
			var num_pages = getNumPages(html);
			var items = [];
  			function add(x, y) {return x.concat(y);}

			for (var i = 1; i <= num_pages; i++) { 
				//setTimeout(
					items.push(getItemsFromPage(url+"?page="+i));
					
				//, 500);
			}

			fulfill( RSVP.all(items).then(function(results) {
				console.log(results.map( function(el){ return el.length;}));
				res.json(results.reduce(add));
				})
			);
		}
		else reject(error);       
	});
	});
});

//Delete items
router.delete('/:id', function (req, res, next) {

console.log("DELETING", req.params.id);

	Items.remove({ user : req.params.id }).exec()
	.then( function(data) {
		console.log('data: ', data )
		res.json(data);
 	})
 	.then(null, function(err){
        console.log(err);
        return err;
    }); 
});


router.post('/getIntersectedMarkers', function (req, res, next) {

	var items = req.body.items;
	var markers = req.body.markers;

	var itemIDs = [];
	for (var i = 0; i < items.length; i++) {
		if ( markers.indexOf( items[i].itemId )>=0 )
		itemIDs.push(items[i].itemId);
	};

	console.log("I am interested in " + itemIDs.length);
 
    Items.aggregate([
  		{ $match : { itemId: { $in: itemIDs } } },
		  { $group: {
			    _id: "$user",
			    items: { $push: { itemId : "$itemId"}}
			  } 
		  }
	]
	, function(err, itemsByUser) {
		if (err) return next(err);

		User.populate(itemsByUser, {path: "_id"}, function(err, populatedItemsByUser){

			var locations = [];
				function getTexts ( arr ) {
					var output = [];
					for (var i = 0; i < arr.length; i++) {
						output.push(arr[i].itemId);
						// Items.findOne({ itemId: arr[i].itemId}, function(err, it){
						// 	console.log(it.title);
						// 	output.push(it.title);
						// })
					}
					console.log(output.join(", "));
					return output.join();
				};

            for (var i = 0; i < populatedItemsByUser.length; i++) {
            	
            	 var obj = { id: i };
            	 obj.text = getTexts(populatedItemsByUser[i].items);
            	 obj.show = false;
				 obj.coords = populatedItemsByUser[i]._id.coords;
				 console.log(obj);
                 locations.push(obj);
            };

           res.send(locations);

		});
	});
});


//Insert items
router.post('/:id', function (req, res, next) {

	console.log("INSERTING ITEMS");

	var itemsToInsert = req.body.items;
	var id = req.params.id;

	for (var i = 0; i < itemsToInsert.length; i++) {
		itemsToInsert[i].user = id;
	};

	 Items.create( itemsToInsert , function (err, itemsInserted) {
	    if (err) return next(err);
	    res.send( itemsInserted );
	  });
});
