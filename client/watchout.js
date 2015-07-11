// start slingin' some d3 here.

var width = 700;
var height = 700;
var clock = 800;
var enemyNum = 10;
// var enemyType = { "cx": 250, "cy": 250, "radius": 25, "color": "red"};

var enemyData = [];

var playerData = [
  { "cx": 400, "cy": 250, "radius": 25, "color": "blue"}  
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

moveEnemy(enemyData);

setInterval(function(){
  randMove();
  moveEnemy(enemyData);
}, clock);

