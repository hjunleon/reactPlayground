

uniform float scale;
uniform float time;
uniform vec2 resolution;

varying vec3 vPositionW;
varying vec3 vNormalW;


// varying mat4 p_matrix;
uniform mat4 projectionMatrix;

struct Lights
{
  vec3 position;
  vec3 diffuse; // Colour
};

float lambert(vec3 N, vec3 L)
{
  vec3 nrmN = normalize(N);
  vec3 nrmL = normalize(L);
  float result = dot(nrmN, nrmL);
  return max(result, 0.0);
}

void main(){
    vec2 st = gl_FragCoord.xy / resolution.xy;
    // projectionMatrix = p_matrix;
    Lights light;
    light.position = vec3(2,1,4);
    light.diffuse = vec3(1.0, 1.0, 1.0);
    vec3 base_color = vec3(.4,.1,.5);
    vec3 color = base_color * light.diffuse * lambert(vNormalW, light.position);//vec3(1.);
    vec2 pos = st.xy  + time * 0.1;
    gl_FragColor = vec4(color, 1.0);

}