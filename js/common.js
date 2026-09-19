(function () {
  AOS.init({
    duration: 800,
    once: true,
  });

  document.querySelector(".return-top").style.display = "none";

  function scrollEvent() {
    let _scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (_scrollTop > 100) {
      document.querySelector(".return-top").style.display = "flex";
      document.querySelector("header").classList.add("on");
    } else {
      document.querySelector(".return-top").style.display = "none";
      document.querySelector("header").classList.remove("on");
    }
  }

  window.addEventListener("scroll", scrollEvent);

  let animationExecuted = false; // 플래그 추가
  const word = document.querySelector(".word"); // 문자열이 적혀있는 태그

  const displayLetters = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      addClassname(arr, i);
    }
  };

  const addClassname = (arr, i) => {
    setTimeout(() => {
      arr[i].classList.add("on");
    }, 350 + i * 80); // i 뒤에 곱해지는 수로 애니메이션 조정
  };
  const splitLetters = (word) => {
    const letters = [];
    const content = word.innerHTML;
    word.innerHTML = "";
    for (let i = 0; i < content.length; i++) {
      let letter = document.createElement("span");
      letter.className = "letter";
      letter.innerHTML = content.charAt(i);
      word.appendChild(letter);
      letters.push(letter);
    }

    displayLetters(letters);
  };

  window.addEventListener("scroll", function () {
    const target = document.getElementById("contact");
    const rect = target.getBoundingClientRect();

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (!animationExecuted) {
        // 애니메이션이 아직 실행되지 않은 경우에만 실행
        splitLetters(word);
        animationExecuted = true; // 애니메이션이 실행된 후 플래그를 true로 설정
      }
    }
  });

  // 프로젝트 호버시 마우스 이미지 변경
  let cursorImgBox = document.querySelector(".cursor .img-box");
  let workLinks = document.querySelectorAll(".projet__list li a");

  // 커서 이동시 이미지박스 함께 이동
  document.addEventListener("mousemove", (e) => {
    cursorImgBox.style.top = `${e.clientY}px`;
    cursorImgBox.style.left = `${e.clientX}px`;
    cursorImgBox.animate(
      {
        top: `${e.clientY}px`,
        left: `${e.clientX}px`,
      },
      2000
    );
  });

  workLinks.forEach((i) => {
    const target = i;
    imageUrl = target.getAttribute("data-img");
    let cursorImg = document.querySelector(`${imageUrl}`);

    i.addEventListener("mouseover", () => {
      cursorImgBox.classList.add("on");
      cursorImg.classList.add("on");
    });
    i.addEventListener("mouseout", () => {
      cursorImgBox.classList.remove("on");
      cursorImg.classList.remove("on");
    });
  });
})();

const randomX = random(-400, 400);
const randomY = random(-200, 200);
const randomDelay = random(0, 50);
const randomTime = random(6, 12);
const randomTime2 = random(5, 6);
const randomAngle = random(-30, 150);

const blurs = gsap.utils.toArray(".blur");
blurs.forEach((blur) => {
  gsap.set(blur, {
    x: randomX(-1),
    y: randomX(1),
    rotation: randomAngle(-1),
  });

  moveX(blur, 1);
  moveY(blur, -1);
  rotate(blur, 1);
});


function random(min, max) {
  const delta = max - min;
  return (direction = 1) => (min + delta * Math.random()) * direction;
}

function scrollIntoStart(id) {
  const x = document.getElementById(id);
  x.scrollIntoView({ behavior: "smooth", block: "start" });
}







/* =====================================================
   WEBGL UNDERWATER CAUSTICS SHADER
===================================================== */

