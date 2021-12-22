uniform float time;
uniform float size;
varying vec3 vPositionW;
varying vec3 vNormalW;
// varying mat4 p_matrix;
void main(){
    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
    vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
    // p_matrix = projectionMatrix;
    gl_Position = (projectionMatrix * modelViewMatrix) * vec4( position, 1. ); //abs(size)
    // gl_PointSize = (3.0);
}