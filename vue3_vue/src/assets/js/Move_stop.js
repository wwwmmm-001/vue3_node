// 禁止页面滚动
export function stopMove() {
    let m = function (e) { e.preventDefault(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener("touchmove", m, { passive: false });//禁止页面滑动
}
//开启页面滚动
export function Move() {
    let m = function (e) { e.preventDefault(); };
    document.body.style.overflow = '';//出现滚动条
    document.removeEventListener("touchmove", m, { passive: true });
}