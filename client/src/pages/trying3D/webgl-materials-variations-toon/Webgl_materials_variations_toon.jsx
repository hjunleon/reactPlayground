import "./Webgl_materials_variations_toon.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";

import * as THREE from "three";

// import * as THREE from "node_modules/three/build/three.js";
// https://stackoverflow.com/questions/35995261/comicbook-shader-for-real-time-with-three-js-cel-shading

// console.log(Object.keys(THREE));

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader.js";

import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect.js";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default function Webgl_materials_variations_toon() {
  const canvasRef = useRef();
  const statsRef = useRef();
  let stats;
  const MyCanvas = () => {
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    console.log("Renderer");
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;

    // let effect = new OutlineEffect(renderer, {
    //   defaultThickness: 0.1,
    // });
    // let effect = new StereoEffect( renderer )

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2500
    );
    camera.position.set(0.0, 400, 400 * 3.5);
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    const color = 0xffffff;
    const intensity = 0.25;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);

    const color2 = 0xffffff;
    const intensity2 = 1;
    const light2 = new THREE.AmbientLight(color2, intensity2);

    let particleLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    particleLightMat.side = THREE.FrontSide;
    console.log("particleLightMat");
    console.log(particleLightMat);

    let particleLight = new THREE.Mesh(
      new THREE.SphereGeometry(48, 8, 8),
      particleLightMat
    );

    console.log(particleLight);
    const pointLight = new THREE.PointLight(0xffffff, 2, 800);
    particleLight.add(pointLight);

    scene.add(light);
    scene.add(light2);
    scene.add(particleLight);

    scene.background = new THREE.Color(0x444488);

    // Materials

    const cubeWidth = 420;
    const numberOfSphersPerSide = 5;
    const sphereRadius = (cubeWidth / numberOfSphersPerSide) * 0.8 * 0.5;
    const stepSize = 1.0 / numberOfSphersPerSide;

    let meshList = [];
    let defaultMaterial = new THREE.MeshToonMaterial({
      color: new THREE.Color("#debeef"),
    });

    const geometry = new THREE.SphereGeometry(sphereRadius, 32, 16);

    for (
      let alpha = 0, alphaIndex = 0;
      alpha <= 1.0;
      alpha += stepSize, alphaIndex++
    ) {
      const colors = new Uint8Array(alphaIndex + 2);

      for (let c = 0; c <= colors.length; c++) {
        colors[c] = (c / colors.length) * 256;
      }

      const gradientMap = new THREE.DataTexture(
        colors,
        colors.length,
        1,
        THREE.LuminanceFormat
      );
      gradientMap.minFilter = THREE.NearestFilter;
      gradientMap.magFilter = THREE.NearestFilter;
      gradientMap.generateMipmaps = false;

      for (let beta = 0; beta <= 1.0; beta += stepSize) {
        for (let gamma = 0; gamma <= 1.0; gamma += stepSize) {
          // basic monochromatic energy preservation
          const diffuseColor = new THREE.Color()
            .setHSL(alpha, 0.5, gamma * 0.5 + 0.1)
            .multiplyScalar(1 - beta * 0.2);

          const material = new THREE.MeshToonMaterial({
            color: diffuseColor,
            gradientMap: gradientMap,
          });

          const mesh = new THREE.Mesh(geometry, material);

          mesh.position.x = alpha * 400 - 200;
          mesh.position.y = beta * 400 - 200;
          mesh.position.z = gamma * 400 - 200;

          meshList.push(mesh);

          scene.add(mesh);
        }
      }
    }

    stats = StatsMenu();

    const uniformsOutline = {
      outlineThickness: { value: 0.01 },
      outlineColor: { value: [0, 0, 0] },
      outlineAlpha: { value: 1.0 },
    };

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

    function render() {
      const timer = Date.now() * 0.00025;

      particleLight.position.x = Math.sin(timer * 7) * 300;
      particleLight.position.y = Math.cos(timer * 5) * 400;
      particleLight.position.z = Math.cos(timer * 3) * 300;
      renderer.render(scene, camera);

      // camera.target = new THREE.Vector3(100 * Math.sin(timer), 0, 100 * Math.cos(timer))
      // for (let i = 0; i < meshList.length; i += 1) {
      //   meshList[i].onBeforeRender = function (
      //     renderer,
      //     scene,
      //     camera,
      //     geometry,
      //     material,
      //     group
      //   ) {
      //     // your code here
      //     meshList[i].material = effect.setOutlineMaterial(material);
      //     // console.log(material)
      //   };
      // }
      const currentAutoClear = renderer.autoClear;
      const currentSceneAutoUpdate = scene.autoUpdate;
      const currentSceneBackground = scene.background;
      const currentShadowMapEnabled = renderer.shadowMap.enabled;
      scene.autoUpdate = false;
      scene.background = null;
      renderer.autoClear = false;
      renderer.shadowMap.enabled = false;

      // particleLight.onBeforeRender = function (
      //   renderer,
      //   scene,
      //   camera,
      //   geometry,
      //   material,
      //   group
      // ) {
      //   // your code here
      //   particleLight.material = effect.setOutlineMaterial(material);
      //   // console.log(particleLightMat.material);
      //   // console.log(material)
      // };
      particleLight.material = outlineMaterial;
      // particleLight.material.needsUpdate = true
      renderer.render(scene, camera);

      scene.autoUpdate = currentSceneAutoUpdate;
			scene.background = currentSceneBackground;
			renderer.autoClear = currentAutoClear;
			renderer.shadowMap.enabled = currentShadowMapEnabled;
      // // console.log("Before");
      // // console.log(particleLight.material);
      // effect.render(scene, camera);

      // // for (let i = 0; i < meshList.length; i += 1) {
      // //   meshList[i].onBeforeRender = function (
      // //     renderer,
      // //     scene,
      // //     camera,
      // //     geometry,
      // //     material,
      // //     group
      // //   ) {
      // //     // your code here
      // //     meshList[i].material = defaultMaterial;
      // //     // console.log(material)
      // //   };
      // // }
      // particleLight.onBeforeRender = function (
      //   renderer,
      //   scene,
      //   camera,
      //   geometry,
      //   material,
      //   group
      // ) {
      //   particleLight.material = particleLightMat;
      //   // console.log(particleLightMat.material);
      // };
      // // console.log("After");
      // // console.log(particleLight.material);
      particleLight.material = particleLightMat;
      // particleLight.material.needsUpdate = true
      // scene.autoUpdate = currentSceneAutoUpdate;
      // scene.background = currentSceneBackground;
      // renderer.autoClear = currentAutoClear;
      // renderer.shadowMap.enabled = currentShadowMapEnabled;
    }

    var dt = 1000 / 8; // 60fps  1000 / 60;
    var timeTarget = 0;
    var animate = function () {
      //if (resizeRendererToDisplaySize(renderer)) {
      //   const canvas = renderer.domElement;
      //   camera.aspect = canvas.clientWidth / canvas.clientHeight;
      //   camera.updateProjectionMatrix();
      // }

      stats.begin();
      if (Date.now() >= timeTarget) {
        render();

        timeTarget += dt;
        if (Date.now() >= timeTarget) {
          timeTarget = Date.now();
        }
      }

      stats.end();
      requestAnimationFrame(animate);
    };

    animate();

    function onWindowResize(event) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      //   uniforms.u_resolution.value.x = renderer.domElement.width;
      //   uniforms.u_resolution.value.y = renderer.domElement.height;
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    return renderer.domElement;
    //return <div>{renderer.domElement}</div>;
  };

  const StatsMenu = () => {
    return new Stats();
  };

  useEffect(() => {
    canvasRef.current.appendChild(MyCanvas()); //https://stackoverflow.com/questions/66138102/render-html-dom-node-in-react-component
    statsRef.current.appendChild(stats.dom);
  }, []);

  return (
    <div>
      <Topbar />
      <div style={{ position: "relative" }}>
        <div className="statsMenu" ref={statsRef}></div>
        <div ref={canvasRef}></div>
      </div>
    </div>
  );
}
