import { ref, onMounted } from "vue";

/**
 * 绘制图形验证码
 * @param width - 图形宽度
 * @param height - 图形高度
 */
export const useImageVerify = (width = 160, height = 40) => {
  const domRef = ref<HTMLCanvasElement>();
  const imgCode = ref("");

  function setImgCode(code: string) {
    imgCode.value = code;
  }

  function getImgCode() {
    if (!domRef.value) return;
    imgCode.value = draw(domRef.value, width, height);
  }

  onMounted(() => {
    getImgCode();
  });

  return {
    domRef,
    imgCode,
    setImgCode,
    getImgCode
  };
};

function randomNum(min: number, max: number) {
  const num = Math.floor(Math.random() * (max - min) + min);
  return num;
}

function randomColor(min: number, max: number) {
  const r = randomNum(min, max);
  const g = randomNum(min, max);
  const b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

function draw(dom: HTMLCanvasElement, width: number, height: number) {
  let imgCode = "";

  const NUMBER_STRING = "0123456789";

  const ctx = dom.getContext("2d");
  if (!ctx) return imgCode;

  // 使用浅色背景，提升清晰度
  ctx.fillStyle = randomColor(230, 245);
  ctx.fillRect(0, 0, width, height);

  // 绘制6位验证码字符
  for (let i = 0; i < 6; i += 1) {
    const text = NUMBER_STRING[randomNum(0, NUMBER_STRING.length)];
    imgCode += text;
    const fontSize = randomNum(22, 34);
    const deg = randomNum(-15, 15);
    ctx.font = `bold ${fontSize}px Simhei`;
    ctx.textBaseline = "top";
    ctx.fillStyle = randomColor(40, 120);
    ctx.save();
    ctx.translate(22 * i + 12, 12);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(text, -10 + 3, -10);
    ctx.restore();
  }

  // 仅保留少量干扰点，去掉干扰线，让验证码更清晰
  for (let i = 0; i < 20; i += 1) {
    ctx.beginPath();
    ctx.arc(randomNum(0, width), randomNum(0, height), 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = randomColor(160, 210);
    ctx.fill();
  }
  return imgCode;
}
