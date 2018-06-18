$( document ).ready(function() {
  // https://github.com/wbkd/d3-extended
     d3.selection.prototype.moveToFront = function() {
       return this.each(function(){
         this.parentNode.appendChild(this);
       });
     };
     d3.selection.prototype.moveToBack = function() {
         return this.each(function() {
             var firstChild = this.parentNode.firstChild;
             if (firstChild) {
                 this.parentNode.insertBefore(this, firstChild);
             }
         });
     };

 var dateFormat = d3.time.format("%a, %b %d %I%p");
 var dayFormat =d3.time.format("%a, %b %d");
 var hourFormat = d3.time.format("%I%p")

 var format = d3.time.format("%Y-%m-%d");


 var dispatch = d3.dispatch('changeplaces', 'listclick', 'circleclick');
 var map, mapPoints, places;





  var screenHeight = window.innerHeight;
  var screenWidth = window.innerWidth;
  var centerxy = [-71.117775, 42.339978]
  var defZoom = 10;
  var inZoom = 15;
  var offsetLng = -.001;


 if (screenWidth >1024){
    centerxy = [-71.117775, 42.339978];
    defZoom = 11;
    inZoom = 15;
  }
  else if (screenWidth > 768 && screenWidth <= 1024){
    centerxy = [-71.117775, 42.339978];
    defZoom = 11;
    inZoom = 14;
  }
  else if (screenWidth > 500 && screenWidth <= 768){
    centerxy = [-71.117775, 42.339978];
    defZoom = 11;
    inZoom = 12;
    offsetLng = -.01;

  } else if (screenWidth <=500){
    centerxy = [-71.068191, 42.347842];
    defZoom = 9;
    inZoom = 13;
  }


$('#zoomout').on('click', function(){
	zoomOutMap()
})
 $(window).bind("resize", zoomOutMap);

 function zoomOutMap(){
     map.flyTo({
		center: [centerxy[0], centerxy[1]],
       	zoom: defZoom
     })
 }




  var neighborhoodSel = d3.select("#neighborhood-select")
    .append("select")
    .attr("id", "neighborhood");

  neighborhoodSel.append("option")
    .attr("value", "all")
    .html("All")

  var costSel = d3.select("#cost-select")
    .append("select")
    .attr("id", "cost");

  costSel.append("option")
    .attr("value", "all")
    .html("All")


  var catSel = d3.select("#category-select")
    .append("select")
    .attr("id", "category");

  catSel.append("option")
    .attr("value", "all")
    .html("All")


  var timeSel = d3.select("#time-select")
    .append("select")
    .attr("id", "time");

  timeSel.append("option")
    .attr("value", "all")
    .html("All")




 queue()
  //.defer(d3.csv, "data.csv", parseData)
  .defer(d3.csv, "/interactive/2018/07/4thOfJuly/dist/data/data.csv", parseData)
  .await(dataLoaded);

  function isSecure()
   {
     if (location.protocol == 'https:'){
       return 'https';
     } else {
       return 'http';
     }
   }



 function parseData(d){
   return{
     name: d.name,
     subname: d.subname,
     description: d.description,
     address: d.address,
     location: d.location,
     lat: +d.latitude,
     lng: +d.longitude,
     neighborhood: d.neighborhood,
     startDate: d.start_date,
     endDate: new Date(d.end_date),
     date: d.start_date,
     displayDate: d.display_date,
     timeOfDay: d.time_of_day,
     category: d.category,
     cost: d.cost,
     img: d.image,
     url: d.link,
     id: +d.id,
     sortDate: d.start_date_sort
   }
 }

// redraw on all dropdown events
 dispatch.on('changeplaces', function(d){
	zoomOutMap();
	drawList(d)
	drawPoints(d)
 })


 dispatch.on('listclick', function(d){
     map.flyTo({
      center: new L.LatLng(d.lat, (d.lng + offsetLng)),
       zoom: inZoom
     })

 var container = $('#list-container'),
     scrollTo = $('#'+d.id);
     container.animate({scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()});

 })

 dispatch.on('circleclick', function(d){

	d3.selectAll("#full-info").html("")
   d3.selectAll(".listDiv").classed("listDivSel", false)
   var container = $('#list-container'),
     scrollTo = $('#'+d.id);
     container.animate({scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()});

     var selLi = d3.selectAll(".listDiv").filter(function(e){
      return e.id == d.id;
     })

     selLi.classed("listDivSel", true);


     var location;

     if (d.location != "None"){
     	location = d.location + "<br>" + d.address
     } else{
     	location = d.address
     }

     selLi.select("#full-info").html("<div class='ser-sm-light'>" + d.description + "<div class='san-xs'>" + location + "</div><a class='san-xs' target='_blank' href='" + d.url + "'>Visit site</a>")

     map.flyTo({
       center: new L.LatLng(d.lat, (d.lng + offsetLng)),
       zoom: inZoom
     })

 })




function fillInfo(this_, d){
	d3.selectAll("#full-info").html("")

     var location;

     if (d.location != "None"){
     	location = d.location + "<br>" + d.address
     } else{
     	location = d.address
     }

     this_.select("#full-info").html("<div class='ser-sm-light'>" + d.description + "<div class='san-xs'>" + location + "</div><a class='san-xs' target='_blank' href='" + d.url + "'>Visit site</a>")


}



 function dataLoaded(error, data){

   categoryList = [];
   neighborhoodList = [];
   costList = [];
   timeList = [];


   data.forEach(function(d){


      	d.date = new Date(d.date)
        d.LatLng = new L.LatLng(d.lat, d.lng)

        var category = d.category.split(", ")
        d.category = category;

        var timeOfDay = d.timeOfDay.split(", ")
        d.timeOfDay = timeOfDay;

        var neighborhood = d.neighborhood.split(", ")
        d.neighborhood = neighborhood;

        var cost = d.cost.split(", ")
        d.cost = cost;


        timeOfDay.forEach(function(e){
        	timeList.push({time:e})
        })

        cost.forEach(function(e){
        	costList.push({cost: e})
        })

        category.forEach(function(e){
          categoryList.push({category: e})
        })
        neighborhood.forEach(function(e){
          neighborhoodList.push({neighborhood:e})
        })


   })


// console.log("data", data)

// var today = new Date();

// data = data.filter(function(d) {
//   return d.endDate <= today;
// })





 var categoryNest = d3.nest().key(function(d){ return d.category }).entries(categoryList)
 var costNest = d3.nest().key(function(d){ return d.cost}).entries(costList)
 var neighborhoodNest = d3.nest().key(function(d){ return d.neighborhood}).entries(neighborhoodList)
 var timeNest = d3.nest().key(function(d){ return d.time}).entries(timeList)

 d3.select('#cost').selectAll('options')
   .data(costNest)
   .enter()
   .append('option')
   .html(function(d){ return d.key})
   .attr('value', function(d){ return d.key})

 d3.select('#category').selectAll('options')
   .data(categoryNest)
   .enter()
   .append('option')
   .html(function(d){ return d.key})
   .attr('value', function(d){ return d.key})

 d3.select('#neighborhood').selectAll('options')
   .data(neighborhoodNest)
   .enter()
   .append('option')
   .html(function(d){ return d.key})
   .attr('value', function(d){ return d.key})

 d3.select('#time').selectAll('options')
   .data(timeNest)
   .enter()
   .append('option')
   .html(function(d){ return d.key})
   .attr('value', function(d){ return d.key})

 places = crossfilter(data)
   var placesByCategory = places.dimension(function(d){ return d.category });
   var placesByCost = places.dimension(function(d){ return d.cost});
   // var placesByStartDay = places.dimension(function(d){ return d.startDay});
   var placesByNeighborhood = places.dimension(function(d){ return d.neighborhood});
   var placesByTime = places.dimension(function(d){ return d.timeOfDay});


 d3.select('#category').on('change', function(){
   var val = this.value;
   if(val =="all"){placesByCategory.filter(null);}
   else{
     placesByCategory.filter(function(d){
       var type = d;
       var contains = type.includes(val)
       if(contains==true){
         return true;
       }
     });
   }
   dispatch.changeplaces(placesByCategory.top(Infinity));
 })

 d3.select('#cost').on('change',function(){
    var val = this.value;
     if(val =="all") placesByCost.filter(null);
     else {placesByCost.filter(this.value);}
     dispatch.changeplaces(placesByCost.top(Infinity));
 })


 d3.select('#neighborhood').on('change', function(){
   var val = this.value;
   if(val =="all"){placesByNeighborhood.filter(null);}
   else{
     placesByNeighborhood.filter(function(d){
       var type = d;
       var contains = type.includes(val)
       if(contains==true){
         return true;
       }
     });
   }
   dispatch.changeplaces(placesByNeighborhood.top(Infinity));
 })

 d3.select('#time').on('change', function(){
   var val = this.value;
   if(val =="all"){placesByTime.filter(null);}
   else{
     placesByTime.filter(function(d){
       var type = d;
       var contains = type.includes(val)
       if(contains==true){
         return true;
       }
     });
   }
   dispatch.changeplaces(placesByTime.top(Infinity));
 })


 drawMap()
 drawPoints(data)
 drawList(data)

 }



 function drawMap(){

    mapboxgl.accessToken = 'pk.eyJ1IjoiaGFtb29yZSIsImEiOiJjamlrOWRwb2gyMnMzM2twbmIwaHdqbXl4In0.ehm9IfxQZGtrgVaSIP6ZCA';
    map = new mapboxgl.Map({
       container: 'fireworksMap',
       style: 'mapbox://styles/hamoore/cjikd3tpx3e2k2spiw399kz70',
       center: [centerxy[0], centerxy[1]],
       zoom: defZoom,
    });

  //map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  //map.scrollZoom.disable();

  var container = map.getCanvasContainer()
  var svg = d3.select(container).append("svg")

     g = svg.append("g")

   var transform = d3.geo.transform({point: projectPoint});
   var path = d3.geo.path().projection(transform);

   function projectPoint(lon, lat) {
       var point = map.project(new mapboxgl.LngLat(lon, lat));
       this.stream.point(point.x, point.y);
   }
 }

 function project(d) {
   return map.project(getLL(d));
 }
 function getLL(d) {
   return new mapboxgl.LngLat(+d.lng, +d.lat)
 }
 function render() {
   mapPoints.attr({
     cx: function(d) {
       var x = project(d).x;
       return x
     },
     cy: function(d) {
       var y = project(d).y;
       return y
     },
   })
 }
var radiusSm = 4;
var radiusMd = 5.5;
var radiusLg = 10;

 function drawPoints(data){

   mapPoints = g.selectAll(".mapCircles")
     .data(data)

  mapPoints.exit().remove();

   var mapPointsEnter = mapPoints.enter()
      .append("circle")
      .attr("class", "mapCircles")
      .classed("nonselCircles", true)
      .attr("r", radiusSm)
      .on('click', function(d){
         clickMapCircle(d)
         dispatch.circleclick(d)
      })
      .on('mouseover', function(d){
        hoverMapCircle(d)
      })
      .on("mouseleave", function(d){
        leaveMapCircle()
      })


   map.on("viewreset", function() { render() })
   map.on("move", function() { render() })
   render()

 }

function leaveMapCircle(){
  g.selectAll(".nonselCircles").attr("r", radiusSm)
}

function hoverMapCircle(d){

  var selCircle = g.selectAll(".nonselCircles").filter(function(e){
    return e.id == d.id
  })
  selCircle.attr("r", radiusMd)
 }

function clickMapCircle(d){
  //add the nonsel class to all
  g.selectAll(".mapCircles").classed("nonselCircles", true).attr("r", radiusSm)
  // reference the clicked one
  var selCircle = g.selectAll(".mapCircles").filter(function(e){
    return e.id == d.id
  })
  // remove nonsel class so the hover state ignors it
  selCircle.classed("nonselCircles", false).attr("r", radiusLg)

}

 function drawList(data){



  d3.selectAll(".listDiv").remove()

  data = data.sort(function(x, y){ return d3.ascending(x.id, y.id); })

  var listDiv = d3.select("#list-container")
    .selectAll(".listDiv")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "listDiv")
    .attr("id", function(d){ return d.id })
    .on("click", function(d){
      var this_ = d3.select(this);
      fillInfo(this_, d)

      d3.selectAll(".listDiv").classed("listDivSel", false)
      d3.select(this).classed("listDivSel", true)
      dispatch.listclick(d)
      clickMapCircle(d)
    })
    .on('mouseover', function(d){
    	hoverMapCircle(d)
    })
    .on('mouseleave', function(d){
    	leaveMapCircle()
    })

   var listImage = listDiv.append("svg")
     .attr("class", "listImage")
     .append("svg:image")
     .attr("xlink:href", function(d){ return isSecure() + "://news.northeastern.edu/interactive/2018/06/boston-summer-2018/images/" + d.img})
     .attr("x", 0)
     .attr("y", 0)
     .attr("width", 50)
     .attr("height", 50);

   var listTitle = listDiv.append("div")
    .attr("class", "listTitle")
    .html(function(d){
		if (d.displayDate != "None"){
			return "<div class='san-sm-black'>" + d.name + "</div><div class='san-xs-light'>" + d.displayDate + "</div>"
		} else{
			return "<div class='san-sm-black'>" + d.name + "</div>"
		}

  })

   var listText = listDiv.append("div").attr("class", "listText")
        .html(function(d){ return "<div id='full-info'></div>"})
 }


});
