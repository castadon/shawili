app.factory('LocationFactory', function ($http) {

    return {
        getUserCoords: function ( zipCode ) {

        
            return $http.get('/api/users/'+zipCode+"/zipCode" ).then(function (response) {
                
                return response.data;
            });

// TODO: Ver porque fallan estos metodos para llamar a este API
//         return $http({
//         	method: 'JSONP',
//         	url: 'http://www.zipcodeapi.com/rest/Fe9rSxINGAxr5tX1Xh6sMuDSkhwiq1J5gTx9rgW8QuzWYxYVP4oBy1uTj0bJ2VPi/info.json/'
//         	+zipCode+"/degrees?callback=JSON_CALLBACK", responseType: "json"
//      		})
//         .success(function(data, status, headers, config){
//       		console.log( "response", data ); return data;
//     	})
//     	.error(function(data, status, headers, config){
//       		console.log( "ERROR", data );
//     	})

//     return $.ajax({
//    type: 'GET',
//    url: 'http://www.zipcodeapi.com/rest/Fe9rSxINGAxr5tX1Xh6sMuDSkhwiq1J5gTx9rgW8QuzWYxYVP4oBy1uTj0bJ2VPi/info.json/'
//         +zipCode+"/degrees",
//    data: "json",
//    success: function (responseData) {
//          console.log( "response", responseData ); return responseData;
//    }
// });  net::ERR_BLOCKED_BY_CLIENT
            
        },

        updateUserTotalItems: function ( id, total_items ) {


		return $http.put('/api/users/'+id+'/updateUserTotalItems', { total_items : total_items } )
		.then(function (response) {
                return response.data;
            });


        },

        updateUserCoords: function ( id, coords ) {


		return $http.put('/api/users/'+id+'/updateUserCoords', { coords : coords } )
		.then(function (response) {
                return response.data;
            });


        },

        getCoordsAndTotals: function () {

        return $http.get('/api/users/getCoordsAndTotals')
        .then(function (response) {
                return response.data;
            });


        },

        getIntersectedMarkers: function( items, markers ) {

            return $http.post('/api/amazon/getIntersectedMarkers', { items : items, markers : markers })
            .then(function (response) {
                console.log("LocationFactory ", response.data);
                return response.data;
            });
        }
    };

});
