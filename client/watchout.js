// start slingin' some d3 here.

/**
 * Configuration stuff
 **/
var height = window.innerHeight * 0.80;
var width = window.innerWidth * 0.80;
var clock = 1000;
var enemyNum = (height*width)/35000;
var delay = 200;
var enemyRadius = 50;
var playerRadius = 20;
var radiusSum = enemyRadius + playerRadius;
var currentScore = 0;
var highScore = 0;
var collisionCount = 0;


/**
 * Create player and enemy objects
**/
var enemyData = [];
var playerData = [
  {"cx": playerRadius, "cy": playerRadius, "radius": playerRadius, "color": "blue"}  
];
var enemy;
var player;

/**
 * D3 grouping stuff
**/
var svgContainer = d3.select(".gameboard").append("svg")
                                            .attr("width", width)
                                            .attr("height", height);

var circlegroup = svgContainer.append("g");


//Helper random makers
var randX = function(){return Math.round(Math.random() * width)};
var randY = function(){return Math.round(Math.random() * height)};


/**
 * Collision Detection
 **/


var collisionHandler = function() {
  d3.select("body").selectAll(".collisions span").text(++collisionCount);
  currentScore = 0;
}

var checkCollision = function(curEnemy){
  // debugger;

  var enemyX = parseFloat(curEnemy.attr("x"));
  var enemyY = parseFloat(curEnemy.attr("y"));
  var playerX = d3.select(player[0][0]).attr("cx");
  var playerY = d3.select(player[0][0]).attr("cy");
  var xDiff = enemyX - playerX;
  var yDiff = enemyY - playerY;

  var separation = function(x, y){
    if(Math.sqrt(xDiff*xDiff + yDiff*yDiff) < radiusSum){
      collisionHandler();
    }
  };
  separation(xDiff, yDiff);
}

var tweenWithCollisionDetection = function(){
  var currentEnemy = d3.select(this);
  var startPosX = parseFloat(currentEnemy.attr("x"));
  var endPosX;
  var startPosY = parseFloat(currentEnemy.attr("y"));
  var endPosY;

  currentEnemy.attr("x", function(d) {return d.x});
  endPosX = parseFloat(currentEnemy.attr("x"));

  currentEnemy.attr("y", function(d) {return d.y});
  endPosY = parseFloat(currentEnemy.attr("y"));

  return function(t){
    currentEnemy.attr("x", startPosX + (endPosX - startPosX)*t);
    currentEnemy.attr("y", startPosY + (endPosY - startPosY)*t);
    checkCollision(currentEnemy);
  };

};


/**
 * Enemy Stuff
**/
var pushEnemy = function(enemyNum){
  for(var i = 0; i < enemyNum; i++){
    enemyData.push({ "x": randX(), "y": randY(), "width": enemyRadius, "height": enemyRadius * 2, "xlink:href": "marcus.png"});
  }
};
pushEnemy(enemyNum);


var randMove = function(){
  for(var i = 0 ; i < enemyData.length; i++){
    enemyData[i]['x'] = randX();
    enemyData[i]['y'] = randY();
  }
};




var moveEnemy = function(data){
  enemy = circlegroup.selectAll("image")
      .data(enemyData);

  enemy.enter().append("image")
          .attr("class", "enemyClass")
          .attr("x", function (d) {return d.x; })
          .attr("y", function (d) {return d.y; })
          .attr("width", function (d) {return d.width; })
          .attr("height", function (d) {return d.height; })
          .attr("xlink:href", function (d) {return d["xlink:href"]; });


        // debugger;
  enemy.transition().duration(clock)
          // .attr("cx", function(d) {return d.cx; })
          // .attr("cy", function(d) {return d.cy; })
          .tween('custom', tweenWithCollisionDetection);
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
var drag = d3.behavior.drag()
    .on("drag", dragmove);






/**
 * Player Maker Functions
 **/

var playermaker = function(data){
  player = svgContainer.selectAll("circle").data(playerData);
  player.enter().append("circle")
          .attr("class", "playerClass")
          .call(drag)
          .attr("cx", function (d) {return d.cx; })
          .attr("cy", function (d) {return d.cy; })
          .attr("r", function (d) {return d.radius; })
          .style("fill", function (d) { return d.color;});
};


/**
 * Function invocations
 **/
playermaker(playerData);

moveEnemy(enemyData);



setInterval(function(){
  randMove()
  moveEnemy(enemyData);
}, clock + delay);

setInterval(function(){
  d3.select("body").selectAll(".current span").text(++currentScore);
  if(highScore < currentScore) {
    highScore = currentScore;
  }
  d3.select("body").selectAll(".high span").text(highScore);
}, 10)
