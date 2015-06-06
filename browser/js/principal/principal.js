'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('principal', {
        url: '/principal',
        controller: "PrincipalController",
        templateUrl: 'js/principal/principal.html'
    });
});


app.controller('PrincipalController', function ($scope, $state, uiGmapGoogleMapApi, AuthService, AmazonFactory, LocationFactory) {

    $scope.locations = [];
    //$scope.getQuantityMarkers(); //TODO: it fails!! Dont know why!!!
    
    $scope.map = { center: { latitude: 40.71, longitude: -73.95 }, zoom: 12 };

    $scope.data = {};//TODO: work with the scope.user
    $scope.data.awl_Url = "";//TODO: This must be the user.awl_Url
    $scope.data.zipCode = "";
    $scope.data.agree = false;
    $scope.loading = false;

    $scope.itemList = [];
    $scope.data.matches = [];

    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user;
    });
    
   

    // $scope.locations.push(
    //     {id: 1, 
    //         coords: {
    //     latitude: 40.7151,
    //     longitude: -74.02
    //   }, text : "1", show: true });
    // $scope.locations.push({id: 2, coords: {
    //     latitude: 40.7251,
    //     longitude: -74.1680
    //   }, text : "2", show: false });
    //$scope.getQuantityMarkers();

    //SCOPE METHODS
    $scope.getQuantityMarkers = function() {

        
        $scope.locations = [];
        LocationFactory.getCoordsAndTotals()
        .then( function ( locs ) {
           
            var newLocs = [];

            for (var i = 0; i < locs.length; i++) {

                var obj = { id: i };
                obj.coords = locs[i].coords;
                obj.text = locs[i].total_items + "items" ;
                obj.show = true;

                $scope.locations.push(obj);
            }
        });
    };

    $scope.scrape = function() {
 
        $scope.locations = [];//We first delete the previous markers
        $scope.loading = true;

        AmazonFactory.getItems( $scope.filterAmzUrl( $scope.data.awl_Url ) )
        .then( function (itemList)
            {

                $scope.itemList = itemList;
                $scope.checkAll();

                LocationFactory.updateUserTotalItems ( $scope.user._id, $scope.itemList.length );
                console.log( $scope.data.zipCode );
                LocationFactory.getUserCoords ( $scope.data.zipCode ) //From Zip to Coords
                .then( function (coords)
                {
                  LocationFactory.updateUserCoords ( $scope.user._id, coords );

                });
                //TODO: DELETE callback not going!!! ---> solved returning json
                AmazonFactory.deleteItems( $scope.user._id ).then( function ( itemsDeleted )
                {
                    LocationFactory.getIntersectedMarkers ( $scope.itemList, $scope.data.matches )
                    .then( function ( markers ) {
                        $scope.locations = markers;
                    });
                 console.log("Lets set!", $scope.itemList.length);
                 AmazonFactory.setItems( $scope.user._id, $scope.itemList ).then( function ( itemsInserted )
                     {
                         console.log( itemsInserted );
                     });
                });
                $scope.loading = false;
             });
    };

     $scope.updateMap = function( i ) {

        //alert("A"); console.log($scope.itemList); console.log($scope.data.matches);

        LocationFactory.getIntersectedMarkers ( $scope.itemList, $scope.data.matches )
        .then( function ( markers ) {
            $scope.locations = markers;
        });
    };

    $scope.checkAll = function() {
        $scope.data.matches = $scope.itemList.map(function(item) { return item.itemId; });
    };
    $scope.uncheckAll = function() {
        $scope.data.matches = [];
    };

    $scope.filterAmzUrl = function( url ) {
         var re = new RegExp("^https:\/\/www.amazon.com\/gp\/registry\/wishlist\/*");
        if (re.test( url )) return url.substr(44,57);

        re = new RegExp("^http:\/\/www.amazon.com\/gp\/registry\/wishlist\/*");
        if (re.test( url )) return url.substr(43,56);
        
        re = new RegExp("^http:\/\/amzn.com\/w\/*");
        if (re.test( url )) return url.substr(18, 31);

        else return null;
    };

});