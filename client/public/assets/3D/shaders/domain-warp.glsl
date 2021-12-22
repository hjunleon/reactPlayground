#include <musgrave>


vec3 domain_warp(in vec2 xy, in float u_time){
    vec3 color = vec3(0.0);

    // , 8, 12., 1.2, 0.75
    int octave = 8;
    float scale = 2.;
    float lacunarity = 1.2;
    float amp = 0.5;


    vec2 q = vec2(0.);
    q.x = fbm_2D( xy + 0.00*u_time, octave, scale, lacunarity, amp);
    q.y = fbm_2D( xy + vec2(1.0) , octave, scale, lacunarity, amp);

    vec2 r = vec2(0.);
    r.x = fbm_2D( xy + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time , octave, scale, lacunarity, amp);
    r.y = fbm_2D( xy + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time , octave, scale, lacunarity, amp);

    float f = fbm_2D(xy+r, octave, scale, lacunarity, amp);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    return (f*f*f+.6*f*f+.5*f)*color;
}