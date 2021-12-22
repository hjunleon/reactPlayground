import "./Test_fresnel.scss"
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadShaders, my_shader_libs } from "../../../lib/threeJS/utils";


export default function Test_fresnel(){


    const canvasRef = useRef();
    const statsRef = useRef();

    // Stats

    let onStats = false
    let stats;
    if (onStats){
        
        const StatsMenu = () => {
            return new Stats();
        };
        stats = StatsMenu();
    }


    const MyCanvas = () => {
        let scene,
            camera,
            renderer,
            skyboxGeo,
            skybox,
            controls,
            myReq,
            fps,
            loader;
        fps = 30; //30;
        
        // Basic variables

        scene = new THREE.Scene();
        scene.background = new THREE.Color("#0a1e01");   //#2abec1
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        let canvasHeight = window.innerHeight
        let canvasWidth = window.innerWidth

        renderer.setSize(canvasWidth, canvasHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.outputEncoding = THREE.sRGBEncoding;
        // renderer.toneMapping = THREE.ReinhardToneMapping;


        // Camera
        // camera = new THREE.PerspectiveCamera(
        //     75,
        //     window.innerWidth / window.innerHeight,
        //     0.1,
        //     2500
        // );
        // camera.position.set(0.0, 4.0, 6.0);
        // camera.rotation.set(-0.3);

        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
        camera.position.z = 5;
        controls = new OrbitControls(camera, renderer.domElement);
        controls.update();
    
        scene.add( new THREE.AmbientLight( 0xa0a0a0 ) );
        
        // White directional light at half intensity shining from the top.
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        scene.add( directionalLight );

        //  Model

        loader = new GLTFLoader(); //GLTFLoader();
        let model_path = "/assets/3D/models/machi.gltf";
        loader.load(model_path, (model) => {
            console.log(model);
    
            // renderer = new OutlineEffect(renderer);
            
            let scale = 10;
            model.scene.scale.set(scale,scale,scale);
            scene.add(model.scene);
        });

        // https://jsfiddle.net/8n36c47p/4/
        // let fresnelShader = {

        //     uniforms: {},
        
        //     vertexShader: [
            
        //         "varying vec3 vPositionW;",
        //         "varying vec3 vNormalW;",
        
        //         "void main() {",
        
        //         "	vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);",
        //         " vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );",
        
        //         "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        
        //         "}"
        
        //     ].join( "\n" ),
        
        //     fragmentShader: [
            
        //         "varying vec3 vPositionW;",
        //         "varying vec3 vNormalW;",
        
        //         "void main() {",
                
        //         "	vec3 color = vec3(1., 1., 1.);",
        //         "	vec3 viewDirectionW = normalize(cameraPosition - vPositionW);",
        //         "	float fresnelTerm = dot(viewDirectionW, vNormalW);",
        //         "	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);",
        
        //         "	gl_FragColor = vec4( color * fresnelTerm, 1.);",
        
        //         "}"
        
        //     ].join( "\n" )
        
        // };


        let uniforms = {
            scale:{
              type: "f",
              value: 10.0,
            },
            time: {
              type: "f",
              value: 0.1,
            },
            // projectionMatrix: camera.projectionMatrix,
            resolution: new THREE.Uniform( new THREE.Vector2(canvasWidth,canvasHeight) ),
        }



        let shaderDir = "/assets/3D/shaders/";
        let vertShader = shaderDir + "test_fresnel/test.vert";//"noise.vert";
        let fragShader = shaderDir + "test_fresnel/test.frag"; //basic_raymarch, test_fresnel


        // let geometry = new THREE.TorusKnotBufferGeometry( 1, 0.3, 128, 16 );
        // let material = new THREE.ShaderMaterial( {
        //         vertexShader: fresnelShader.vertexShader,
        //         fragmentShader: fresnelShader.fragmentShader
        //     });

        // let mesh = new THREE.Mesh( geometry, material );
        // scene.add( mesh );


        loadShaders(vertShader, fragShader, my_shader_libs).then((shaders) => {
            //Create shader text
            console.log(shaders)
    
            // Plane
    
            const detail = 1;
            const geometry = new THREE.TorusKnotBufferGeometry( 1, 0.3, 128, 16 * detail );
            const material = new THREE.ShaderMaterial({
              type: "noise",
              uniforms: THREE.UniformsUtils.merge([uniforms]),
              vertexShader: shaders[0].replace(/\r/gi, ""),
              fragmentShader: shaders[1].replace(/\r/gi, ""),
              side: THREE.DoubleSide,
              light: true,
            });
            // console.log(shaders[2])
            let utils = shaders[2]
            material.onBeforeCompile = shader => {
                console.log("onBeforeCompile")
                for (let i in utils){
                  for (let j in utils){
                    const re = new RegExp(`^(?!\/\/)#include <${utils[j]["name"]}>`, 'gm')
                    const content = utils[j]["content"]
                    utils[i]["content"] = utils[i]["content"].replace(
                        re,
                        content
                    )
                  }
                }
                for (let idx in utils){
                    let util = utils[idx]
                    console.log(util["name"])
                    const re = new RegExp(`^(?!\/\/)#include <${util["name"]}>`, 'gm')
                    const content = util["content"]
                    shader.vertexShader = shader.vertexShader.replace(
                        re,
                        content
                    )
                    console.log(`Replacing fragment`)
                    shader.fragmentShader = shader.fragmentShader.replace(
                        re,
                        content
                    )
                }
            }
            let mesh = new THREE.Mesh( geometry, material );
            // plane.rotation.x = Math.PI / 4;
            // console.log(`plane.rotation: ${plane.rotation}`)
            scene.add(mesh);
        });




        

        // Onresize

        const onWindowResize = (event) => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        onWindowResize();
        window.addEventListener("resize", onWindowResize, false);


        // Frame logic

        let start = Date.now();

        function render() {
            // const timer = Date.now() * 0.00025;
            // console.log("scene")
            // console.log(scene)
            //  console.log(plane_mat)
            renderer.render(scene, camera);
            // composer.render();
        }

        // Animation Loop

        var dt = 1000 / fps; // 60fps  1000 / 60;
        var timeTarget = 0;
        var animate = function () {
            //if (resizeRendererToDisplaySize(renderer)) {
            //   const canvas = renderer.domElement;
            //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
            //   camera.updateProjectionMatrix();
            // }
            if (onStats){
                stats.begin();
            }
            if (Date.now() >= timeTarget) {
                render();

                timeTarget += dt;
                if (Date.now() >= timeTarget) {
                timeTarget = Date.now();
                }
            }

            if (onStats){
                stats.end();
            }
            requestAnimationFrame(animate);
        };

        animate();

        // Return canvas
        return renderer.domElement;


    }

    


    useEffect(() => {
        canvasRef.current.appendChild(MyCanvas()); //https://stackoverflow.com/questions/66138102/render-html-dom-node-in-react-component
        if (onStats){
            statsRef.current.appendChild(stats.dom);
        }
      }, []);
    
      return (
        <div>
          {/* <Topbar /> */}
          {/* , marginTop: "24px"  */}
          <div style={{ position: "relative"}}>
            <div className="statsMenu" ref={statsRef}></div>
            <div ref={canvasRef}></div>
          </div>
        </div>
      );
}