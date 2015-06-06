app.factory('AmazonFactory', function ($http) {

    return {
        getItems: function ( url ) {

        return $http.get('/api/amazon/'+url ).then(function (response) {
        	//console.log("We got this number of items: ", response.data.length);
                return response.data;
            });
        },

        deleteItems: function ( id ) {

        return $http.delete('/api/amazon/'+id).then(function (response) {
            console.log( "After calling the factory", response); 
                return response;
            })
            .then(null, function(err){
                console.log('err: ', err);
            });
            
        },

        setItems: function ( id, items ) {

        return $http.post('/api/amazon/'+id, { items: items }).then(function (response) {
                return response.data;
            });
            
        }//setItems
    };

});


		
