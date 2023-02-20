<template>
  <div :id="chartId" class="chartdiv"></div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'

    export default defineComponent({
      components: {},
      setup() {
        const props = defineProps({
          option: {
            // 接收整个option配置，因为设置项太多，暂不考虑默认给予配置
            type: Object,
            default: function () {}
          },
          chartId: {
            type: String,
            default: () => { return '' }
          },
          autoPlay: {
            type: Boolean,
            default: false
          }
        })
        const store = useStore();
        const router = useRouter();
        const dataMap = reactive({
          mychart: null,
        })
        const resize = () => {
          // dataMap.mychart.resize();
        }
        onMounted(()=>{})
        return{
          ...toRefs(dataMap),
          resize
        }
      }
    })
</script>

<style lang="less" scoped>
    .base-chart-wrap{

    }
</style>
