import * as THREE from '/src/html/modules/three.module.js';
import {GLTFLoader} from '/src/html/modules/GLTFLoader.js';
import { OrbitControls } from '/src/html/modules/OrbitControls.js';
import { GUI } from '/src/html/modules/dat.gui.module.js'

let scene, camera, hlight;

            function init() {

                scene = new THREE.Scene();
                scene.background = new THREE.Color(0x616164);
                
                camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight,0.1,1000);
                camera.position.z = 5;
                camera.position.y = 2;
                camera.rotation.x = -0.3;

                hlight = new THREE.AmbientLight (0x404040, 6);
                scene.add(hlight);



                const renderer = new THREE.WebGLRenderer();
                renderer.setSize(window.innerWidth,window.innerHeight);
                document.body.appendChild(renderer.domElement);

                const controls = new OrbitControls( camera, renderer.domElement );

                camera.position.set( 0, 20, 100 );
                controls.update();

                function animate() {

                    requestAnimationFrame( animate );
                    // required if controls.enableDamping or controls.autoRotate are set to true
                    controls.update();
                    renderer.render( scene, camera );

                }

                const gui = new GUI();
                let turtle;
                let loader = new GLTFLoader();
                loader.load('/turtle.gltf', function(gltf) {
                    turtle = gltf.scene.children[0];
                    var input = document.getElementById( 'input' );
                    scene.add(gltf.scene);
                    animate()
                })
            }

            export default init()