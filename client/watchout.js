// start slingin' some d3 here.

var height = window.innerHeight * 0.80;
var width = window.innerWidth * 0.80;
var clock = 800;
var enemyNum = 10;
var delay = 0;
// var enemyType = { "cx": 250, "cy": 250, "radius": 25, "color": "red"};

var enemyData = [];

var playerData = [
  {"cx": 400, "cy": 250, "radius": 25, "color": "blue"}  
];
var svgContainer = d3.select(".gameboard").append("svg")
                                            .attr("width", width)
                                            .attr("height", height);

var circlegroup = svgContainer.append("g");
                                    // .attr("transform", "translate(80, 90)");



var randX = function(){return Math.round(Math.random() * width)};
var randY = function(){return Math.round(Math.random() * height)};


var pushEnemy = function(enemyNum){
  for(var i = 0; i < enemyNum; i++){
    enemyData.push({ "cx": randX(), "cy": randY(), "radius": 25, "color": "red"});
  }
};
pushEnemy(enemyNum);


var randMove = function(){
  for(var i = 0 ; i < enemyData.length; i++){
    enemyData[i]['cx'] = randX();
    enemyData[i]['cy'] = randY();
  }
};

var moveEnemy = function(data){
  var enemy = circlegroup.selectAll("circle")
      .data(enemyData);

  // debugger;

  enemy.enter().append("circle")
          .attr("cx", function (d) {return d.cx; })
          .attr("cy", function (d) {return d.cy; })
          .attr("r", function (d) {return d.radius; })
          .style("fill", function (d) { return d.color;});

  enemy.attr("class", "movedown");

  enemy.transition().duration(clock)
          .attr("cx", function(d) {return d.cx; })
          .attr("cy", function(d) {return d.cy; });

        // .attr("transform", "translate3d(" + randX() + "px, " + randY() + "px, 0)");

  // enemy.attr("cx"

  // for(var i = 0; i < enemy.length; i++){
  //   enemy[i]
  // }
  // debugger;
  // enemy.exit().remove();
};

/*
 * Drag Moving Function
*/ 
function dragmove(d) {
    d3.select(this)
      .attr("cx", function(){
        if(d3.event.x < 0)
          return 0;
        else if(d3.event.x > width)
          return width;
        else
          return d3.event.x;
      })
      .attr("cy", function(){
        if(d3.event.y < 0)
          return 0;
        else if(d3.event.y > height)
          return height;
        else
          return d3.event.y;
      })
}
      // .attr("cx", d3.event.x)//((d3.event.sourceEvent.pageY) - this.offsetHeight/2)+"px")
      // .attr("cy", d3.event.y)//((d3.event.sourceEvent.pageX) - this.offsetWidth/2)+"px")}

var drag = d3.behavior.drag()
    .on("drag", dragmove);

// var drag = d3.behavior.drag();
      // .on('dragstart', function(){console.log("dragstart");})
      // .on('drag', function() { circle.attr('cx', d3.event.x)
      //                                .attr('cy', d3.event.y);
      // });
      // .on('dragend', function(){console.log("dragend");});

var playermaker = function(data){
  var player = svgContainer.selectAll("circle").data(playerData);

  player.enter().append("circle")
          .attr("class", "playerClass")
          .call(drag)
          .attr("cx", function (d) {return d.cx; })
          .attr("cy", function (d) {return d.cy; })
          .attr("r", function (d) {return d.radius; })
          .style("fill", function (d) { return d.color;});

  //player.call(drag);
};

// d3.selectAll(".playerClass").call(drag);


playermaker(playerData);

moveEnemy(enemyData);

setInterval(function(){
  randMove();
  moveEnemy(enemyData);
}, clock + delay);

