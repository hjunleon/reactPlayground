import * as THREE from "three";
export async function loadShaders (v, f, others) {
    const loader = new THREE.FileLoader();
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


export const my_shader_libs = [   // fk i need to do compiler dependency tree liddat...
    {
        "name":"classicnoise2D",
        "path":'classicnoise2D.glsl',
        "is_vs":true,
        "is_fs":true,
    },
    {
        "name":"noise_utils",
        "path":'noise_utils.glsl',
        "is_vs":true,
        "is_fs":false,
    },
    
    {
      "name":"musgrave",
      "path":'musgrave.glsl',
      "is_vs":false,
      "is_fs":true,
    },
    {
      "name":"domain-warp",
      "path":'domain-warp.glsl',
    },
    {
      "name":"voronoi",
      "path":"voronoi.glsl"
    },
    {
      "name":"metaballs",
      "path": "metaballs.glsl"
    },
    
    {
        "name":"fresnel",
        "path": "fresnel.glsl"
    }
  ]

const shaderDir = "/assets/3D/shaders/";
for (let i = 0; i < my_shader_libs.length; i += 1){
    my_shader_libs[i]["path"] = shaderDir + my_shader_libs[i]["path"]
}