
uniform float scale;
uniform float time;
uniform vec2 resolution;

varying vec3 vPositionW;
varying vec3 vNormalW;

uniform mat4 projectionMatrix;

#if NUM_DIR_LIGHTS  > 0
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
        int shadow;
        float shadowBias;
        float shadowRadius;
        vec2 shadowMapSize;
     };
     uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

// #if NUM_POINT_LIGHTS > 0

// #endif
uniform vec3 ambi_color;

struct AmbLight {
    vec3 value;
}



struct Lights
{
  vec3 position;
  vec3 diffuse; // Colour
};

float blinnPhongSpecular(
  vec3 lightDirection,
  vec3 viewDirection,
  vec3 surfaceNormal,
  float shininess) {

  //Calculate Blinn-Phong power
//   vec3 H = normalize(viewDirection + lightDirection);   // the halfway unit vector
  vec3 H = reflect(-lightDirection, surfaceNormal);
  return pow(max(0.0, dot(surfaceNormal, H)), shininess);
}

// float regularPhong(
//     vec3 lightDirection,
//     vec3 viewDirection,
//     vec3 surfaceNormal,
// ){

//     vec3 reflectDir = reflect(-lightDir, norm);
// }

vec3 diffuse(vec3 norm, vec3 lightDir,vec3 lightColor){
    float diff = max(dot(norm, lightDir), 0.0);
    return diff * lightColor;
}


void main(){
    vec2 st = gl_FragCoord.xy / resolution.xy;
    Lights light;
    light.position = vec3(2,1,4);
    light.diffuse = vec3(1.0, 1.0, 1.0);
    vec3 ambi_light = ambi_color;//vec3(.2, .2, .2)
    float shininess = 32.;  //32
    vec3 lightDirection = normalize(light.position - gl_FragCoord.xyz);  
    vec3 eyeDirection = normalize(cameraPosition - gl_FragCoord.xyz);  //vPositionW
    vec3 base_color = vec3(.9,.3,.5); //vec3(1.,1.,1.);//
    vec3 diffuse = diffuse(vNormalW, lightDirection, light.diffuse);
    float spec_power = blinnPhongSpecular(lightDirection, eyeDirection, vNormalW, shininess);
    float spec_strength = 12.5;  // 10.
    vec3 spec = spec_power * spec_strength * light.diffuse;
    vec3 color = base_color * (ambi_color + spec + diffuse);

    gl_FragColor = vec4(color, 1.0);
}