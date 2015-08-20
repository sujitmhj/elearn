window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var escape_canvas = {
	canvas : document.getElementById("rocket_canvas"),
	R : 6400000,
	g : 9.81,
	t0 : 0,
	up:true,
	earth_radius_px:50,
	frames_per_second:40,
	draw_earth:function()
	{
		this.context.beginPath();
		this.context.arc(this.width/2,this.height- this.earth_radius_px, this.earth_radius_px,0,2*Math.PI);
		this.context.closePath();

	},
	draw_rocket:function()
	{

		var base_image = new Image();
  		base_image.src = 'rocket.png';
  		var that = this;
  		var current_radius_px = this.earth_radius_px/this.R*this.r;
  		base_image.onload = function(){
    	that.context.drawImage(base_image, that.width/2-8, that.height - that.earth_radius_px -current_radius_px -43 );
  		};


		// this.context.beginPath();
		// var current_radius_px = this.earth_radius_px/this.R*this.r;
		// this.context.fillRect(this.width/2-2, this.height - this.earth_radius_px -current_radius_px  -10,4,10);
		// this.context.closePath();

	},
	
	redraw_canvas:function()
	{
		this.context.clearRect(0,0, this.width,this.height);
		if(this.up == true)
		{
			this.r += 110000;
		}
		else
		{
			this.r -= 11000;
		}
		var current_radius_px = this.earth_radius_px/this.R * this.r;
		
		if(current_radius_px>this.height - this.earth_radius_px - 100)
		{
			this.earth_radius_px /= 1.5;
		}
		this.set_up();
	},
	animate:function()
	{
		escape_canvas.redraw_canvas();
		setTimeout(escape_canvas.animate, 1000/this.frames_per_second);

	},
	set_up:function()
	{
		this.draw_earth();
		this.context.fill();
		this.draw_rocket();
		this.context.fill();

	},
	get_v2_by_radius:function()
	{
		return Math.sqrt(Math.pow(this.v1,2) - 2*this.g * Math.pow(this.R,2) * (1/this.r - 1/this.R))
	},
	get_maximum_height : function()
	{
		return 2*this.g*Math.pow(this.R,2)/(2* this.g * this.R - Math.pow(this.initial_veloctiy,2));

	},
	init:function(initial_veloctiy)
	{
		this.context = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.initial_veloctiy = initial_veloctiy;
		this.r = this.R;
		this.set_up();
		this.max_height = this.get_maximum_height();
		this.animate();
	}	
};




// usage:
// instead of setInterval(render, 16) ....

// (function animloop(){
//   requestAnimFrame(animloop);
//   render();
// })();



escape_canvas.init(11250);
