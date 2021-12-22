varying vec3 vPositionW;
varying vec3 vNormalW;


// varying mat4 p_matrix;
uniform mat4 projectionMatrix;
struct Lights
{
  vec3 position;
  vec3 diffuse; // Colour
};

float diffuse(vec3 N, vec3 L)
{
  vec3 nrmN = normalize(N);
  vec3 nrmL = normalize(L);
  float result = dot(nrmN, nrmL);  //lambert reflectance
  return max(result, 0.0);
}
