// CALL FUNCTION
$(document).ready(function(){
  initialize();
  // autoComplete();
});

// VARIABLES

// Custom styles for map
var styles = [
  {
    stylers: [
      { hue: "#2397BA" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "on" }
    ]
  }
];

var myLatlng = new google.maps.LatLng(40.757975,-73.9752290);
var mapOptions = {
  zoom: 13,
  center: myLatlng
}

var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
var markers = [];
var permanentMarkers = [];
var infoWindowNew = new google.maps.InfoWindow();

// MAIN FUNCTION
function initialize() {

  //I ADDED THIS STUFF -- IT GETS A REFERENCE TO THE MARKER
  var input = document.getElementById('pac-input');
  var markerNew = new google.maps.Marker({
    map: map
  });
  // this pushes the marker to the top left position on the map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // this makes the input box into a new autocomplete thing
  var autocomplete = new google.maps.places.Autocomplete(input);
  // this fixes the autocomplete to the bounds of the map so the top results are in your area
  autocomplete.bindTo('bounds', map);

  // this event listener i took from him. it puts down a marker when you change the place, meaning that you type in something and hit enter
  // NOTE: I also had to put in a new info window up above just to make it work; you can do whatever you want but you need to create a new info window to display the places stuff
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infoWindowNew.close();
    markerNew.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    markerNew.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    markerNew.setPosition(place.geometry.location);
    markerNew.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infoWindowNew.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infoWindowNew.open(map, markerNew);
  });

  // THIS IS THE END OF THE STUFF I ADDED.

  // Incorporate styles
  map.setOptions({styles: styles}); 
  addSelected();

  // Toggle 'all' to control other selectors
  $("#filters li").first().on('click',function(){
    console.log(this);
    $(this).toggleClass("");
    if($(this).hasClass("selected")){
      $(this).nextAll().removeClass("selected");
      addSelected();
    } else {
      $(this).nextAll().addClass("selected");
      addSelected();
    }
  })

  // Toggle 'selected' class for each filter
  $("#filters li").on('click',function(){
    $(this).toggleClass("selected");
    addSelected();
  })

  // Add all the lists (of objects) into the selected_lists array to start 
  function addSelected(){
    clearMarkers(); 
    markers = [];
    var selected_lists=[];

    $("#filters li.selected").each(function(){  
      list_name = $(this).text();
      for (var key in gon.places_hash) {
        if (list_name == key){
          selected_lists.push(gon.places_hash[key])
        }
      }  
    })

    // Create markers for all places in selected_lists
    for (i=0; i < selected_lists.length; i++){
      for (x=0; x < selected_lists[i].length; x++){
        var name = selected_lists[i][x].name;    // index 0
        var lat = selected_lists[i][x].lat;      // index 1
        var long = selected_lists[i][x].long;    // index 2
        var id = selected_lists[i][x].id;        // index 3
        var marker = [name,lat,long, id];
        markers.push(marker);
        placeMarkers();
        
      }
    }
  }

  // clears array of permanentMarkers
  function clearMarkers(){
    for (var i=0; i<permanentMarkers.length; i++){
      permanentMarkers[i].setMap(null);
    }
  }
  
  // Place markers on map
  function placeMarkers(){
    var i;
    
    for (i = 0; i < markers.length; i++) {  
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markers[i][1], markers[i][2]), // lat/long coordinates
            map: map,
            icon: "dot.png"
        });

        permanentMarkers.push(marker); // keep track of google objects

        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
            return function() {
                // infowindow.setContent(markers[i][0], markers[i][1]); // default infowindow
                infowindow.setContent($("#tooltip_"+markers[i][3]).clone()[0]); // set info window to div
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
  }
  function autoComplete(){
    var input = /** @type {HTMLInputElement} */(
    document.getElementById('pac-input'));
    
    var types = document.getElementById('type-selector');
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var new_marker = new google.maps.Marker({
      map: map
    });

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      new_marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      new_marker.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      new_marker.setPosition(place.geometry.location);
      new_marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, new_marker);

      console.log(place.photos);
      // POPULATE HIDDEN FORM FIELDS
      $("#placeid").val(place.id);
      $("#name").val(place.name);
      $("#latitude").val(place.geometry.location.d);
      $("#longitude").val(place.geometry.location.e);
      $("#phone").val(place.formatted_phone_number);
      $("#address").val(place.formatted_address);
      // $("#city").val(place.address_components[5].short_name); // inaccurate
      // $("#state").val(place.address_components[7].short_name); // inaccurate
      // $("#postal").val(place.address_components[6].short_name); // inaccurate
      // $("#country").val(place.address_components[6].short_name); // inaccurate
      $("#website").val(place.website);

    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      google.maps.event.addDomListener(radioButton, 'click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);


  }

}

// Hover effects
$("li.place a").on('mouseover', function(){
  var coordinates = $(this).data('url');
  // need to show the infowindow on the map for the marker at these coordinates
})

// Toggle recommendations
$('#hiderecs').on('click', function(){
  console.log("hi")
})


// Toggle sidenav
$("#view").on('click', function(){
  if ($(this).hasClass('hide')) {
    $('.sidenav').animate({width:'300px', padding:'20px'},500);
    $(this).removeClass('hide');
  } else { 
    $('.sidenav').animate({width:'0px', padding:'0px'},500);
    $(this).addClass('hide');
  }
})

// Toggle lists
$(".list-title").on('click', function(e){
  e.preventDefault();
  $(this).next().find('li').slideToggle();
})

// Show tooltip on sidenav hovers 
$('li.place').on("mouseover", function(){
  var place_id = ($(this).find('a')[0].id);
  var infowindow_id = place_id.replace("place","tooltip");
  // $("#"+infowindow_id).parent().parent();
  console.log($("#"+infowindow_id));


})