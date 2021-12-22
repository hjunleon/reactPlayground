uniform float time;
uniform float size;
varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec2 vUv;
varying vec3 vecPos;
void main(){
    vUv = uv;
    vecPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
    vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
    gl_Position = projectionMatrix * vec4( vecPos, 1. ); //abs(size)
}