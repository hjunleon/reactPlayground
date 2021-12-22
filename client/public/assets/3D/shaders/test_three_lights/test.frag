precision highp float;

varying vec2 vUv;
varying vec3 vecPos;
varying vec3 vecNormal;

uniform float lightIntensity;
uniform sampler2D textureSampler;
#if NUM_DIR_LIGHTS > 0
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

#if NUM_POINT_LIGHTS > 0
    struct PointLight {
        vec3 color;
        vec3 position; // light position, in camera coordinates
        float distance; // used for attenuation purposes. Since
                        // we're writing our own shader, it can
                        // really be anything we want (as long as
                        // we assign it to our light in its
                        // "distance" field
    };
#endif
uniform PointLight pointLights[NUM_POINT_LIGHTS];

void main(void) {
  // Pretty basic lambertian lighting...
  vec4 addedLights = vec4(0.0,
                          0.0,
                          0.0,
                          1.0);
  for(int l = 0; l < NUM_POINT_LIGHTS; l++) {
      vec3 lightDirection = normalize(vecPos
                            - pointLights[l].position);
      vec3 color = pointLights[l].color;
      addedLights.rgb += clamp(dot(-lightDirection,
                               vecNormal), 0.0, 1.0)
                         * color
                         * lightIntensity;
  }
  gl_FragColor = texture2D(textureSampler, vUv) * addedLights;
}