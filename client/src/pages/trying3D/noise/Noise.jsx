import "./Noise.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";

import { TweenMax, Quart, Elastic } from "gsap/all";
import * as THREE from "three";

// import * as THREE from "node_modules/three/build/three.js";
// https://stackoverflow.com/questions/35995261/comicbook-shader-for-real-time-with-three-js-cel-shading

// console.log(Object.keys(THREE));

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";

import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function Noise() {
  console.log("NOISY");
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
    loader = new THREE.FileLoader();

    // Themes

    var Theme = {
      primary: 0xffffff,
      secondary: 0x292733,
      danger: 0xff0000,
      darker: 0x000000,
    };

    // Basic variables

    scene = new THREE.Scene();
    scene.background = new THREE.Color(Theme["secondary"]);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    //  Uniforms

    let uniforms = {
      time: {
        type: "f",
        value: 0.1,
      },
      scale: {
        type: "f",
        value:10.0,
      },
      pointscale: {
        type: "f",
        value: 0.2,
      },
      decay: {
        type: "f",
        value: 0.3,
      },
      size: {
        type: "f",
        value: 0.3,
      },
      displace: {
        type: "f",
        value: 0.3,
      },
      complex: {
        type: "f",
        value: 0.0,
      },
      waves: {
        type: "f",
        value: 0.1,
      },
      eqcolor: {
        type: "f",
        value: 0.0,
      },
      rcolor: {
        type: "f",
        value: 0.0,
      },
      gcolor: {
        type: "f",
        value: 0.0,
      },
      bcolor: {
        type: "f",
        value: 0.0,
      },
      fragment: {
        type: "i",
        value: true,
      },
      redhell: {
        type: "i",
        value: true,
      },
    };

    // Loading shaders

    let shaderDir = "/assets/3D/shaders/";
    let noiseUtils = shaderDir + "noise_utils.glsl";
    let listOfOthers = [
        {
            "name":"classicnoise2D",
            "path":'classicnoise2D.glsl',
            "is_vs":true,
            "is_fs":true,
        },
        // {
        //     "name":"noise_utils",
        //     "path":'noise_utils.glsl',
        //     "is_vs":true,
        //     "is_fs":false,
        // },
    ]
    
    for (let i = 0; i < listOfOthers.length; i += 1){
        listOfOthers[i]["path"] = shaderDir + listOfOthers[i]["path"]
    }
    console.log("listOfOthers")
    console.log(listOfOthers)
    let vertShader = shaderDir + "noise2D.vert";//"noise.vert";
    let fragShader = shaderDir + "noise.frag";

    let plane_mat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });

    const loadShaders = async (v, f, others) => {
      console.log(`v and f: ${v}, ${f}`);
      let toRet = [];
      let p1 = new Promise((resolve) => {
        loader.load(v, (data) => {
          toRet.push(data);
          resolve();
        });
      });
      let p2 = new Promise((resolve) => {
        loader.load(f, (data) => {
          toRet.push(data);
          resolve();
        });
      });
      let promise_arr = [p1, p2]
    //   let utils = []
      for (let idx in others){
        promise_arr.push(
            new Promise((resolve) => {
                let fp = others[idx]["path"]
                loader.load(fp, (data) => {
                    others[idx]["content"] = data
                    resolve();
                });
            })
        )
      }
      // toRet.push(await loader.load(v,(data)=>{return data }))
      // toRet.push(await loader.load(f,(data)=>{return data }))
      await Promise.all(promise_arr);
      console.log(`toRet ${toRet.length}`);

    //   console.log(toRet);
      toRet.push(others)
      return toRet;
    };

    const createBox = () => {
      loadShaders(vertShader, fragShader, listOfOthers).then((shaders) => {
        //Create shader text
        console.log(shaders)

        // Plane

        const detail = 6;

        const plane_geom = new THREE.SphereGeometry(
          15,
          32 * detail,
          32 * detail
        ); // new THREE.BoxGeometry(8, 8, 8, 256, 256); //BoxGeometry PlaneGeometry
        // const plane_mat = new THREE.MeshBasicMaterial({
        //     color: 0xffff00,
        //     side: THREE.DoubleSide,
        // });
        plane_mat = new THREE.ShaderMaterial({
          type: "noise",
          uniforms: THREE.UniformsUtils.merge([uniforms]),
          vertexShader: shaders[0].replace(/\r/gi, ""),
          fragmentShader: shaders[1].replace(/\r/gi, ""),
          side: THREE.DoubleSide,
        });
        // console.log(shaders[2])
        let utils = shaders[2]
        plane_mat.onBeforeCompile  = shader => {
            console.log("onBeforeCompile")
            // console.log(shader)
            for (let idx in utils){
                let util = utils[idx]
                console.log("util")
                console.log(util)
                console.log(util["name"])
                console.log(util["content"])
                if (util["is_vs"]){
                    shader.vertexShader = shader.vertexShader.replace(
                        `#include <${util["name"]}>`,
                        util["content"]
                    )
                }
                if (util["is_fs"]){
                    shader.fragmentShader = shader.fragmentShader.replace(
                        `#include <${util["name"]}>`,
                        util["content"]
                    )
                }
            }
        }
        const plane = new THREE.Mesh(plane_geom, plane_mat);
        plane.rotation.x = Math.PI / 4;
        // console.log(`plane.rotation: ${plane.rotation}`)
        scene.add(plane);
      });
    };

    createBox();

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    camera.position.set(0.0, 4.0, 6.0);
    camera.rotation.set(-0.3);

    // let skyBoxDir = "/assets/3D/sky/"
    // let skyboxImage = 'TropicalSunnyDay';
    // const skyUseCubeText = false;

    // function createPathStrings(filename) {
    //     const baseFilename = `${skyBoxDir}/${filename}/`;
    //     // const baseFilename = basePath + filename;
    //     const fileType = '.jpg';//filename == 'purplenebula' ? '.png' : '.jpg';
    //     // const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
    //     const sides = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    //     const pathStings = sides.map(side => {
    //         return baseFilename + '_' + side + fileType;
    //     });

    //     return pathStings;
    // }

    // function createMaterialArray(filename) {
    //     const skyboxImagepaths = createPathStrings(filename);
    //     const materialArray = skyboxImagepaths.map(image => {
    //         let texture = new THREE.TextureLoader().load(image);

    //         return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    //     });
    //     return materialArray;
    // }

    // if (skyUseCubeText){
    //     // Skybox
    //     const cubetextureloader = new THREE.CubeTextureLoader();

    //     const skybox = cubetextureloader.load(createPathStrings(skyboxImage));

    //     scene.background = skybox;
    // } else {
    //     // Skybox as big cube

    //     const materialArray = createMaterialArray(skyboxImage);

    //     skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);

    //     skybox = new THREE.Mesh(skyboxGeo, materialArray);

    //     scene.add(skybox);

    //     function switchSkyBox (skyboxName) {
    //         scene.remove(skybox);
    //         skyboxImage = skyboxName;
    //         const materialArray = createMaterialArray(skyboxImage);

    //         skybox = new THREE.Mesh(skyboxGeo, materialArray);
    //         scene.add(skybox);
    //     }
    // }

    // Controls

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.minDistance = 0.7;
    controls.maxDistance = 1500;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Options

    let options = {
      perlin: {
        speed: 0.4,
        size: 0.7,
        perlins: 1.0,
        decay: 1.2,
        displace: 1.0,
        complex: 0.5,
        waves: 3.7,
        eqcolor: 10.0,
        rcolor: 1.5,
        gcolor: 1.5,
        bcolor: 1.5,
        fragment: true,
        points: false,
        redhell: true,
      },
      is_wire: false,
      perlinRandom: function () {
        TweenMax.to(this.perlin, 2, {
          //decay: Math.random() * 1.0,
          waves: Math.random() * 20.0,
          complex: Math.random() * 1.0,
          displace: Math.random() * 2.5,
          ease: Elastic.easeOut,
        });
      },
      random: function () {
        //this.perlin.redhell = Math.random() >= 0.5; // 10 1 0.1 1.2
        TweenMax.to(this.perlin, 1, {
          eqcolor: 11.0,
          rcolor: Math.random() * 1.5,
          gcolor: Math.random() * 0.5,
          bcolor: Math.random() * 1.5,
          ease: Quart.easeInOut,
        });
      },
      normal: function () {
        this.perlin.redhell = true; // 10 1 0.1 1.2
        TweenMax.to(this.perlin, 1, {
          //speed: 0.12,
          eqcolor: 10.0,
          rcolor: 1.5,
          gcolor: 1.5,
          bcolor: 1.5,
          ease: Quart.easeInOut,
        });
      },
      darker: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        TweenMax.to(this.perlin, 1, {
          //speed: 0.5,
          eqcolor: 9.0,
          rcolor: 0.4,
          gcolor: 0.05,
          bcolor: 0.6,
          ease: Quart.easeInOut,
        });
      },
      volcano: function () {
        this.perlin.redhell = false; // 10 1 0.1 1.2
        //this.perlin.speed = 0.83;

        TweenMax.to(this.perlin, 1, {
          size: 0.7,
          waves: 0.6,
          complex: 1.0,
          displace: 0.3,
          eqcolor: 9.0,
          rcolor: 0.85,
          gcolor: 0.05,
          bcolor: 0.32,
          ease: Quart.easeInOut,
        });
      },
      cloud: function () {
        this.perlin.redhell = true; // 10 1 0.1 1.2
        //this.perlin.speed = 0.1;

        TweenMax.to(this.perlin, 1, {
          size: 1.0,
          waves: 20.0,
          complex: 0.1,
          displace: 0.1,
          eqcolor: 4.0,
          rcolor: 1.5,
          gcolor: 0.7,
          bcolor: 1.5,
          ease: Quart.easeInOut,
        });
      },
      tornasol: function () {
        this.perlin.redhell = true; // 10 1 0.1 1.2
        //this.perlin.speed = 0.25;

        TweenMax.to(this.perlin, 1, {
          size: 1.0,
          waves: 3.0,
          complex: 0.65,
          displace: 0.5,
          eqcolor: 9.5,
          rcolor: 1.5,
          gcolor: 1.5,
          bcolor: 1.5,
          ease: Quart.easeInOut,
        });
      },
    };

    // Dat GUI

    function createGUI() {
      var gui = new GUI();

      var perlinGUI = gui.addFolder("Shape Setup");
      perlinGUI.add(options, "perlinRandom").name("• Random Shape");
      perlinGUI.add(options.perlin, "speed", 0.1, 1.0).name("Speed").listen();
      perlinGUI.add(options.perlin, "size", 0.0, 3.0).name("Size").listen();
      //perlinGUI.add(options.perlin, 'decay', 0.0, 1.0).name('Decay').listen();
      perlinGUI.add(options.perlin, "waves", 0.0, 20.0).name("Waves").listen();
      perlinGUI
        .add(options.perlin, "complex", 0.1, 1.0)
        .name("Complex")
        .listen();
      perlinGUI
        .add(options.perlin, "displace", 0.1, 2.5)
        .name("Displacement")
        .listen();
      //perlinGUI.open();

      var colorGUI = gui.addFolder("Color");
      colorGUI.add(options, "random").name("• Random colors");
      colorGUI.add(options, "normal").name("• Normal colors");
      colorGUI.add(options, "darker").name("• Dark colors");
      colorGUI.add(options.perlin, "eqcolor", 0.0, 30.0).name("Hue").listen();
      colorGUI.add(options.perlin, "rcolor", 0.0, 2.5).name("R").listen();
      colorGUI.add(options.perlin, "gcolor", 0.0, 2.5).name("G").listen();
      colorGUI.add(options.perlin, "bcolor", 0.0, 2.5).name("B").listen();
      colorGUI.add(options.perlin, "redhell", true).name("Electroflow");

      //colorGUI.open();

      gui.add(options, "volcano").name("• Volcano");
      gui.add(options, "tornasol").name("• Tornasol");
      gui.add(options, "cloud").name("• Cotton Candy");
      gui.add(options.perlin, "points", true).name("Points");
      gui.add(options, "is_wire", true).name("Wire only");

      gui.domElement.id = 'gui';
    }

    createGUI();

    // Onresize

    const onWindowResize = (event) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      //   uniforms.u_resolution.value.x = renderer.domElement.width;
      //   uniforms.u_resolution.value.y = renderer.domElement.height;
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
      if ("uniforms" in plane_mat) {
        // console.log(plane_mat.uniforms)
        plane_mat.uniforms["time"].value =
          (options.perlin.speed / 1000) * (Date.now() - start);
        plane_mat.uniforms["pointscale"].value = options.perlin.perlins;
        plane_mat.uniforms["decay"].value = options.perlin.decay;
        plane_mat.uniforms["size"].value = options.perlin.size;
        plane_mat.uniforms["displace"].value = options.perlin.displace;
        plane_mat.uniforms["complex"].value = options.perlin.complex;
        plane_mat.uniforms["waves"].value = options.perlin.waves;
        plane_mat.uniforms["fragment"].value = options.perlin.fragment;

        plane_mat.uniforms["redhell"].value = options.perlin.redhell;
        plane_mat.uniforms["eqcolor"].value = options.perlin.eqcolor;
        plane_mat.uniforms["rcolor"].value = options.perlin.rcolor;
        plane_mat.uniforms["gcolor"].value = options.perlin.gcolor;
        plane_mat.uniforms["bcolor"].value = options.perlin.bcolor;
      }
      renderer.render(scene, camera);
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
  };
  //React ref

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
