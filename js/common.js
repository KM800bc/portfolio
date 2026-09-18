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

function rotate(target, direction) {
  gsap.to(target, randomTime2(), {
    rotation: randomAngle(direction),
    // delay: randomDelay(),
    ease: Sine.easeInOut,
    onComplete: rotate,
    onCompleteParams: [target, direction * -1],
  });
}

function moveX(target, direction) {
  gsap.to(target, randomTime(), {
    x: randomX(direction),
    ease: Sine.easeInOut,
    onComplete: moveX,
    onCompleteParams: [target, direction * -1],
  });
}

function moveY(target, direction) {
  gsap.to(target, randomTime(), {
    y: randomY(direction),
    ease: Sine.easeInOut,
    onComplete: moveY,
    onCompleteParams: [target, direction * -1],
  });
}

function random(min, max) {
  const delta = max - min;
  return (direction = 1) => (min + delta * Math.random()) * direction;
}

function scrollIntoStart(id) {
  const x = document.getElementById(id);
  x.scrollIntoView({ behavior: "smooth", block: "start" });
}
