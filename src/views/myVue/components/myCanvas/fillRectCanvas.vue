<template>
    <div class="fillRectCanvas-wrap">
        <canvas id="canvas" width="150" height="150"/>
    </div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch,defineProps } from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'
    export default defineComponent({
      setup(props, contex) {
        const dataMap = reactive({})
        const drawImgLine = () => {
          let canvas = document.getElementById("canvas");
            let ctx = canvas.getContext("2d");

            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect(10, 10, 55, 50);

            ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
            ctx.fillRect(30, 30, 55, 50);
        }
        onMounted(()=>{
          drawImgLine()
        })
        return{
          ...toRefs(dataMap),
          drawImgLine
        }
      }
    })

</script>

<style lang="less" scoped>
    .fillRectCanvas-wrap{
      width: 100%;
      height: 100%;
    }
</style>
