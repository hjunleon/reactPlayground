import "./Webgl_materials_variations_toon.scss";
import Topbar from "../../../components/topbar/Topbar";
import { useEffect, useState, useRef } from "react";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module.js";



export default function TrySkyBox(){
    let scene, camera, renderer, skyboxGeo, skybox, controls, myReq;
    let zoomOut = false;
    let autoRotate = true;
    let skyBoxDir = "assets"
    let skyboxImage = 'TropicalSunnyDay';
    const skyUseCubeText = false;


    function createPathStrings(filename) {
        const baseFilename = `${skyBoxDir}/${filename}/`;
        // const baseFilename = basePath + filename;
        const fileType = '.jpg';//filename == 'purplenebula' ? '.png' : '.jpg';
        // const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
        const sides = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
        const pathStings = sides.map(side => {
          return baseFilename + '_' + side + fileType;
        });
      
        return pathStings;
    }

    function createMaterialArray(filename) {
        const skyboxImagepaths = createPathStrings(filename);
        const materialArray = skyboxImagepaths.map(image => {
          let texture = new THREE.TextureLoader().load(image);
      
          return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
        });
        return materialArray;
    }

    if (skyUseCubeText){
        // Skybox
        const cubetextureloader = new THREE.CubeTextureLoader();

        const skybox = cubetextureloader.load(createPathStrings(skyboxImage));

        scene.background = skybox;
    } else {
        // Skybox as big cube

        const materialArray = createMaterialArray(skyboxImage);

        skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
        
        skybox = new THREE.Mesh(skyboxGeo, materialArray);

        scene.add(skybox);

        function switchSkyBox (skyboxName) {
            scene.remove(skybox);
            skyboxImage = skyboxName;
            const materialArray = createMaterialArray(skyboxImage);
          
            skybox = new THREE.Mesh(skyboxGeo, materialArray);
            scene.add(skybox);
        }
    }

    


    // Controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.minDistance = 700;
    controls.maxDistance = 1500;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Onresize

    const onWindowResize = (event) => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        //   uniforms.u_resolution.value.x = renderer.domElement.width;
        //   uniforms.u_resolution.value.y = renderer.domElement.height;
      }
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

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