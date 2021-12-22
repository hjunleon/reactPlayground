

uniform float scale;
uniform float time;
uniform vec2 resolution;

varying vec3 vPositionW;
varying vec3 vNormalW;


// varying mat4 p_matrix;
uniform mat4 projectionMatrix;



#include <fresnel>

void main(){
    vec2 st = gl_FragCoord.xy / resolution.xy;
    // projectionMatrix = p_matrix;
    vec3 color = vec3(1.);
    vec2 pos = st.xy  + time * 0.1;
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    float fresnelTerm = fresnel(0.75, viewDirectionW, vNormalW); //dot(viewDirectionW, vNormalW);
    fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
    color *= fresnelTerm;
    gl_FragColor = vec4(color, 1.0);

}