import "./Test_Lambert.scss";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadShaders, my_shader_libs } from "../../../lib/threeJS/utils";

// Test_Raymarch
export default function Test_Lambert() {
  const canvasRef = useRef();
  const statsRef = useRef();

  // Stats

  let onStats = false;
  let stats;
  if (onStats) {
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
    scene.background = new THREE.Color("#1a1e31"); //#2abec1
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    let canvasHeight = window.innerHeight;
    let canvasWidth = window.innerWidth;

    renderer.setSize(canvasWidth, canvasHeight);
    // renderer.outputEncoding = THREE.sRGBEncoding;
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

    let ambi_light_color = new THREE.Color("0x2a1a3a"); //0xa0a0a0  0xfff000 MUST BE STRING
    console.log(`ambi_light_color:`);
    console.log(ambi_light_color);
    scene.add(new THREE.AmbientLight(ambi_light_color));

    // White directional light at half intensity shining from the top.
    let dir_light_color = new THREE.Color("0xffffff");
    const directionalLight = new THREE.DirectionalLight(dir_light_color, 1);
    scene.add(directionalLight);

    let pt_light_color = new THREE.Color(0x567890);
    const pointLight = new THREE.PointLight(0x567890, 1.0);
    pointLight.position.set(5, 0, -3);
    scene.add(pointLight);


    //  Model

    loader = new GLTFLoader(); //GLTFLoader();
    let model_path = "/assets/3D/models/machi.gltf";
    loader.load(model_path, (model) => {
        console.log(model);
        let scale = 10;
        model.scene.scale.set(scale,scale,scale);
        scene.add(model.scene);
    });

    let my_uniforms = {
      scale: {
        type: "f",
        value: 10.0,
      },
      time: {
        type: "f",
        value: 0.1,
      },
      ambi_color: {
        //ambientLightColor
        // type: "c",
        value: ambi_light_color,
      },
      // resolution: new THREE.Uniform(
      //   new THREE.Vector2(canvasWidth, canvasHeight)
      // ),

      resolution: [canvasWidth, canvasHeight]
    };
    // uniforms = THREE.UniformsUtils.merge([
    //   THREE.UniformsLib["lights"],
    //   uniforms,
    // ]);
    console.log(my_uniforms);

    let shaderDir = "/assets/3D/shaders/";
    let vertShader = shaderDir + "test_three_lights/test.vert";  //"test_lambert/test.vert"; //"noise.vert";basic_raymarch
    let fragShader = shaderDir + "test_three_lights/test.frag";  //"test_lambert/test_blinnphong_multi.frag"; //basic_raymarch, test_fresnel

    loadShaders(vertShader, fragShader, my_shader_libs).then((shaders) => {
      //Create shader text
      const detail = 1;
      const geometry = new THREE.TorusKnotBufferGeometry(
        1,
        0.3,
        128,
        16 * detail
      );
      // let geometry =  new THREE.PlaneGeometry(1.0, 1.0);
      let material = new THREE.ShaderMaterial({
        type: "noise",
        uniforms: THREE.UniformsUtils.merge([
          my_uniforms,
          THREE.UniformsLib["lights"]
        ]),
        vertexShader: shaders[0].replace(/\r/gi, ""),
        fragmentShader: shaders[1].replace(/\r/gi, ""),
        side: THREE.DoubleSide,
        light: true,
      });
      // console.log(shaders[2])
      let utils = shaders[2];
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
      let mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(3.0, 0.75, 1);
      // plane.rotation.x = Math.PI / 4;
      // console.log(`plane.rotation: ${plane.rotation}`)
      scene.add(mesh);
    });

    // loadShaders(vertShader, fragShader, my_shader_libs).then((shaders) => {
    //   //Create shader text
    //   console.log(shaders);

    //   // Plane

    //   const detail = 1;
    //   const geometry = new THREE.PlaneGeometry(8, 8, 32 * detail, 32 * detail);
    //   const material = new THREE.ShaderMaterial({
    //     type: "noise",
    //     uniforms: uniforms, //THREE.UniformsUtils.merge([uniforms]),
    //     vertexShader: shaders[0].replace(/\r/gi, ""),
    //     fragmentShader: shaders[1].replace(/\r/gi, ""),
    //     side: THREE.DoubleSide,
    //     light: true,
    //   });
    //   // console.log(shaders[2])
    //   let utils = shaders[2];
    //   // material.onBeforeCompile = shader => {
    //   //     console.log("onBeforeCompile")
    //   //     for (let i in utils){
    //   //       for (let j in utils){
    //   //         const re = new RegExp(`^(?!\/\/)#include <${utils[j]["name"]}>`, 'gm')
    //   //         const content = utils[j]["content"]
    //   //         utils[i]["content"] = utils[i]["content"].replace(
    //   //             re,
    //   //             content
    //   //         )
    //   //       }
    //   //     }
    //   //     for (let idx in utils){
    //   //         let util = utils[idx]
    //   //         console.log(util["name"])
    //   //         const re = new RegExp(`^(?!\/\/)#include <${util["name"]}>`, 'gm')
    //   //         const content = util["content"]
    //   //         shader.vertexShader = shader.vertexShader.replace(
    //   //             re,
    //   //             content
    //   //         )
    //   //         console.log(`Replacing fragment`)
    //   //         shader.fragmentShader = shader.fragmentShader.replace(
    //   //             re,
    //   //             content
    //   //         )
    //   //     }
    //   // }
    //   let mesh = new THREE.Mesh(geometry, material);
    //   mesh.scale.set(30, 30, 30);
    //   mesh.rotation.x = Math.PI / 2;
    //   mesh.translateZ(3);
    //   // plane.rotation.x = Math.PI / 4;
    //   // console.log(`plane.rotation: ${plane.rotation}`)
    //   scene.add(mesh);
    //   // console.log(material.__webglShader.uniforms)
    // });

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
      renderer.render(scene, camera);
    }

    // Animation Loop

    var dt = 1000 / fps; // 60fps  1000 / 60;
    var timeTarget = 0;
    var animate = function () {
      if (onStats) {
        stats.begin();
      }
      if (Date.now() >= timeTarget) {
        render();

        timeTarget += dt;
        if (Date.now() >= timeTarget) {
          timeTarget = Date.now();
        }
      }

      if (onStats) {
        stats.end();
      }
      requestAnimationFrame(animate);
    };

    animate();

    // Return canvas
    return renderer.domElement;
  };
  useEffect(() => {
    canvasRef.current.appendChild(MyCanvas()); //https://stackoverflow.com/questions/66138102/render-html-dom-node-in-react-component
    if (onStats) {
      statsRef.current.appendChild(stats.dom);
    }
  }, []);

  return (
    <div>
      {/* <Topbar /> */}
      {/* , marginTop: "24px"  */}
      <div style={{ position: "relative" }}>
        <div className="statsMenu" ref={statsRef}></div>
        <div ref={canvasRef}></div>
      </div>
    </div>
  );
}