(function () {

    const canvas = document.getElementById("caustics-canvas");

    if (!canvas) {
        return;
    }

    const gl = canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        premultipliedAlpha: false
    });

    if (!gl) {
        console.warn("WebGL is not supported.");

        canvas.style.background =
            "linear-gradient(180deg, #09233d, #020914)";

        return;
    }


    /* =================================================
       VERTEX SHADER
    ================================================= */

    const vertexShaderSource = `

        attribute vec2 a_position;

        void main() {

            gl_Position = vec4(a_position, 0.0, 1.0);

        }

    `;


    /* =================================================
       FRAGMENT SHADER
    ================================================= */

    const fragmentShaderSource = `

        precision highp float;

        uniform vec2 u_resolution;
        uniform float u_time;


        /* 2D Random */

        float hash(vec2 p) {

            p = fract(p * vec2(123.34, 456.21));

            p += dot(p, p + 45.32);

            return fract(p.x * p.y);

        }


        /* Smooth Noise */

        float noise(vec2 p) {

            vec2 i = floor(p);
            vec2 f = fract(p);

            f = f * f * (3.0 - 2.0 * f);

            float a = hash(i);
            float b = hash(i + vec2(1.0, 0.0));
            float c = hash(i + vec2(0.0, 1.0));
            float d = hash(i + vec2(1.0, 1.0));

            return mix(
                mix(a, b, f.x),
                mix(c, d, f.x),
                f.y
            );

        }


        /* Fractal Noise */

        float fbm(vec2 p) {

            float value = 0.0;
            float amplitude = 0.5;

            for (int i = 0; i < 5; i++) {

                value += noise(p) * amplitude;

                p = p * 2.0 + vec2(13.7, 8.2);

                amplitude *= 0.5;

            }

            return value;

        }


        /* 물속의 빛 패턴 */

        float causticsPattern(vec2 p, float time) {

            vec2 movement = vec2(
                time * 0.045,
                -time * 0.025
            );

            p += movement;

            float distortion = fbm(p * 0.75 + time * 0.025);

            vec2 warped = p;

            warped += vec2(
                sin(p.y * 2.4 + time * 0.16),
                cos(p.x * 2.1 - time * 0.12)
            ) * 0.55;

            warped += (distortion - 0.5) * 1.4;


            /* 서로 다른 방향의 물결 */

            float waveOne =
                sin(warped.x * 4.2 + sin(warped.y * 2.3 + time * 0.18));

            float waveTwo =
                sin(warped.y * 4.8 + sin(warped.x * 2.7 - time * 0.14));

            float waveThree =
                sin(
                    (warped.x + warped.y) * 3.5
                    + sin(warped.x * 2.0 + time * 0.12)
                );


            /* 서로 겹치는 굴절 패턴 */

            float combined =
                waveOne * waveTwo * waveThree;


            float secondary =
                sin(warped.x * 7.0 + warped.y * 2.0)
                *
                sin(warped.y * 6.0 - warped.x * 1.8);


            float pattern =
                combined * 0.72
                + secondary * 0.28;


            /* 밝은 연결선 생성 */

            float lightLines =
                smoothstep(
                    0.46,
                    0.86,
                    abs(pattern)
                );


            /* 불규칙한 빛의 밝기 */

            float detail =
                fbm(warped * 1.8 + time * 0.018);


            lightLines *=
                smoothstep(0.34, 0.8, detail);


            return lightLines;

        }


        void main() {

            vec2 uv =
                gl_FragCoord.xy / u_resolution.xy;


            /* 화면 비율 보정 */

            float aspect =
                u_resolution.x / u_resolution.y;

            vec2 p = uv - 0.5;

            p.x *= aspect;


            /* 패턴 크기 */

            vec2 causticsUV =
                p * 2.25;


            float time =
                u_time;


            float pattern =
                causticsPattern(
                    causticsUV,
                    time
                );


            /* 위쪽에서 들어오는 부드러운 빛 */

            float topLight =
                smoothstep(
                    1.0,
                    -0.25,
                    uv.y
                );


            float upperGlow =
                exp(
                    -length(
                        (uv - vec2(0.5, 0.02))
                        *
                        vec2(1.5, 3.5)
                    )
                );


            /* 심해 배경 */

            vec3 deepColor =
                vec3(
                    0.002,
                    0.012,
                    0.028
                );

            vec3 blueColor =
                vec3(
                    0.018,
                    0.11,
                    0.20
                );


            vec3 waterColor =
                mix(
                    deepColor,
                    blueColor,
                    topLight * 0.65
                );


            /* Caustics 빛 */

            vec3 lightColor =
                vec3(
                    0.25,
                    0.70,
                    1.0
                );


            float brightness =
                pattern * 0.92
                + upperGlow * 0.12;


            waterColor +=
                lightColor * brightness * 0.72;


            /* 위쪽에 밝은 청색 광원 */

            waterColor +=
                vec3(
                    0.10,
                    0.30,
                    0.50
                )
                *
                upperGlow
                *
                0.28;


            /* 화면 가장자리 어둡게 */

            float vignette =
                1.0 -
                smoothstep(
                    0.35,
                    0.85,
                    length(p * 0.62)
                );


            waterColor *=
                mix(0.62, 1.0, vignette);


            gl_FragColor =
                vec4(
                    waterColor,
                    1.0
                );

        }

    `;


    /* =================================================
       SHADER COMPILE
    ================================================= */

    function createShader(type, source) {

        const shader =
            gl.createShader(type);

        gl.shaderSource(
            shader,
            source
        );

        gl.compileShader(shader);


        if (
            !gl.getShaderParameter(
                shader,
                gl.COMPILE_STATUS
            )
        ) {

            console.error(
                gl.getShaderInfoLog(shader)
            );

            gl.deleteShader(shader);

            return null;

        }


        return shader;

    }


    const vertexShader =
        createShader(
            gl.VERTEX_SHADER,
            vertexShaderSource
        );


    const fragmentShader =
        createShader(
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );


    if (!vertexShader || !fragmentShader) {

        return;

    }


    const program =
        gl.createProgram();


    gl.attachShader(
        program,
        vertexShader
    );

    gl.attachShader(
        program,
        fragmentShader
    );

    gl.linkProgram(program);


    if (
        !gl.getProgramParameter(
            program,
            gl.LINK_STATUS
        )
    ) {

        console.error(
            gl.getProgramInfoLog(program)
        );

        return;

    }


    gl.useProgram(program);


    /* =================================================
       FULL SCREEN QUAD
    ================================================= */

    const positionBuffer =
        gl.createBuffer();

    gl.bindBuffer(
        gl.ARRAY_BUFFER,
        positionBuffer
    );


    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([

            -1, -1,
             1, -1,
            -1,  1,

            -1,  1,
             1, -1,
             1,  1

        ]),
        gl.STATIC_DRAW
    );


    const positionLocation =
        gl.getAttribLocation(
            program,
            "a_position"
        );


    gl.enableVertexAttribArray(
        positionLocation
    );


    gl.vertexAttribPointer(
        positionLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );


    /* =================================================
       UNIFORMS
    ================================================= */

    const resolutionLocation =
        gl.getUniformLocation(
            program,
            "u_resolution"
        );


    const timeLocation =
        gl.getUniformLocation(
            program,
            "u_time"
        );


    /* =================================================
       RESIZE
    ================================================= */

    function resizeCanvas() {

        const pixelRatio =
            Math.min(
                window.devicePixelRatio || 1,
                1.75
            );


        const width =
            Math.floor(
                canvas.clientWidth * pixelRatio
            );


        const height =
            Math.floor(
                canvas.clientHeight * pixelRatio
            );


        if (
            canvas.width !== width ||
            canvas.height !== height
        ) {

            canvas.width = width;
            canvas.height = height;

        }


        gl.viewport(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    resizeCanvas();


    /* =================================================
       ANIMATION
    ================================================= */

    let startTime =
        performance.now();


    let animationFrame;


    function render(now) {

        resizeCanvas();


        const elapsed =
            (now - startTime) / 1000;


        gl.useProgram(program);


        gl.uniform2f(
            resolutionLocation,
            canvas.width,
            canvas.height
        );


        gl.uniform1f(
            timeLocation,
            elapsed
        );


        gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
        );


        animationFrame =
            requestAnimationFrame(render);

    }


    animationFrame =
        requestAnimationFrame(render);


    /* 페이지가 숨겨졌을 때 애니메이션 중단 */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {

                cancelAnimationFrame(
                    animationFrame
                );

            } else {

                startTime =
                    performance.now();

                animationFrame =
                    requestAnimationFrame(render);

            }

        }
    );


})();
