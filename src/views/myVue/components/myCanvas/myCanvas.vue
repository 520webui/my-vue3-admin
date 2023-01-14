<template>
    <div class="myCanvas-wrap">
        <h3>图片的压缩处理</h3>
        <canvas id="canvasImg" class="canvasImg"/>
    </div>
</template>

<script>
    export default {
        name: "myCanvas",
        data () {
            return {}
        },
        mounted () {
            this.drawImg();
            this.drawImgLine();
        },
        methods: {
            /* 图片的处理压缩 画布*/
            drawImg () {
                // 创建画布
                const canvas = document.getElementById('canvasImg');
                const context = canvas.getContext('2d');

                // 设置宽高度为等同于要压缩图片的尺寸
                canvas.width = 400;
                canvas.height = 300;
                context.clearRect(0, 0, 400, 30);
                let img = new Image();
                img.src = require("../../images/cavas-img.png");

                // 将img绘制到画布上
                img.onload = function () {
                    context.drawImage(img, 0, 0, 400, 300);
                };
            },
            drawImgLine () {
                let canvas = document.getElementById("canvas");
                if (canvas.getContext) {
                    let ctx = canvas.getContext("2d");

                    ctx.fillStyle = "rgb(200,0,0)";
                    ctx.fillRect(10, 10, 55, 50);

                    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                    ctx.fillRect(30, 30, 55, 50);
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    .myCanvas-wrap{
        width: 100%;
        height: 100%;
      h3{
        line-height: 0.2rem;
      }
      .canvasImg{
        width: 100%;
        height: 2.6rem;
      }
    }
</style>
