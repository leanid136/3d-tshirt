	if (!Detector.webgl ){
		Detector.addGetWebGLMessage();  
	}
	
	var container, controls;
	var camera, scene, renderer, light, material,materialCount;  
	var manager 			=  new THREE.LoadingManager();  
	var object; 
	var textureLoader, map, textureMaterial; 
	var materials 			=  []; 
	var width  				=  $(".main_container_action").width();
	var height 				=  width * 1.1;   
	/*
	if(width < height){
		height = width;
	} 
	*/ 
	var pattern_name 	= "";
	var is_mobile  		= 1;
	var pixelRatio 		= window.devicePixelRatio; 
	init(); 
	function init() {
		container 				= document.createElement( 'div' );
		document.getElementById('container').appendChild( container ); 
		scene 					= new THREE.Scene();
		var screen_rate 		= width / height; 
		if(is_mobile)
			camera 					= new THREE.PerspectiveCamera( 20, screen_rate, 100, 1200 );
		else
			camera 					= new THREE.PerspectiveCamera( 50, screen_rate, 100, 1200 );
		camera.position.set( 500, 200, 0);
		scene.add(camera);
		controls 				= new THREE.OrbitControls(camera, container );
		controls.minDistance 	= 0;
		controls.maxDistance 	= 700;
		controls.update();
		var light, materials; 
		scene.add(new THREE.AmbientLight(0x666666)); 
		var lights = [
			{color:0xffffff,intensity: 0.53,position:{x: -500, y: 320, z: 500},lookAt: {x: 0, y: 0, z: 0}},
			{color:0xffffff,intensity: 0.3,position:{x: 200, y: 50, z: 500},lookAt: {x: 0, y: 0, z: 0}},
			{color:0xffffff,intensity: 0.4,position:{x: 0, y: 100, z: -500},lookAt:  {x: 0, y: 0, z: 0}},
			{color:0xffffff,intensity: 0.3,position:{x: 1, y: 0, z: 0},lookAt:  {x: 0, y: 0, z: 0}},
			{color:0xffffff,intensity: 0.3,position:{x: -1, y: 0, z: 0},lookAt:  {x: 0, y: 0, z: 0}}
		]; 
		lights.forEach(function(light){ 
		  	var dlight = new THREE.DirectionalLight(light.color,light.intensity);
		  	var p = light.position;
		  	var l = light.lookAt;
		  	dlight.position.set(p.x, p.y, p.z);
		  	dlight.lookAt(l.x,l.y,l.z);
		  	if(light.angle){
		  	}
		  	scene.add(dlight); 
		});
		
		object = new THREE.Object3D();
		var slight = new THREE.SpotLight(0xffffbb,0.1);
		slight.position.set(0,0,0);
		slight.lookAt(0,0,0); 
		slight.distance = 100;
		slight.target = object;
		slight.angle = 0.4; 
		light = new THREE.DirectionalLight(0xdfebff, 0.3);
		light.position.set(500, 100, 80); 
		light.castShadow = true; 
		light.shadow.mapSize.width = 1024;
		light.shadow.mapSize.height = 1024;
		
		var d = 300; 
		light.shadow.camera.left = -d;
		light.shadow.camera.right = d;
		light.shadow.camera.top = d;
		light.shadow.camera.bottom = -d;

		light.shadow.camera.far = 100;
		light.shadowDarkness = 0.5;
		light.shadowCameraVisible = true;
		scene.add(light);
		
		textureLoader = new THREE.TextureLoader();
		changeProduct(); 
		renderer = new THREE.WebGLRenderer({antialias: true,alpha: true});
		renderer.setPixelRatio( pixelRatio );
		renderer.setSize( width, height );
		renderer.setClearColor(0x000000, 0);
		
		container.appendChild( renderer.domElement );
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.soft = true; 
		window.addEventListener('resize', onWindowResize, false ); 
		animate(); 
	} 
	
	
	function onWindowResize() { 
		width  =  $(".main_container_action").width();
		height =  width; 
		if(width < height){
			height = width;
		}
		camera.aspect = width / height;
		camera.updateProjectionMatrix(); 
		renderer.setSize( width , height ); 
	} 
	function animate() { 
		requestAnimationFrame( animate );
		controls.update();
		render();
	} 
	function render() {
		renderer.render( scene, camera );
	}  
	function obj2_model_load(model){
		 
		var loader = new THREE.OBJLoader2(manager);  
		loader.load('assets/data/model.obj', function ( data ) {
			if(object != null){
				scene.remove(object);
			} 
			object = null;
			object = data.detail.loaderRootNode	; 
			 
			materials =[];
			object.traverse( function ( node ) {
				if ( node.isMesh ) {
					node.material 				= textureMaterial
					node.geometry.uvsNeedUpdate = true;
				}
			}); 
			var scale = height / 2;
			object.scale.set(scale, scale, scale);
			object.position.set(0,-scale*1.4, 0);
			object.rotation.set(0, Math.PI / 2, 0);
			object.receiveShadow = true;
			object.castShadow = true;
			scene.add(object);
		});
	} 
	function changeProduct(){
		loadSvg(function(resp){
			 
			obj2_model_load(); 
		}); 
	}
	function loadSvg(response){
		$.get('assets/data/pattern.svg', function(data) {   
			var svgData = new XMLSerializer().serializeToString(data.documentElement);
			$('#svgContainer').empty();
			$('#svgContainer').append(svgData).html(); 
			set_materials(function(resp){
				response(resp);
			});
		});
	}
	function set_materials(response){
		
		var baseSvg = document.getElementById("svgContainer").querySelector("svg");
		var baseSvgData = (new XMLSerializer()).serializeToString(baseSvg); 
		$('#svgPathContainer').empty(); 
		$('#svgPathContainer').append(baseSvgData).html();
		var svg 		= document.getElementById("svgPathContainer").querySelector("svg");
		var svgData 	= (new XMLSerializer()).serializeToString(svg);
			
	 
		var canvas 		= document.createElement("canvas");
		canvas.width 	= $(svg).width();
		canvas.height 	= $(svg).height();
		var ctx 		= canvas.getContext("2d"); 
		var img 		= document.createElement("img");
		img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svgData))) );
		img.onload = function() {
			ctx.globalAlpha = 1;
			ctx.drawImage(img, 0, 0);
			if(pattern_name != ""){
				var oImg = document.createElement("img");
				oImg.setAttribute("src", 'assets/pattern/' + pattern_name);
				oImg.onload = function(){
					ctx.globalAlpha 	=  	1;
					var image_position  =   calculateImagePosition(); 
					ctx.drawImage(oImg, image_position.pos_x,  image_position.pos_y, image_position.img_width, image_position.img_height); 
					var texture 		= 	new THREE.Texture(canvas);
					texture.needsUpdate = 	true;
					map 				= 	texture;
					textureMaterial 	= 	new THREE.MeshPhongMaterial({map: map}); 
					response(true);
				};
			}
			else{
				var texture 		= new THREE.Texture(canvas);
				texture.needsUpdate = true;
				map 				= texture;
				textureMaterial 	= new THREE.MeshPhongMaterial({map: map}); 
				response(true);
			}
		};
	}

	function calculateImagePosition(){
		// 400, 1170
		var front_back =  $("#cus_switch").prop("checked");
		if(front_back){
			var pos_x 		= 1226;
			var pos_y 		= 1500; 
			camera.position.set(500, 200, 0);
		}
		else{
			var pos_x 		= 400;
			var pos_y 		= 1500;
			camera.position.set( -500, 200, 0);
		} 
		var img_width  			= $("#size_slider").val() * 5;
		var img_height 			= $("#size_slider").val() * 5; 
		pos_x 					= pos_x - img_width / 2;
		pos_y 					= pos_y - img_height / 2; 
		var vertical_placing 	= ($("#vertical_placing_slider").val() - 15) * 10;
		var horizontal_placing 	= ($("#horizontal_placing_slider").val() - 15) * 10;
		
		var result 				= 	{};
		result['pos_x']			=	pos_x - horizontal_placing;
		result['pos_y']			=	pos_y - vertical_placing;
		result['img_height']	=	img_height;
		result['img_width']		=	img_width; 
		return result;
	}
	
	
	
	$(function() { 
		$(".pattern-item").click(function(){
			pattern_name =  $(this).attr('data-pattern');
			changeProduct();
			render();
		}); 
		$("#size_slider").change(function(){
			changeProduct();
			render();
		}); 
		$("#cus_switch").click(function(){
			changeProduct();
			render();
		}); 
		// Mobile action  
		$("#vertical_placing_slider").change(function(){
			var show_value =  $(this).val() - 15;
			$(".vertical_placing_label").html(show_value);

			changeProduct();
			render();

		}); 
		$("#horizontal_placing_slider").change(function(){
			var show_value =  $(this).val() - 15;
			$(".horizontal_placing_label").html(show_value);

			changeProduct();
			render();

		});  
		$(".form-range.slider").trigger("change"); 
		/***************** Add On Action *********************/
		$(".addon-action-button").click(function(){ 
			if($(this).hasClass("custom-down")){
				$(this).removeClass("custom-down").addClass("custom-up");
				$(".addon-group").addClass("active");
			}
			else{
				$(this).addClass("custom-down").removeClass("custom-up");
				$(".addon-group").removeClass("active");
			} 
		});
	}); 
