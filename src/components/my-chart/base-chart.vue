<template>
  <div :id="chartId" class="chartdiv"></div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'
    import * as echarts from 'echarts'

    export default defineComponent({
      components: {},
      name:'base-chart',
      props:{
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
      },
      setup(props, contex) {
        const store = useStore();
        const router = useRouter();
        const dataMap = reactive({
          mychart: null,
        })
        const resize = () => {
          dataMap.mychart.resize();
        }
        onMounted(()=>{
          if (!dataMap.mychart) {
            dataMap.mychart = echarts.init(document.getElementById(props.chartId) as HTMLElement);
          }
          if (!props.option) return;
          dataMap.mychart.setOption(props.option);
        })
        watch(() => props.option, (newValue, oldValue) => {
          if (!dataMap.mychart) {
            dataMap.mychart = echarts.init(document.getElementById(props.chartId) as HTMLElement);
          }
          if (!props.option) return;
          dataMap.mychart.clear();
          dataMap.mychart.setOption(props.option);
          dataMap.mychart.off('click');// 解决Echart重复点击的问题
          dataMap.mychart.on('click', (params: any) => {
            contex.emit("theChartClick", params)
          })
          if (props.autoPlay) {
            window.tools.loopShowTooltip(dataMap.mychart, props.option, {loopSeries: true});
          }
        }, {deep: true})

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
