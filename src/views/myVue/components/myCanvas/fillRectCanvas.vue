<template>
    <div class="fillRectCanvas-wrap">
        <canvas id="canvas" width="150" height="150"/>
    </div>
</template>

<script>
    export default {
        name: "fillRectCanvas",
        mounted () {
            this.drawImgLine();
        },
        methods: {
            /* 图片的处理压缩 画布*/
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
    .fillRectCanvas-wrap{
      width: 100%;
      height: 100%;
    }
</style>
