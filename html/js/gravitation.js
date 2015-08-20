function log(b, n) {
    return Math.log(n) / Math.log(b);
}

var GLOBAL_VARIABLES = {
	padding:40,
	G: 6.67*Math.pow(10,-11),
	max_force:500,
	pointer_width:10,
	pointer_height:10,
	maximum_distance:100000000
}
var gravitation_canvas = {
	canvas : document.getElementById("myCanvas"),
	m1:1000,
	m2:1000,
	masses:[],
	mouseIsDown : false,
	init:function (){
		this.context = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.masses = [];



		var canvasOffset = this.canvas.getBoundingClientRect();
		this.offsetX = canvasOffset.left;
		this.offsetY = canvasOffset.top;
		this.m1_radius = 3*log(3,this.m1);
		this.m2_radius = 3*log(3,this.m2);


		var m1_center_x = GLOBAL_VARIABLES.padding + 100 + this.m1_radius;
		var m1_center_y = this.height/2;

		var m2_center_x = this.width - GLOBAL_VARIABLES.padding -100 - this.m2_radius;
		var m2_center_y = this.height/2;
		this.max_right =m2_center_x;
		this.max_left = m1_center_x;
		this.make_mass(m1_center_x,m1_center_y,this.m1_radius,"skyblue");
		this.make_mass(m2_center_x,m2_center_y,this.m2_radius,"skyblue");
		
		this.animate();
	},
	section_formula:function(mass1,mass2,m1,m2)
	{
		var x = (m1*mass2.x + m2*mass1.x)/(m1+m2);
		var y = (m1*mass2.y + m2*mass1.y)/(m1+m2);
		return {x:x,y:y};
	},
	draw_workspace:function()
	{
		this.context.setLineDash([6]);
		this.context.strokeRect(100, 2, this.width-200, this.height-4);
		this.context.setLineDash([0]);
	},
	draw_spring_balance:function()
	{
		var base_image = new Image();
  		base_image.src = 'images/balance_right.png';
  		var that = this;
  		base_image.onload = function(){
    	that.context.drawImage(base_image, that.width-100, that.height/2-11);
  		};

  		var base_image1 = new Image();
  		base_image1.src = 'images/balance_left.png';
  		base_image1.onload = function(){
    	that.context.drawImage(base_image1, 0, that.height/2-11);
  		};
	},
	animate:function()
	{
		this.draw_spring_balance();
		this.draw_all_masses();
		this.draw_workspace();
		this.gravitational_force = 3*log(3,GLOBAL_VARIABLES.G*this.m1*this.m2/Math.pow(this.d,2));
		var pixel_distance = Math.sqrt(Math.pow((this.masses[1].x-this.masses[0].x),2),Math.pow((this.masses[1].y-this.masses[0].y),2));
		var pixel_force = this.width - pixel_distance;
		if(pixel_force>pixel_distance/2)
		{
			pixel_force = pixel_distance/2;
		}
		var ratio = pixel_force/pixel_distance;
		var first_mass = this.section_formula(this.masses[0],this.masses[1],ratio,1-ratio);
		var second_mass = this.section_formula(this.masses[1],this.masses[0],ratio,1-ratio);
		

		this.draw_arrow(this.masses[0].x,this.masses[0].y,first_mass.x,first_mass.y);
		this.draw_arrow(this.masses[1].x,this.masses[1].y,second_mass.x,second_mass.y);
		


	},
	rotate_point:function(x,y,theta)
	{
		var nx = x*Math.cos(theta) - y*Math.sin(theta);
		var ny = x*Math.sin(theta) + y*Math.cos(theta);
		return {x:nx,y:ny};
	},
	draw_arrow:function(x1,y1,x2,y2)
	{
		var x = x2-x1;
		var y = y2-y1;

		var angle = 1 * Math.atan(y/x);
		if(x<0)
		{
			angle = angle + Math.PI;
		}

		// Rotate axis by angle 

		var nx = Math.sqrt(Math.pow(x,2),Math.pow(y,2));
		var nupper_x = nx - GLOBAL_VARIABLES.pointer_width;
		var nupper_y = GLOBAL_VARIABLES.pointer_height/4;
		var rotated_upper= this.rotate_point(nupper_x,nupper_y,angle);

		var nlower_x = nx - GLOBAL_VARIABLES.pointer_width;
		var nlower_y = -1*GLOBAL_VARIABLES.pointer_height/4;
		var rotated_lower= this.rotate_point(nlower_x,nlower_y,angle);

		var nupper_top_x = nx - GLOBAL_VARIABLES.pointer_width;
		var nupper_top_y = GLOBAL_VARIABLES.pointer_height/2;
		var rotated_upper_top = this.rotate_point(nupper_top_x,nupper_top_y,angle);

		var nlower_bottom_x = nx - GLOBAL_VARIABLES.pointer_width;
		var nlower_bottom_y = -1*GLOBAL_VARIABLES.pointer_height/2;
		var rotated_lower_bottom= this.rotate_point(nlower_bottom_x,nlower_bottom_y,angle);


		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x1+rotated_upper.x,y1+rotated_upper.y);
		this.context.lineTo(x1+rotated_upper_top.x,y1+rotated_upper_top.y);
		this.context.lineTo(x2,y2);
		this.context.lineTo(x1+rotated_lower_bottom.x,y1+rotated_lower_bottom.y);
		this.context.lineTo(x1+rotated_lower.x,y1+rotated_lower.y);
		this.context.moveTo(x1,y1);
		this.context.closePath();
		this.context.fillStyle = "skyblue";
		this.context.fill();
	},
	make_mass:function(x,y,r,fill)
	{
		var mass = {
			x:x,
			y:y,
			r:r,
			fill:fill
		}
		this.masses.push(mass);
		return mass;
	},

	draw_mass:function(mass,i){
		this.context.beginPath();
		this.context.arc(mass.x,mass.y,mass.r,0,2*Math.PI);
		

		this.context.closePath();
	},
	draw_labels:function()
	{
		for(var i = 0;i<this.masses.length;i++)
		{
			// this.context.beginPath();
			var mass = this.masses[i];
			var mass_string = "m" + (i+1) + " = "+this["m"+(i+1)]+"kg";
			this.context.font="20px Verdana";
			var string_width = this.context.measureText(mass_string).width;
			string_height = this.context.measureText(mass_string);
			this.context.fillText(mass_string,mass.x-string_width/2,mass.y + this['m'+(i+1)+'_radius']+20);
		}

		var x1 = this.masses[0].x;
		var y1 = this.masses[0].y;
		var x2 = this.masses[1].x;
		var y2 = this.masses[1].y;

		var x = x2-x1;
		var y = y2-y1;

		var angle = Math.atan(y/x);
		if(x<0)
		{
			angle += Math.PI;
		}

		var nx = Math.sqrt(Math.pow(x,2),Math.pow(y,2));
		if(this.m1_radius>this.m2_radius)
		{
			var max_radius = this.m1_radius;
		}
		else
		{
			var max_radius = this.m2_radius;
		}
		max_radius += GLOBAL_VARIABLES.pointer_height;

		var left_top = this.rotate_point(0,GLOBAL_VARIABLES.pointer_height/2 - max_radius,angle);
		var left_bottom = this.rotate_point(0,GLOBAL_VARIABLES.pointer_height/-2 - max_radius,angle);
		var right_top = this.rotate_point(nx,GLOBAL_VARIABLES.pointer_height/2-max_radius,angle);
		var right_bottom = this.rotate_point(nx,GLOBAL_VARIABLES.pointer_height/-2- max_radius,angle);
		this.context.beginPath();

		var left =this.rotate_point(0,- max_radius,angle);
		var right = this.rotate_point(nx, - max_radius,angle);


		this.context.moveTo(left_top.x + x1, left_top.y + y1);
		this.context.lineTo(left_bottom.x+x1, left_bottom.y+y1);
		this.context.stroke();
		this.context.moveTo(x1+left.x,y1+left.y);
		this.context.lineTo(x1+right.x,y1+right.y);
		this.context.stroke();
		this.context.moveTo(right_top.x + x1, right_top.y + y1);
		this.context.lineTo(right_bottom.x+x1, right_bottom.y+y1);
		this.context.stroke();

		var center_point = this.rotate_point(nx/2,-max_radius-10,angle);
		var int_distance = parseInt(GLOBAL_VARIABLES.maximum_distance/(this.width - 200)*(this.masses[1].x - this.masses[0].x));
		var distance = "d = " + int_distance +"m";
		var string_width = this.context.measureText(distance).width;
		this.context.fillText(distance, center_point.x+x1 - string_width/2,center_point.y+y1);
		
		var gravitational_force = GLOBAL_VARIABLES.G * this.m1*this.m2/Math.pow(int_distance,2);
		var force_text = "F = "+gravitational_force +"N";
		string_width = this.context.measureText(force_text).width;
		this.context.fillText(force_text, this.width/2 - string_width/2,this.height - 30);
		
		this.context.moveTo(100,this.height/2);
		this.context.lineTo(this.masses[0].x-this.m1_radius,this.masses[0].y);

		this.context.moveTo(this.width-100,this.height/2);
		this.context.lineTo(this.masses[1].x+this.m2_radius,this.masses[1].y);
		this.context.stroke();

		this.context.closePath();



	},

	draw_all_masses:function()
	{
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for(var i = 0; i < this.masses.length;i++)
		{
			var mass = this.masses[i];
			this.draw_mass(mass,(i+1));
			this.context.fillStyle = mass.fill;
			this.context.fill();
			this.context.stroke();
		}
		this.draw_labels();
	},
	handleMouseDown:function(e) {
		var canvasOffset = this.canvas.getBoundingClientRect();
		
		this.offsetX = canvasOffset.left;
		this.offsetY = canvasOffset.top;
	    mouseX = parseInt(e.clientX - this.offsetX);
	    mouseY = parseInt(e.clientY - this.offsetY);

	    // mousedown stuff here
	    lastX = mouseX;
	    lastY = mouseY;
	    this.mouseIsDown = true;

	},
	handleMouseUp : function(e) {
	    mouseX = parseInt(e.clientX - this.offsetX);
	    mouseY = parseInt(e.clientY - this.offsetY);

	    // mouseup stuff here
	    this.mouseIsDown = false;
	},

 	handleMouseMove: function(e)  {
	    if (!this.mouseIsDown) {
	        return;
	    }


	    mouseX = parseInt(e.clientX - this.offsetX);
	    mouseY = parseInt(e.clientY - this.offsetY);
	    console.log(mouseX, mouseY, this.offsetX, this.offsetY);
	    // mousemove stuff here
	    for (var i = 0; i < this.masses.length; i++) {
	        var mass = this.masses[i];
	        this.draw_mass(mass,(i+1));
	        this.context.fill();
	        console.log("outside");
	        if (this.context.isPointInPath(lastX, lastY)) {
	        	console.log("inside");
	        	var new_x = mass.x  + (mouseX - lastX);
	        	var new_y = mass.y + (mouseY - lastY);
	        	var index = 0;
	        	if(i == index)
	        	{
	        		index = 1;
	        	}
	        	var unchanged_mass = this.masses[index];
	        	var center_distance = Math.sqrt(Math.pow(new_x-unchanged_mass.x,2),Math.pow(new_y-unchanged_mass.y,2));
	        	if(center_distance>(this.m1_radius+this.m2_radius) && new_x>this.max_left && new_x<this.max_right)
	        	{
		            mass.x += (mouseX - lastX);
	        	}
	        }
	    }
	    lastX = mouseX;
	    lastY = mouseY;
	    this.animate();
	}

	
	
};
gravitation_canvas.init();

	$("#myCanvas").mousedown(function (e) {
		gravitation_canvas.handleMouseDown(e);
});
$("#myCanvas").mousemove(function (e) {
    gravitation_canvas.handleMouseMove(e);
});
$("#myCanvas").mouseup(function (e) {
    gravitation_canvas.handleMouseUp(e);
});

$(".input_mass").change(function(){
    gravitation_canvas.m1 = parseInt($("#m1").val());
    gravitation_canvas.m2 = parseInt($("#m2").val());
    gravitation_canvas.init();
});