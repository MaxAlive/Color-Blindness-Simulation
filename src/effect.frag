precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

// out time variable coming from p5
uniform float time;

// color conversion functions from Sam Hocevar
// http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl
// sad to admit that I have no clue how the math inside here works, but they show up all over the web when you search for glsl rgb to hsb
// we will just use them as functions, feel free to copy and use as you like
// don't worry about what's going on in here, just copy paste into your own shaders if you need
vec3 rgb2hsb(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsb2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 protanopia(vec3 c){
    vec3 n = pow(c.rgb / vec3(255), vec3(2.4));

    float l = 0.31399022 * n.r + 0.63951294 * n.g + 0.04649755 * n.b;
    float m = 0.15537241 * n.r + 0.75789446 * n.g + 0.08670142 * n.b;
    float s = 0.01775239 * n.r + 0.10944209 * n.g + 0.87256922 * n.b;

    float lp = 1.05118294 * m - 0.05116099 * s;

    float r = 5.47221206 * lp - 4.6419601 * m + 0.16963708 * s;
    float g = -1.1252419 * lp + 2.29317094 * m - 0.1678952 * s;
    float b = 0.02980165 * lp - 0.19318073 * m + 1.16364789 * s;

    vec3 real = pow(vec3(r, g, b), vec3(1.0 / 2.4)) * vec3(255);
    
    return real;
}


void main() {

  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = 1.0 - uv;

  // get the webcam as a vec4 using texture2D
  vec4 tex = texture2D(tex0, uv);

  // convert the texture to hsb using our function from up top
  //vec3 hsb = rgb2hsb(tex.rgb);

  // lets make the hue spin in circles
  // first add the time to our hue value
  //hsb.r += time;

  // then fract it to make sure we always get numbers that go from 0 - 1
  //hsb.r = fract(hsb.r);

  // finally convert back to rgb
  //vec3 rgb = hsb2rgb(hsb);
  vec3 rgb = protanopia(tex.rgb);

  // output to screen
  gl_FragColor = vec4(rgb, 1.0);
  // gamma correction
  //gl_FragColor = vec4(pow(gl_FragColor.rgb, vec3(2.2)), 1.0);

  // try altering the saturation or brightness values!
}
