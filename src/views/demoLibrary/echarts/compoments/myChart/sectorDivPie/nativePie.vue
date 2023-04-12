<template>
  <!-- 原生右侧换行饼状图 -->
  <div class="pie-chart">
      <div class="the-chart" id="theChart">
          <base-chart
              :option="pieOpt"
              chart-id="theChart"
              :auto-play="true"/>
      </div>
  </div>
</template>

<script lang="ts" setup>
    import {reactive, defineComponent, onMounted, onBeforeUnmount,ref, toRefs, computed, watch, defineProps} from 'vue';
    import * as echarts from 'echarts';
    import BaseChart from "@/components/my-chart/base-chart.vue";
    const dataMap = reactive({
             pieOpt:null,
             chartData: [
               {
                  name: "闭环",
                  num: 30,
                  rate: "30.00%",
                  value: 30,
              },
             {
                  name: "计划制定",
                  num: 15,
                  rate: "15.00%",
                  value: 15,
             },
             {
               name: "任务执行",
                  num: 25,
                  rate: "25.00%",
                  value: 25,
             },
             {
               name: "任务审核",
                num: 10,
                rate: "10.00%",
                value: 10,
             },
             {
               name: "调整审核",
                  num: 15,
                  rate: "15.00%",
                  value: 15,
             },
             {
               name: "驳回数量",
                num: 5,
                rate: "5.00%",
                value: 5,
             }
          ],
             colors:[
                '#1861F2',
                '#008D71',
                '#00C197',
                '#9AD96F',
                '#3189F4',
                '#73CBEE'
              ]
    })
    onMounted(()=>{
        initChart();
    })
    const initChart = () => {
      let data = dataMap.chartData
      let left = '-50%';
      let radius = ['45%', '50%'];
      let legendRight1 = '37%';
      let legendRight2 = '25%';
      let option = {
        tooltip: {
          trigger: 'item',
          show: false,
        },
        legend: [
          {
            top:400,
            orient: 'vertical',
            right: legendRight1,
            itemWidth: 60,
            icon: 'circle',
            textStyle: {
              color: '#fff'
            },
            data:['闭环','计划制定','任务执行'],
            formatter: (label: string) => {
              let row = data.find(item => item.name === label);
              return `${label}  ${row.num} ${'条'}` // 条
            },
          },
          {
            top: 400,
            orient: 'vertical',
            right: legendRight2,
            itemWidth: 60,
            icon: 'circle',
            textStyle: {
              color: '#fff'
            },
            data:['任务审核','调整审核','驳回数量'],
            formatter: (label: string) => {
              let row = data.find(item => item.name === label);
              return `${label}  ${row.num} ${'条'}` // 条
            },
          },
        ],
        series: [
          {
            top: -30,
            left,
            name: '任务闭环率', // '任务闭环率',
            type: 'pie',
            radius,
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
              formatter: function (a: { data: { name: any; rate: any; }; }) {
                return a.data.name + a.data.rate;
              }
            },
            itemStyle: {
              normal: {
                borderRadius: 50,
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
                formatter: '{b}\n\n{d}%',
              },
            },
            labelLine: {
              show: false
            },
            data,
          }
        ],
        color: dataMap.colors
      };
      dataMap.pieOpt = echarts.init(document.getElementById('theChart') as HTMLElement);
      dataMap.pieOpt.setOption(option);
    }
</script>

<style lang="less" scoped>
.pie-chart {
    width: 100%;
    height: 100%;
    .the-chart{
      width: 15rem;
      height: 9.2rem;
      background:  rgba(2, 15, 43, 0.7);;

    }
}
</style>
