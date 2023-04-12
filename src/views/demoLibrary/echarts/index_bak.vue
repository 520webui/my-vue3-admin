<template>
  <div class="container-wrap">
    <div style="width: 1200px; height: 600px;" id="population_num_echart">
        <base-chart :option="populationNumOpt"
                    chart-id="population_num_echart"
                    :auto-play="true"/>
    </div>
    <div class="itme-box">{{$t('menu.myVue')}}</div>
    <div class="itme-box">{{$t('table.tOperation')}}</div>
    <div class="itme-box itme-box-relative">
      {{$t('mpanel.submit')}}
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
import BaseChart from "@/components/my-chart/base-chart.vue";
export default defineComponent({
  components: {BaseChart},
  setup() {
    const store = useStore();
    const router = useRouter();
    const dataMap = reactive({
      populationNumOpt: null,
    })
    const initChart = () => {
      const dataNameArr = [5, 20, 36, 10, 10, 20]
      const xDataNameArr =['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'];
      dataMap.populationNumOpt = setOptions(dataNameArr, xDataNameArr);
    }
    const setOptions = (data: number[], xData: string[]) => {
      return {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: data
          }
        ]
      }
    }
    onMounted(()=>{
      initChart();
    })
    return{
      ...toRefs(dataMap),
      initChart,
      setOptions,
    }
  }
})
</script>

<style lang="less" scoped>
.container-wrap{
  .itme-box{
    float: left;
    margin-right: 0.1rem;
    margin-top: 0.1rem;
    width: 49%;
    height: 2.9rem;
    border-radius: 10px;
    background-color: #1b67c3;
    line-height: 2.9rem;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    position: relative;
  }
}
</style>
