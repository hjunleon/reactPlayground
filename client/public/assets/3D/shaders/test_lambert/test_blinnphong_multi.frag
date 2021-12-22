precision highp float;
// uniform float scale;
// uniform float time;
uniform vec2 resolution;

varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vecPos;

uniform mat4 projectionMatrix;

// #if NUM_DIR_LIGHTS > 0
//     struct DirectionalLight {
//         vec3 direction;
//         vec3 color;
//         int shadow;
//         float shadowBias;
//         float shadowRadius;
//         vec2 shadowMapSize;
//      };
//      uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
// #endif

#if NUM_POINT_LIGHTS > 0
  struct PointLight {
    vec3 color;
    vec3 position; 
  };
  uniform PointLight pointLights[NUM_POINT_LIGHTS];
#endif




uniform vec3 ambi_color;

// struct AmbLight {
//     vec3 value;
// };



// struct Lights
// {
//   vec3 position;
//   vec3 diffuse; // Colour
// };

float blinnPhongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  //Calculate Blinn-Phong power
  vec3 H = normalize(viewDirection + lightDirection);   // the halfway unit vector
  // vec3 H = reflect(-lightDirection, surfaceNormal);
  return pow(max(0.0, dot(surfaceNormal, H)), shininess);
}
vec3 diffuse(vec3 norm, vec3 lightDir,vec3 lightColor){
    float diff = max(dot(norm, lightDir), 0.0);
    return diff * lightColor;
}


void main(){
    vec2 st = gl_FragCoord.xy / resolution.xy;
    // Lights light;
    // light.position = vec3(2,1,4);
    // light.diffuse = vec3(1.0, 1.0, 1.0);
    vec3 ambi_light = ambi_color;//vec3(.2, .2, .2)
    float shininess = 32.;  //32
    vec3 eyeDirection = normalize(cameraPosition - gl_FragCoord.xyz);  //vPositionW
    vec3 base_color = vec3(.9,.3,.5); //vec3(1.,1.,1.);//
    float spec_strength = 12.5;  // 10.
    vec3 final_color = vec3(0.,0.,0.);
    
    // POINT LIGHTS
    for(int l = 0; l < NUM_POINT_LIGHTS; l += 1){
      vec3 lightDirection = normalize(pointLights[l].position - gl_FragCoord.xyz);  
      vec3 lightColor = pointLights[l].position;
      vec3 diffuse = diffuse(vNormalW, lightDirection, lightColor);
      float spec_power = blinnPhongSpecular(lightDirection, eyeDirection, vNormalW, shininess);
      
      vec3 spec = spec_power * spec_strength * lightColor;
      final_color += base_color * (ambi_color + spec + diffuse);
    }
    // for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
    //     vec3 lightDirection = normalize(vecPos
    //                           - pointLights[l].position);
    //     vec3 color = pointLights[l].color;
    //     final_color += clamp(dot(-lightDirection,
    //                             vNormalW), 0.0, 1.0)
    //                       * color;
    // }
    // DIR LIGHTS
    for(int l = 0; l < NUM_DIR_LIGHTS; l += 1){
      vec3 lightDirection = directionalLights[l].direction;//normalize(light.position - gl_FragCoord.xyz);  
      vec3 lightColor = directionalLights[l].color;
      vec3 diffuse = diffuse(vNormalW, lightDirection, lightColor);
      float spec_power = blinnPhongSpecular(lightDirection, eyeDirection, vNormalW, shininess);
      
      vec3 spec = spec_power * spec_strength * lightColor;
      final_color += base_color * (ambi_color + spec + diffuse);
    }

    gl_FragColor = vec4(final_color, 1.0);
}