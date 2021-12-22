// #include <musgrave>
// #include <domain-warp>
#include <voronoi>
#include <metaballs>

varying float qnoise;
// varying float noise;


uniform vec2 resolution;
uniform float scale;
uniform float time;
uniform bool redhell;
uniform float rcolor;
uniform float gcolor;
uniform float bcolor;

// #define USE_DEFAULTS

#ifndef random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                * 43758.5453123);
}
#endif


// Value noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH

#ifndef random
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}
#endif


mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}





void main() {
    float r, g, b;
    vec2 st = gl_FragCoord.xy / resolution.xy; ///u_resolution.xy;
    vec3 color = vec3(0.0);
    vec2 pos = st.xy  + time * 0.1;   //* vec2(10.,3.)
    // vec2 pos = st.xy + time * 1.;
    // float noise = noise(st*3.0);
    // float fractal = fbm_2D(pos, 8, 12., 1., 0.5);
    // color += fractal;
    // color = vec3(mix(noise,fractal,abs(sin(time))));
    // color += fbm(pos, 8, 50., 2.2)

    color = voronoi(st, 20.) - smoothVoronoi(st, 20.);  //domain_warp   //metaballs   voronoi


    vec3 step1 = vec3(0.);
    vec3 step2 = vec3(0.06);
    vec3 step3 = vec3(0.074);

    vec3 firstColor = vec3(0,0,0);
    vec3 secondColor = vec3(0.042,0.347,0.451);
    vec3 thirdColor = vec3(1.,1.,1.);

    color = mix(firstColor, secondColor, smoothstep(step1, step2, color));
    color = mix(color, thirdColor, smoothstep(step2, step3, color));

    gl_FragColor = vec4(color, 1.0);
    // float pattern = pos.x;
    // pos = rotate2d( noise(pos) ) * pos;
    // pattern = lines(pos,.5);
    // gl_FragColor = vec4(vec3(pattern), 1.0);
    // if (!redhell == true) {
    //     r = sin(qnoise * scale + rcolor);
    //     g = normalize(qnoise * scale + (gcolor / 2.0));
    //     b = tan(qnoise * scale + bcolor);
    // } else {
    //     r = normalize(qnoise * scale + rcolor);
    //     g = cos(qnoise * scale + gcolor);
    //     b = sin(qnoise * scale + bcolor);
    // }
    // gl_FragColor = vec4(r, g, b, 1.0);
}