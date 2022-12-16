let
loop,
width = 200, //Width of square
height = 200, // Height of square
direction = '',
direction_queue = '',
fps = 1,
line = [],
line_length = 100,
line_width = 6,
line_color = '#FF0000',
border_color = '#000000',
timer = '',
fade_back = 20,
fade_front = 20,
border = 3;

//Function for parse color
function parseColor(color) {
  if (color.substr(0, 2) == '0x') {
    color = '#' + color.substr(2);
  }

  return color;
};

document.addEventListener("DOMContentLoaded", function() {
  // Getting parameters from url, if they exists
  const urlParams = new URLSearchParams(window.location.search);
  line_width = urlParams.get('line_width') ? parseInt(urlParams.get('line_width')) : line_width;
  line_color = urlParams.get('line_color') ? parseColor(urlParams.get('line_color')) : line_color;
  line_length = urlParams.get('line_length') ? parseInt(urlParams.get('line_length')) : line_length;
  fps = urlParams.get('fps') ? parseInt(urlParams.get('fps')) : fps;
  timer = urlParams.get('time') ? parseInt(urlParams.get('time')) : timer;
  fade_back = urlParams.get('fade_back') ? parseInt(urlParams.get('fade_back')) : fade_back;
  fade_front = urlParams.get('fade_front') ? parseInt(urlParams.get('fade_front')) : fade_front;

  // setting timer if it is set
  if (timer) {
    setTimeout(function () {
      clearInterval(loop);
    }, timer * 1000);
  }

  // Creating canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.rect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  ctx.fillStyle = "blue"; //backgound color of square
  ctx.strokeStyle = border_color; //border color of square
  ctx.lineWidth = border; //border width of square
  ctx.strokeRect((canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  ctx.stroke();
  ctx.fill();

  // make canvas interactive
  canvas.setAttribute('tabindex',1);
  canvas.style.outline = 'none';
  canvas.focus();

  // Line draw function
  const drawLineFunc = (x, y, color, i) => {
    ctx.clearRect(x, y, line_width, line_width);
    ctx.fillStyle = color;
  	ctx.fillRect(x, y, line_width, line_width);

    if (i == line.length - 1) {
      back_fill(line[line.length - 1].x, line[line.length - 1].y);
    }
  }

  let new_direction = '';
  let turning_count = 0;
  let loop_count = line_width - border;

  // Function for remove front side of line
  const back_fill = (x, y) => {
    let color = '#e9e9e9';
    let color2 = border_color;
    if (x == ((canvas.width - width) / 2 + width) && y == ((canvas.height - height) / 2 - border - line_width + border)) {
      if (turning_count == 0) {
        turning_count++;
        new_direction = 'down';
        loop_count = line_width - border;
      }
    } else if (x == ((canvas.width - width) / 2 + width + border) && y == ((canvas.height - height) / 2 - border - line_width + border)) {
      if (turning_count > 0) {
        new_direction = '';
      }
    } else if (x == ((canvas.width - width) / 2 + width) && y == ((canvas.height - height) / 2 + height)) {
      new_direction = 'left';
      loop_count = line_width - border;
    } else if (x == ((canvas.width - width) / 2 - line_width) && y == ((canvas.height - height) / 2 + height)) {
      new_direction = 'up';
      loop_count = line_width - border;
    } else if (x == ((canvas.width - width) / 2 - line_width) && y == ((canvas.height - height) / 2 - line_width)) {
      new_direction = 'right';
      loop_count = line_width - border;
    }

    if (new_direction == 'down') {
      if (loop_count > 0) {
        ctx.fillStyle = color;
        loop_count--;
      } else {
        ctx.fillStyle = color2;
        loop_count--;
      }
      ctx.fillRect(x, y, border, line_width);

      ctx.fillStyle = color;
      ctx.fillRect((x + border), y, (line_width - border), line_width);
    } else if (new_direction == 'left') {
      if (loop_count > 0) {
        ctx.fillStyle = color;
        loop_count--;
      } else {
        ctx.fillStyle = color2;
        loop_count--;
      }
      ctx.fillRect(x, y, line_width, border);

      ctx.fillStyle = color;
      ctx.fillRect(x, (y + border), line_width, (line_width - border));
    } else if (new_direction == 'up') {
      if (loop_count > 0) {
        ctx.fillStyle = color;
        loop_count--;
      } else {
        ctx.fillStyle = color2;
        loop_count--;
      }
      ctx.fillRect((x + line_width - border), y, border, line_width);

      ctx.fillStyle = color;
      ctx.fillRect(x, y, (line_width - border), line_width);
    } else if (new_direction == 'right') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, line_width, (line_width - border));

      if (loop_count > 0) {
        ctx.fillStyle = color;
        loop_count--;
      } else {
        ctx.fillStyle = color2;
      }

      ctx.fillRect(x, (y + line_width - border), line_width, border);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, line_width, line_width - border);
    } else {
      ctx.fillStyle = color;
    	ctx.fillRect(x, y, line_width, line_width);
    }
  }

  // creating the line and pushing coordinates to the array
  function createLine() {
  	line = [];
  	for (var i = line_length; i > 0; i--) {
      line.push({x: i, y: ((canvas.height - height) / 2 - line_width)});
    }
  }

  // loops through the line array and draws each element
  function drawLine() {
    let j = line.length - (100 - line.length * fade_front / 100);
    let procent = 100;
  	for (i = 0; i < line.length; i++) {
      if (i > (100 - line.length * fade_front / 100)) {
        j--;
        procent = j * parseFloat(100 / (line_length * fade_front / 100)).toFixed(0);
        let num  = parseFloat(procent * 255 / 100);
        let hexString = parseFloat(num.toFixed(0)).toString(16);
        new_color2 = line_color + hexString;
      } else if (i < line.length * fade_back / 100) {
        procent = i * parseFloat(100 / (line_length * fade_back / 100)).toFixed(0);
        let num  = parseFloat(procent * 255 / 100);
        let hexString = parseFloat(num.toFixed(0)).toString(16);
        new_color2 = line_color + hexString;
      } else {
        new_color2 = line_color;
        procent = 100;
      }

  		drawLineFunc(line[i].x, line[i].y, new_color2, i);
  	}
  }

  let count = 0;
  // changing the line's movement
  function moveLine() {
  	var x = line[0].x;
  	var y = line[0].y;

  	direction = direction_queue;
    if (line[0].x == ((canvas.width - width) / 2 + width) && line[0].y == ((canvas.height - height) / 2 - line_width)) {
      if (count == 0) {
        count++;
        direction_queue = 'down';
        direction = direction_queue;
      }
    } else if (line[0].x == ((canvas.width - width) / 2 + width) && line[0].y == ((canvas.height - height) / 2 + height)) {
      direction_queue = 'left';
      direction = direction_queue;
    } else if (line[0].x == ((canvas.width - width) / 2 - line_width) && line[0].y == ((canvas.height - height) / 2 + height)) {
      direction_queue = 'up';
      direction = direction_queue;
    } else if (line[0].x == ((canvas.width - width) / 2 - line_width) && line[0].y == ((canvas.height - height) / 2 - line_width)) {
      direction_queue = 'right';
      direction = direction_queue;
    }


  	if (direction == 'right') {
  		x++;
  	} else if(direction == 'left') {
  		x--;
  	} else if(direction == 'up') {
  		y--;
  	} else if(direction == 'down') {
  		y++;
  	}
  	// removes the tail and makes it the new head
  	var tail = line.pop();
  	tail.x = x;
  	tail.y = y;
  	line.unshift(tail);
  }

  // main loop
  function main(){
  	var head = line[0];

     ctx.beginPath();
     drawLine();
     moveLine();
  }

  function newProcess() {
  	direction = 'right'; // initial direction
  	direction_queue = 'right';
  	ctx.beginPath();
  	createLine();


		loop = setInterval(main, fps);
  }
  newProcess();
});
