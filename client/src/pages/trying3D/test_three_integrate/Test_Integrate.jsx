import "./Test_Integrate.scss";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { TextureLoader } from "three/examples/jsm/loaders/BasisTextureLoader";
// import Stats from "three/examples/jsm/libs/stats.module.js";
import { loadShaders, my_shader_libs } from "../../../lib/threeJS/utils";

export default function Test_Three_Integrate() {
  const canvasRef = useRef();
  const statsRef = useRef();

  const MyCanvas = () => {
    let scene,
      camera,
      renderer,
      skyboxGeo,
      skybox,
      controls,
      myReq,
      fps,
      light,
      stats,
      character,
      textureLoader;
    fps = 30; //30;
    let onStats = false;
    scene = new THREE.Scene();
    textureLoader = new THREE.TextureLoader();

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45;
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    var NEAR = 0.1;
    var FAR = 1000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 5);
    camera.lookAt(scene.position);
    // RENDERER
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    var container = document.body;
    container.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();


    // Create light
    light = new THREE.PointLight(0xffffff, 1.0);
    // We want it to be very close to our character
    light.position.set(0.0, 0.0, 0.1);
    scene.add(light);

    // Onresize

    const onWindowResize = (event) => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    function render() {
      // Update light profile
      var timestampNow = new Date().getTime() / 1000.0;
      var lightIntensity = 0.75 + 0.25 * Math.cos(timestampNow * Math.PI);
      if (character) {
        character.material.uniforms.lightIntensity.value = lightIntensity;
      }

      light.color.setHSL(lightIntensity, 1.0, 0.5);
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

    var buildCharacter = (function () {
      var _geo = null;

      // Share the same geometry across all planar objects
      function getPlaneGeometry() {
        if (_geo == null) {
          _geo = new THREE.PlaneGeometry(1.0, 1.0);  //new THREE.BoxGeometry( 1, 1, 1 );
        }

        return _geo;
      }

      return function () {
        let shaderDir = "/assets/3D/shaders/";
        let vertShader = shaderDir + "test_three_lights/test.vert";//"test_three_lights/test.vert";
        let fragShader = shaderDir + "test_three_lights/test.frag";
        loadShaders(vertShader, fragShader, my_shader_libs).then((shaders) => {
          var g = getPlaneGeometry();
          var creatureImage = textureLoader.load(
            "/assets/3D/textures/MYFACE.jpg" //cobbledColor.tif"
          );
          creatureImage.magFilter = THREE.NearestFilter;

          var mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
              THREE.UniformsLib["lights"],
              {
                lightIntensity: { type: "f", value: 1.0 },
                textureSampler: { type: "t", value: null },
              },
            ]),
            vertexShader: shaders[0].replace(/\r/gi, ""),
            fragmentShader: shaders[1].replace(/\r/gi, ""),
            transparent: true,
            lights: true,
          });
          // THREE.UniformsUtils.merge() call THREE.clone() on
          // each uniform. We don't want our texture to be
          // duplicated, so I assign it to the uniform value
          // right here.
          mat.uniforms.textureSampler.value = creatureImage;

          var obj = new THREE.Mesh(g, mat);
          character = obj;
          scene.add(obj);
        });
      };
    })();

    // Create character
    buildCharacter();
    // scene.add(character);

    animate();

    // Return canvas
    return renderer.domElement;
  };

  useEffect(() => {
    canvasRef.current.appendChild(MyCanvas()); //https://stackoverflow.com/questions/66138102/render-html-dom-node-in-react-component
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
