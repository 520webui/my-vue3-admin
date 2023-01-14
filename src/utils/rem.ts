// @ts-ignore
let resize = function () {
    let designSize = 1980; // 默认设计图尺寸 11520*2160
    let html = document.documentElement;
    let wW = 1080; // 窗口宽度
    (wW * 1000) / designSize;
    html.style.fontSize = 100 + 'px';
};
resize();// 初始化
window.addEventListener('resize', resize, false); // 绑定到窗口事件中
