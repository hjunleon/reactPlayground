//https://github.com/blender/blender/blob/594f47ecd2d5367ca936cf6fc6ec8168c2b360d0/source/blender/gpu/shaders/material/gpu_shader_material_fresnel.glsl

#ifndef fresnel_dielectric_cos
#define fresnel_dielectric_cos fresnel_dielectric_cos
    float fresnel_dielectric_cos(float cosi, float eta)
    {
    /* compute fresnel reflectance without explicitly computing
    * the refracted direction */
    float c = abs(cosi);
    float g = eta * eta - 1.0 + c * c;
    float result;

    if (g > 0.0) {
        g = sqrt(g);
        float A = (g - c) / (g + c);
        float B = (c * (g + c) - 1.0) / (c * (g - c) + 1.0);
        result = 0.5 * A * A * (1.0 + B * B);
    }
    else {
        result = 1.0; /* TIR (no refracted component) */
    }

    return result;
    }

    float fresnel_dielectric(vec3 Incoming, vec3 Normal, float eta)
    {
    /* compute fresnel reflectance without explicitly computing
    * the refracted direction */
    return fresnel_dielectric_cos(dot(Incoming, Normal), eta);
    }
#endif


#ifndef fresnel
    #define fresnel fresnel
    float fresnel(float ior, vec3 N, vec3 I) //, out float result
    {
        N = normalize(N);
        /* handle perspective/orthographic */
        vec3 I_view = (projectionMatrix[3][3] == 0.0) ? normalize(I) : vec3(0.0, 0.0, -1.0);

        float eta = max(ior, 0.00001);
        float result = fresnel_dielectric(I_view, N, (gl_FrontFacing) ? eta : 1.0 / eta);
        return result;
    }
#endif