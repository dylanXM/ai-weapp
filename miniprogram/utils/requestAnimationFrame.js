export default function requestAnimationFrame(cb) {
  return setTimeout(function () {
      cb();
  }, 1000 / 30);
}
