import "./Trying3D.scss";
import Topbar from "../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";

import * as THREE from "three";

// import * as THREE from "node_modules/three/build/three.js";
// https://stackoverflow.com/questions/35995261/comicbook-shader-for-real-time-with-three-js-cel-shading
// https://stackoverflow.com/questions/17537879/in-webgl-what-are-the-differences-between-an-attribute-a-uniform-and-a-varying

// const – The declaration is of a compile time constant.
// attribute – Global variables that may change per vertex, that are passed from the OpenGL application to vertex shaders. This qualifier can only be used in vertex shaders. For the shader this is a read-only variable. See Attribute section.
// uniform – Global variables that may change per primitive [...], that are passed from the OpenGL application to the shaders. This qualifier can be used in both vertex and fragment shaders. For the shaders this is a read-only variable. See Uniform section.
// varying – used for interpolated data between a vertex shader and a fragment shader. Available for writing in the vertex shader, and read-only in a fragment shader. See Varying section.

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";

import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import Stats from "three/examples/jsm/libs/stats.module.js";


export default function Trying3D() {
  const canvasRef = useRef();
  let stats;
  const MyCanvas = () => {
    var renderer = new THREE.WebGLRenderer();
    console.log("Renderer");
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    //scene.add( cube );
    var loader = new MMDLoader(); //GLTFLoader();
    function Bus() {
      //   loader.load("/assets/3D/models/marumaruTextured.glb", function (gltf) {
      //     console.log(gltf);

      //     scene.add(gltf.scene);
      //   });
      //   let modelPath =
      //     "/assets/3D/models/Raiden\ Shogun\ -\ Baal/Raiden.pmx";
      //   let modelPath = "/assets/3D/models/ウェンティ/ウェンティ.pmx";
      // let modelPath = "/assets/3D/models/lisa/lisa.pmx"
      let modelPath = "/assets/3D/models/venti/ventiEnglish.pmx";
      console.log(modelPath);
      loader.load(modelPath, (model) => {
        console.log(model);

        // renderer = new OutlineEffect(renderer);
        scene.add(model);
      });
    }

    Bus();

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    /*
var light = new THREE.AmbientLight( 0xF0F0E0 ); // soft white light
scene.add( light );
*/
    const color = 0xffffff;
    const intensity = 0.25;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);

    const color2 = 0xffffff;
    const intensity2 = 1;
    const light2 = new THREE.AmbientLight(color2, intensity2);
    scene.add(light);
    scene.add(light2);

    scene.background = new THREE.Color(0xff0000);


    const StatsMenu = () => {
        return new Stats();
      };
    stats = StatsMenu();

    const uniformsOutline = {
      outlineThickness: { value: 0.006 },
      outlineColor: { value: [69/256, 21/256, 15/256] }, //#654321    139,69,19  69,21,15
      outlineAlpha: { value: 1.0 },
    };

    console.log("uniformsOutline: ")
    console.log(uniformsOutline)

    const vertexShader = [
      "#include <common>",
      "#include <uv_pars_vertex>",
      "#include <displacementmap_pars_vertex>",
      "#include <fog_pars_vertex>",
      "#include <morphtarget_pars_vertex>",
      "#include <skinning_pars_vertex>",
      "#include <logdepthbuf_pars_vertex>",
      "#include <clipping_planes_pars_vertex>",

      "uniform float outlineThickness;",

      "vec4 calculateOutline( vec4 pos, vec3 normal, vec4 skinned ) {",
      "	float thickness = outlineThickness;",
      "	const float ratio = 1.0;", // TODO: support outline thickness ratio for each vertex
      "	vec4 pos2 = projectionMatrix * modelViewMatrix * vec4( skinned.xyz + normal, 1.0 );",
      // NOTE: subtract pos2 from pos because BackSide objectNormal is negative
      "	vec4 norm = normalize( pos - pos2 );",
      "	return pos + norm * thickness * pos.w * ratio;",
      "}",

      "void main() {",

      "	#include <uv_vertex>",

      "	#include <beginnormal_vertex>",
      "	#include <morphnormal_vertex>",
      "	#include <skinbase_vertex>",
      "	#include <skinnormal_vertex>",

      "	#include <begin_vertex>",
      "	#include <morphtarget_vertex>",
      "	#include <skinning_vertex>",
      "	#include <displacementmap_vertex>",
      "	#include <project_vertex>",

      "	vec3 outlineNormal = - objectNormal;", // the outline material is always rendered with BackSide

      "	gl_Position = calculateOutline( gl_Position, outlineNormal, vec4( transformed, 1.0 ) );",

      "	#include <logdepthbuf_vertex>",
      "	#include <clipping_planes_vertex>",
      "	#include <fog_vertex>",

      "}",
    ].join("\n");

    const fragmentShader = [
      "#include <common>",
      "#include <fog_pars_fragment>",
      "#include <logdepthbuf_pars_fragment>",
      "#include <clipping_planes_pars_fragment>",

      "uniform vec3 outlineColor;",
      "uniform float outlineAlpha;",

      "void main() {",

      "	#include <clipping_planes_fragment>",
      "	#include <logdepthbuf_fragment>",

      "	gl_FragColor = vec4( outlineColor, outlineAlpha );",

      "	#include <tonemapping_fragment>",
      "	#include <encodings_fragment>",
      "	#include <fog_fragment>",
      "	#include <premultiplied_alpha_fragment>",

      "}",
    ].join("\n");

    console.log("Outline");
    console.log(vertexShader);
    console.log(fragmentShader);

    let outlineMaterial = new THREE.ShaderMaterial({
      type: "OutlineEffect",
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["fog"],
        THREE.UniformsLib["displacementmap"],
        uniformsOutline,
      ]),
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
    });

    console.log(outlineMaterial);

    //Object uuid to another object to object of materials. Materials object key is material uuid and value is the material object
    let materialMap = {}

    let renderLogic = function(){
        renderer.render(scene, camera);

        const currentAutoClear = renderer.autoClear;
        const currentSceneAutoUpdate = scene.autoUpdate;
        const currentSceneBackground = scene.background;
        const currentShadowMapEnabled = renderer.shadowMap.enabled;
        scene.autoUpdate = false;
        scene.background = null;
        renderer.autoClear = false;
        renderer.shadowMap.enabled = false;
      
  
        // console.log(scene)
        for(let i = 0; i < scene.children.length; i+=1){
            let child = scene.children[i]
            if(child.type == "SkinnedMesh"){
                let materials = {}
                //Save the materials
                if (child.uuid in materialMap){
                    materials = materialMap[child.uuid]
                } else {
                    let materialsArr = child.material
                    // for(let j = 0; j < materialsArr.length; j += 1){
                    //     let curMat = materialsArr[j]
                    //     materials[curMat.uuid] = curMat
                    // }
                    materialMap[child.uuid] = materialsArr
                }
                
                //Repalce with outline
                child.material = outlineMaterial
            }

        }
          // for(let i = 0; i < )
        
  
        renderer.render(scene, camera);

        //Restore the materials
        
        for(let i = 0; i < scene.children.length; i+=1){
            let child = scene.children[i]
            if(child.type == "SkinnedMesh"){
                if (child.uuid in materialMap){
                    child.material = materialMap[child.uuid]
                }

            }

        }
        scene.autoUpdate = currentSceneAutoUpdate;
        scene.background = currentSceneBackground;
        renderer.autoClear = currentAutoClear;
        renderer.shadowMap.enabled = currentShadowMapEnabled;


    }


    var dt = 1000 / 60; // 60fps  1000 / 60;
    var timeTarget = 0;
    var animate = function () {
      //if (resizeRendererToDisplaySize(renderer)) {
      //   const canvas = renderer.domElement;
      //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
      //   camera.updateProjectionMatrix();
      // }

      stats.begin();
      if (Date.now() >= timeTarget) {
        renderLogic();

        timeTarget += dt;
        if (Date.now() >= timeTarget) {
          timeTarget = Date.now();
        }
      }

      stats.end();
      requestAnimationFrame(animate);

        

      //cube.rotation.z += 0.01;
      //cube.rotation.y += 0.01;
      //controls.update();

      
    };

    animate();

    function onWindowResize(event) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      //   uniforms.u_resolution.value.x = renderer.domElement.width;
      //   uniforms.u_resolution.value.y = renderer.domElement.height;
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    return renderer.domElement;
    //return <div>{renderer.domElement}</div>;
  };

  useEffect(() => {
    canvasRef.current.appendChild(MyCanvas()); //https://stackoverflow.com/questions/66138102/render-html-dom-node-in-react-component
  }, []);

  return (
    <div>
      <Topbar />
      <div ref={canvasRef}></div>
    </div>
  );
}
