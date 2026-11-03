// يحوّل الصور الكبيرة لـ WebP — الصور المتحركة تفضل متحركة
import sharp from "sharp";
import { statSync } from "fs";
import path from "path";

const FILES = [
  "src/assets/image/guest_login.png",
  "src/assets/image/guest_login_en.png",
  "src/assets/image/OTP.png",
  "src/assets/image/object3.png",
  "src/assets/BackGround.png",
  "src/assets/SpinImage/Spin-the-Wheel.png",
  "src/assets/SpinImage/Spin-the-Wheel_2.png",
  // animated → animated webp
  "src/assets/image/delivery-man.gif",
  "src/assets/image/processing_animation.gif",
  "src/assets/image/Zain El Sham - Transparent.gif",
];

let totalBefore = 0;
let totalAfter = 0;

for (const file of FILES) {
  const out = file.replace(/\.(png|gif)$/i, ".webp");
  const before = statSync(file).size;
  await sharp(file, { animated: true })
    .webp({ quality: 85, effort: 5 })
    .toFile(out);
  const after = statSync(out).size;
  totalBefore += before;
  totalAfter += after;
  console.log(
    `${path.basename(file).padEnd(40)} ${(before / 1024) | 0}KB → ${(after / 1024) | 0}KB`
  );
}

console.log("—".repeat(60));
console.log(
  `TOTAL: ${(totalBefore / 1048576).toFixed(1)}MB → ${(totalAfter / 1048576).toFixed(1)}MB (saved ${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%)`
);
