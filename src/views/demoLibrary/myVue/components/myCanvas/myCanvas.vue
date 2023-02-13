<template>
    <div class="myCanvas-wrap">
        <h3>图片的压缩处理</h3>
        <canvas ref="canvasImg" id="canvasImg" class="canvasImg"/>
    </div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch,defineProps } from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'
    import cavasImg from "@/views/demoLibrary/myVue/images/cavas-img.png"
    export default defineComponent({
      setup(props, contex) {
        const dataMap = reactive({})
        const canvasImg = ref(null)
        const drawImg = () => {
          // 创建画布
          const canvas = document.getElementById('canvasImg');
          const context = canvas.getContext('2d');
          // 设置宽高度为等同于要压缩图片的尺寸
          canvas.width = 400;
          canvas.height = 300;
          context.clearRect(0, 0, 400, 30);
          let img = new Image();
          img.src = cavasImg;

          // 将img绘制到画布上
          img.onload =  ()=> {
            context.drawImage(img, 0, 0, 400, 300);
          };
        }
        const drawImgLine = () => {
          let canvas = document.getElementById("canvas");
          if (canvas.getContext) {
            let ctx = canvas.getContext("2d");

            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect(10, 10, 55, 50);

            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(30, 30, 55, 50);
          }
        }
        onMounted(()=>{
          drawImg()
          // drawImgLine()
        })
        return{
          ...toRefs(dataMap),
          drawImg,
          drawImgLine
        }
      }
    })
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
