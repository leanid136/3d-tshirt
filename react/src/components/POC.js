import React, { useState , useRef, useEffect } from 'react';
import axios from "axios";
//Style
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
// components
import {Row} from 'react-bootstrap';
import {Col} from 'react-bootstrap';
import PatternImg from './PatternImg';
import ControlSlider from './ControlSlider'; 
import  * as THREE from "three"; 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; 
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

const POC = () =>{  
    const [front_back_checked, setFront_back_checkedChecked]     = useState(false); 
    const [addon_a_checked, setAddon_a_checked]                  = useState(true);
    const [addon_b_checked, setAddon_b_checked]                  = useState(true);
    const [addon_c_checked, setAddon_c_checked]                  = useState(true); 
    const [ size_slider_value, setSize_slider_value ]            = useState(50);
    const [ vertical_slider_value, setVertical_slider_value]     = useState(15);
    const [ horizontal_slider_value, setHorizontal_slider_value] = useState(15); 
    const [ shirt_pattern, setShirt_pattern]                     = useState("");
    const [addon_group_check, setAddon_group_check]              = useState(false);
    
    // Start Three js
    const [ initflag, setInitflag]                      = useState(0); 
    const scene                             =   useRef(new THREE.Scene());
    const is_mobile                         =   1; 
    const square_ref                        =  React.createRef();
    const container_ref                     =  React.createRef(); 
    var main_width, screen_rate;
    var pixelRatio 		                 =  window.devicePixelRatio; 
    var svgData, map;

    const main_height                   =  useRef(0);
    const textureMaterial 		        =  useRef(null);
    const manager 			            =  useRef(new THREE.LoadingManager());
    const camera                        =  useRef(null);
    const controls                      =  useRef(null);
    var light, lights;
    const object                        = useRef(new THREE.Object3D()); 
    const renderer                      = useRef(null);
    var slight, d; 
    
    useEffect(() => {
        if(container_ref.current && square_ref.current && !initflag ){
            setInitflag(1);
            main_width                       =  square_ref.current.getBoundingClientRect().width;
            main_height.current 		     =  main_width * 1.1;
            screen_rate 		             =  main_width / main_height.current;  
            if(main_width){ 
                if(is_mobile)
                    camera.current = new THREE.PerspectiveCamera( 20, screen_rate, 100, 1200);
                else
                    camera.current = new THREE.PerspectiveCamera( 50, screen_rate, 100, 1200);
                camera.current.position.set( 500, 200, 0); 
                scene.current.add(camera.current);
                controls.current 		            = new OrbitControls(camera.current, container_ref.current );
                controls.current.minDistance 	    = 0;
                controls.current.maxDistance 	    = 700;
                controls.current.update(); 
                scene.current.add(new THREE.AmbientLight(0x666666));     
                lights = [
                    {color:0xffffff,intensity: 0.53,position:{x: -500, y: 320, z: 500},lookAt: {x: 0, y: 0, z: 0}},
                    {color:0xffffff,intensity: 0.3,position:{x: 200, y: 50, z: 500},lookAt: {x: 0, y: 0, z: 0}},
                    {color:0xffffff,intensity: 0.4,position:{x: 0, y: 100, z: -500},lookAt:  {x: 0, y: 0, z: 0}},
                    {color:0xffffff,intensity: 0.3,position:{x: 1, y: 0, z: 0},lookAt:  {x: 0, y: 0, z: 0}},
                    {color:0xffffff,intensity: 0.3,position:{x: -1, y: 0, z: 0},lookAt:  {x: 0, y: 0, z: 0}}
                ];
                lights.forEach(function(light){ 
                    var dlight  = new THREE.DirectionalLight(light.color,light.intensity);
                    var p       = light.position;
                    var l       = light.lookAt;
                    dlight.position.set(p.x, p.y, p.z);
                    dlight.lookAt(l.x,l.y,l.z); 
                    scene.current.add(dlight); 
                });  
           
                light = new THREE.DirectionalLight(0xdfebff, 0.3);
                light.position.set(500, 100, 80); 
                light.castShadow = true; 
                light.shadow.mapSize.width = 1024;
                light.shadow.mapSize.height = 1024; 
                d = 300; 
                light.shadow.camera.left = -d;
                light.shadow.camera.right = d;
                light.shadow.camera.top = d;
                light.shadow.camera.bottom = -d;
            
                light.shadow.camera.far = 100;
                light.shadowDarkness = 0.5;
                light.shadowCameraVisible = true; 
                scene.current.add(light);
                
                changeProduct(); 
                renderer.current = new THREE.WebGLRenderer({antialias: true,alpha: true});
                renderer.current.setPixelRatio( pixelRatio );
                renderer.current.setSize( main_width, main_height.current );
                renderer.current.setClearColor(0x000000, 0);  
                container_ref.current.appendChild( renderer.current.domElement );
                
                renderer.current.gammaInput = true;
                renderer.current.gammaOutput = true;
                renderer.current.shadowMap.enabled = true;
                renderer.current.shadowMap.soft = true; 
                animate();   
            }
        }
    }, []); 
 
    useEffect(() => {  
        if(initflag){ 
            changeProduct();   
            render();
        } 
    }, [size_slider_value, vertical_slider_value, horizontal_slider_value ,shirt_pattern, front_back_checked ]); 
    
    function animate() {
		requestAnimationFrame( animate );
		controls.current.update();
		render();
	} 
    function render() {
		renderer.current.render(scene.current, camera.current); 
	} 
    function obj2_model_load(){  
		var loader = new OBJLoader(manager.current); 
        loader.load( 
            'assets/data/model.obj', 
            function ( data ) {
                if(object.current != null){
                    scene.current.remove(object.current);
                }   
                object.current      =   null; 
			    object.current      =   data; 
                object.current.traverse( function ( node ) {
                    if( node.isMesh ) {
                        node.material 				= textureMaterial.current;
                        node.geometry.uvsNeedUpdate = true;
                    } 
                });
                
                var scale       = main_height.current / 2; 
                object.current.scale.set(scale, scale, scale);
                object.current.position.set(0,-scale*1.4, 0);
                object.current.rotation.set(0, Math.PI / 2, 0);
                object.current.receiveShadow = true;
                object.current.castShadow = true; 
                scene.current.add(object.current); 
                
            }, 
            function ( xhr ) {  
            }, 
            function ( error ) {  
            }
        ); 
	}  
    function changeProduct(){ 
		loadSvg(function(resp){  
		}); 
	}
	function loadSvg(response_tt){ 
        axios.get('assets/data/pattern.svg', {
            "Content-Type": "application/xml; charset=utf-8"
         })
         .then((response) => {   
            svgData = response.data; 
            set_materials(function(resp){
				response_tt(resp);
			}); 
         }); 
	} 
    function set_materials(response){ 
        var XMLParser   =  require('react-xml-parser'); 
        var canvas 		=  document.createElement("canvas"); 
        var svg         =  new XMLParser().parseFromString(svgData);   
        canvas.width 	=  svg.attributes.width;
		canvas.height 	=  svg.attributes.height;
        var ctx 		=  canvas.getContext("2d"); 
        var img 		=  document.createElement("img"); 
        
        img.setAttribute("src", "data:image/svg+xml;base64," + window.btoa(unescape(encodeURIComponent(svgData))) );
        img.onload = function() {
			ctx.globalAlpha = 1;
			ctx.drawImage(img, 0, 0);
			if(shirt_pattern != ""){ 
				var oImg = document.createElement("img");
				oImg.setAttribute("src", 'assets/pattern/' + shirt_pattern + ".png");
				oImg.onload = function(){ 
					ctx.globalAlpha 	=  	1;
					var image_position  =   calculateImagePosition();  
					ctx.drawImage(oImg, image_position.pos_x,  image_position.pos_y, image_position.img_width, image_position.img_height);  
					var texture 		= 	new THREE.Texture(canvas);
					texture.needsUpdate = 	true;
					map 				= 	texture;
					textureMaterial.current 	= 	new THREE.MeshPhongMaterial({map: map}); 
					response(true); 
				};  
			}
			else{
				var texture 		= new THREE.Texture(canvas);
				texture.needsUpdate = true;
				map 				= texture;
				textureMaterial.current 	= new THREE.MeshPhongMaterial({map: map}); 
				response(true);
			}  
            obj2_model_load(); 
		};   
	} 
    function calculateImagePosition(){
		// 400, 1170 
        var pos_x,  pos_y; 
		if(front_back_checked){
			pos_x 		= 400;
			pos_y 		= 1500;
			camera.current.position.set( -500, 200, 0);	
		}
		else{ 
            pos_x 		= 1226;
			pos_y 		= 1500; 
			camera.current.position.set(500, 200, 0);
		} 
		var img_width  			= size_slider_value * 5;
		var img_height 			= size_slider_value * 5;

		pos_x 					= pos_x - img_width / 2;
		pos_y 					= pos_y - img_height / 2; 
		var vertical_placing 	= (vertical_slider_value - 15) * 10;
		var horizontal_placing 	= (horizontal_slider_value - 15) * 10;
		
		var result 				= 	{};
		result['pos_x']			=	pos_x - horizontal_placing;
		result['pos_y']			=	pos_y - vertical_placing;
		result['img_height']	=	img_height;
		result['img_width']		=	img_width; 
		return result;
	}  
    return (
        <>
            <div id="page-content"> 
                <Row> 
                    <Col xs={12} md={8} className = "main_container_action" ref={square_ref}> 
                        <div className="lab" id="container" ref={container_ref}>

                        </div> 
                    </Col> 
                    <Col xs={12} md={4} className = "control-panel-div">
                        <Row className = "mar-top">
                            <Col  xs={6}>
                                <div className = "cus_switch_group">
                                    <p className = "cus_label"> Front </p>
                                    <label className="cus_switch"> 
                                    <input id = "cus_switch"  type="checkbox"
                                        defaultChecked={front_back_checked}
                                        onChange={() => setFront_back_checkedChecked(!front_back_checked)}
                                    /> 
                                    <span className="cus_slider cus_round"></span>
                                    <span className="cus_absolute-no"></span>
                                    </label>
                                    <p className = "cus_label"> Back </p>
                                </div>
                            </Col>
                            <Col  xs={6}>
                                <p className = "text-center"> More Options chat with us </p>
                                <div className = "form-group">
                                    <input className = "form-control"  />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col  xs={12}> 
                                <ControlSlider min={1} max={100} label={"Size"} showScale={false} initValue={size_slider_value} callback={setSize_slider_value}  />
                            </Col>
                            <Col  xs={12} className="form-label mar-top">
                                <ControlSlider min={0} max={30} label={"Vertical Placing"} showScale={true}  initValue={vertical_slider_value}  callback={setVertical_slider_value}/>
                            </Col> 
                            <Col  xs={12} className="form-label mar-top"> 
                                <ControlSlider min={0} max={30} label={"Horizontal Placing"} showScale={true}  initValue={horizontal_slider_value}  callback={setHorizontal_slider_value}/>
                            </Col>
                        </Row>
                        <Row className = "mar-top">

                        { addon_group_check ?
                            <div className = "addon-group">
                                <Col  xs={12}>
                                    <p> <small> Add-ons </small> </p> 
                                </Col> 
                                <Col  xs={{ span: 10, offset: 2 }} >
                                    <div className = "cus_switch_group"> 
                                        <p className = "cus_label"> A </p>
                                        <label className="cus_switch  mar-right-15"> 
                                        <input id = "cus_switch"  type="checkbox"
                                            defaultChecked={front_back_checked}
                                            onChange={() => setAddon_a_checked(!addon_a_checked)}
                                        />  
                                        <span className="cus_slider cus_round"></span>
                                        <span className="cus_absolute-no"></span>
                                        </label> 
                                    </div>
                                </Col>
                                <Col  xs={{ span: 10, offset: 2 }} >
                                    <div className = "cus_switch_group">
                                        <p className = "cus_label"> B </p>
                                        <label className="cus_switch  mar-right-15"> 
                                        <input id = "cus_switch"  type="checkbox"
                                            defaultChecked={front_back_checked}
                                            onChange={() => setAddon_b_checked(!addon_b_checked)}
                                        />  
                                        <span className="cus_slider cus_round"></span>
                                        <span className="cus_absolute-no"></span>
                                        </label> 
                                    </div>
                                </Col>
                                <Col  xs={{ span: 10, offset: 2 }} >
                                    <div className = "cus_switch_group">
                                        <p className = "cus_label"> C </p>
                                        <label className="cus_switch  mar-right-15"> 
                                        <input id = "cus_switch"  type="checkbox"
                                            defaultChecked={front_back_checked}
                                            onChange={() => setAddon_c_checked(!addon_c_checked)}
                                        />  
                                        <span className="cus_slider cus_round"></span>
                                        <span className="cus_absolute-no"></span>
                                        </label> 
                                    </div>
                                </Col>
                            </div>
                            : null
                        }
 
                        { addon_group_check ? 
                            <Col  xs={12} className = "text-center">
                                <i className="custom-arrow custom-up addon-action-button" onClick={() => setAddon_group_check(false) }></i>
                            </Col> 
                            : 
                            <Col  xs={12} className = "text-center">
                                <i className="custom-arrow custom-down addon-action-button" onClick={() => setAddon_group_check(true) }></i>
                            </Col>
                        }

                        </Row>
                        <Row className = "row">
                            <Col  xs={12} className = "mar-top">
                                <div className = "pattern-group">
                                    <PatternImg callback={setShirt_pattern} current_pattern="pattern1" img={"assets/pattern/pattern1.png"} />
                                    <PatternImg callback={setShirt_pattern} current_pattern="pattern2" img={"assets/pattern/pattern2.png"} />
                                    <PatternImg callback={setShirt_pattern} current_pattern="pattern3" img={"assets/pattern/pattern3.png"} />
                                    <PatternImg callback={setShirt_pattern} current_pattern="pattern4" img={"assets/pattern/pattern4.png"} /> 
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
}; 
export default POC;