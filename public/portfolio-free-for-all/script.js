gsap.registerPlugin(
  SplitText,
  DrawSVGPlugin,
  GSDevTools,
  MotionPathPlugin,
  MotionPathHelper
);

gsap.set("#plane", { opacity: 0 });
gsap.set(".container", { opacity: 1 });
gsap.set(".confetti img", { scale: "random(0.1, 1)", opacity: 0 });
//Create a custom bounce ease:
CustomBounce.create("myBounce", { strength: 0.6, squash: 3 });
CustomWiggle.create("myWiggle", { wiggles: 6 });
let free = SplitText.create("#free", { type: "words, chars", mask: "words" });
let all = SplitText.create("#all", { type: "words, chars", mask: "words" });

let tl = gsap.timeline({delay: 1});
tl.addLabel("explode", 1)
tl.addLabel("flight", 1.3)

tl.from([free.chars, all.chars], {
  duration: 0.7,
  y: "random([-500, 500])",
  rotation: "random([-30, 30])",
  ease: "expo.out",
  stagger: {
    from: "random",
    amount: 0.3
  }
})
  .from("#main", { duration: 2, opacity: 0, y: -2000, ease: "myBounce" }, 0.5)
  .to(
    "#main",
    {
      duration: 2,
      scaleX: 1.4,
      scaleY: 0.6,
      ease: "myBounce-squash",
      transformOrigin: "center bottom"
    },
    0.5
  )
  .to(
    "#free",
    {
      duration: 2,
      xPercent: -20,
      ease: "elastic.out(1,0.3)"
    },
    "explode"
  )
  .to(
    "#all",
    {
      duration: 2,
      xPercent: 50,
      ease: "elastic.out(1,0.3)"
    },
    "explode"
  )
  .set("#plane", { opacity: 1 }, "flight")
  .from("#path", { duration: 0.5, drawSVG: 0 }, "explode")
  .from("#path_2", { duration: 0.8, drawSVG: 0}, "flight")
.from(
    "#plane",
    {
      duration: 1,
      ease: "sine.inOut",
      scale: 0.2,
      transformOrigin: "center center",
      motionPath: {
        path:"M973.861,226.794 C1015.92,240.459 1041.39,136.212 1005.93,135.899 977.513,135.649 990.28,214.204 1046.61,229.17 1089.82,240.65 1168.88,147.886 1092.89,84.6262 1029.602,31.94758 1030.243,386.698 1468.054,74.047 1565.737,4.289 1789.737,-299.704 2163.504,-225.675 ",
        align: "#path_2",
        alignOrigin: [0.5, 0.5],
        autoRotate: 180,
        start: 1,
        end: 0
      }
    }, "flight"
  )
  .to(
    ".innerplane",
    {
      duration: 0.2,
      opacity: 0,
    },
    2
  )
  .set(".confetti img", { opacity: 1 }, "explode+=.2")
  .to(
    ".confetti img",
    {
      duration: 2,
      rotation: "random(-360, 360)",
      scale: "random(0.5, 1)",
      physics2D: {
        velocity: "random(800, 2000)",
        angle: "random(150, 360)",
        gravity: 3000,
        acceleration: 100
      }
    },
    "explode+=.2"
  )
  .from(
    "#wiggle",
    {
      duration: 0.7,
      transformOrigin: "center center",
      scale: 0,
      rotation: 60,
      ease: "back.out(4)"
    },
    "explode+=.4"
  )
  .from(
    "#bang, #spin",
    {
      duration: 0.7,
      transformOrigin: "center center",
      scale: 0,
      rotation: -60,
      ease: "back.out(4)"
    },
    "explode+=.1"
  )
  .from(
    ".sprinkle",
    {
      scale: 0,
      rotation: 360,
      transformOrigin: "center center",
      ease: "back.out"
    },
    "explode"
  )
 .from(
    "#ffd",
    {
      xPercent: -800,
      opacity: 0,
      ease: "back.out"
    },
    "explode"
  )
 .from(
    "#hand",
    {
      duration: 0.4,
      rotation: "+=30",
      ease: "myWiggle",
      transformOrigin: "center center"
    }, 1.5
  )
 .from(
    "#hand",
    {
      opacity: 0,
      duration: 0.2,
      yPercent: 100
    }, 1.3
  )

const heroRoot = document.querySelector(".portfolio-free-for-all");

if (heroRoot) {
  heroRoot.addEventListener("click", () => {
    tl.play(0);
  });
}