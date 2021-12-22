uniform float scale;
uniform float time;
uniform vec2 resolution;

uniform mat4 projectionMatrix;
varying vec3 vPositionW;
varying vec3 vNormalW;

// varying vec2 this_uv;

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float PRECISION = 0.001;

float sdSphere(vec3 p, float r )
{
  vec3 offset = vec3(0, 0, -2);
  return length(p - offset) - r;
}

float rayMarch(vec3 ro, vec3 rd, float start, float end) {
  float depth = start;

  for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
    vec3 p = ro + depth * rd;
    float d = sdSphere(p, 1.);
    depth += d;
    if (d < PRECISION || depth > end) break;
  }

  return depth;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(1.0, -1.0) * 0.0005; // epsilon
    float r = 1.; // radius of sphere
    return normalize(
      e.xyy * sdSphere(p + e.xyy, r) +
      e.yyx * sdSphere(p + e.yyx, r) +
      e.yxy * sdSphere(p + e.yxy, r) +
      e.xxx * sdSphere(p + e.xxx, r));
}


void main(){
    // vec2 st = gl_FragCoord.xy / resolution.xy;
    vec2 uv = gl_FragCoord.xy - .5 * resolution.xy / resolution.y;
    vec3 color = vec3(0.);
    vec3 backgroundColor = vec3(0.1);//vec3(0.835, 1, 1);
    vec3 ro = vec3(0, 8, 0); // ray origin//cameraPosition;
    vec3 rd = normalize(vec3(uv, -1));//normalize(cameraPosition - vPositionW);

    float d = rayMarch(ro, rd, MIN_DIST, MAX_DIST); // distance to sphere

    if (d > MAX_DIST) {
        color = backgroundColor; // ray didn't hit anything
    } else {
        vec3 p = ro + rd * d; // point on sphere we discovered from ray marching
        vec3 normal = calcNormal(p);
        vec3 lightPosition = vec3(0, 0, 4);
        vec3 lightDirection = normalize(lightPosition - p);

        // Calculate diffuse reflection by taking the dot product of 
        // the normal and the light direction.
        float dif = clamp(dot(normal, lightDirection), 0.3, 1.);

        // Multiply the diffuse reflection value by an orange color and add a bit
        // of the background color to the sphere to blend it more with the background.
        color = dif * vec3(1, 0.58, 0.29) + backgroundColor * .2;
    }

    gl_FragColor = vec4(color, 1.0);
}