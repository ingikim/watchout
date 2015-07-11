// start slingin' some d3 here.

/**
 * Configuration stuff
 **/
var height = window.innerHeight * 0.80;
var width = window.innerWidth * 0.80;
var clock = 800;
var enemyNum = 10;
var delay = 200;
var enemyRadius = 25;
var playerRadius = 25;
var radiusSum = enemyRadius + playerRadius;
/**
 * Create player and enemy objects
**/
var enemyData = [];
var playerData = [
  {"cx": 400, "cy": 250, "radius": playerRadius, "color": "blue"}  
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
 * Enemy Stuff
**/
var pushEnemy = function(enemyNum){
  for(var i = 0; i < enemyNum; i++){
    enemyData.push({ "cx": randX(), "cy": randY(), "radius": enemyRadius, "color": "red"});
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
  enemy = circlegroup.selectAll("circle")
      .data(enemyData);

  enemy.enter().append("circle")
          .attr("cx", function (d) {return d.cx; })
          .attr("cy", function (d) {return d.cy; })
          .attr("r", function (d) {return d.radius; })
          .style("fill", function (d) { return d.color;});


  enemy.transition().duration(clock)
          .attr("cx", function(d) {return d.cx; })
          .attr("cy", function(d) {return d.cy; })
          .call(checkCollision);
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
 * Collision Detection
 **/
var checkCollision = function(){
  // debugger;

  var enemies = enemy[0];
  var enemyX;
  var enemyY;
  var playerX;
  var playerY;
  var xDiff;
  var yDiff;
  var separation = function(x, y){
    if(Math.sqrt(xDiff*xDiff + yDiff*yDiff) < radiusSum){
      console.log("Collided");
    }
  };

  for(var i = 0; i < enemies.length; i++){
    enemyX = d3.select(enemies[i]).attr("cx");
    enemyY = d3.select(enemies[i]).attr("cy");
    playerX = d3.select(player[0][0]).attr("cx");
    playerY = d3.select(player[0][0]).attr("cy");
    xDiff = enemyX - playerX;
    yDiff = enemyY - playerY;
    separation(xDiff, yDiff);
  }
}



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
  randMove();
  moveEnemy(enemyData);
}, clock + delay);

