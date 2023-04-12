<template>
  <!-- Echarts属性和div组成的饼图 -->
  <div class="pie-chart">
    <div
        :id="sectorDivId"
        ref="chart"
        class="the-chart"
        @mouseenter="mouseEnterChart"
        @mouseleave="mouseLeaveChart"
    ></div>
    <div class="chartCon">
      <div class="chart-legend">
        <p>汇聚方式占比</p>
        <div class="chart-legend-content">
          <div
              v-for="(item, index) in dataMap.sectorDivList"
              :key="index"
              class="chart-legend__item"
              :class="{ unselected: item.unselected }"
              @mouseenter="mouseEnterHandle(index)"
              @mouseleave="mouseLeaveHandle()"
              @click="legendCickHandle(item.name, item)"
          >
                        <span
                            class="icon"
                            :style="`background-color: ${dataMap.colors[index]}`"
                        ></span>
            <div class="title">{{ item.name }}</div>
            <div class="value" :style="`color: ${dataMap.colors[index]}`">
              {{ item.value | numberFormat }}<span>%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chartRight">
        <p>延迟数量统计</p>
        <div class="chart-legend-content">
          <div
              v-for="(item, index) in dataMap.sectorDivList2"
              :key="index"
              class="chartRight__item"
              :class="{ unselected: item.unselected }"
              @mouseenter="mouseEnterHandle(index)"
              @mouseleave="mouseLeaveHandle()"
          >
            <div class="title">{{ item.name }}</div>
            <div class="value">
              <span>{{ item.num | numberFormat }}</span><span>&nbsp;个</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import {reactive, defineComponent, onMounted, onBeforeUnmount,ref, toRefs, computed, watch, defineProps} from 'vue';
    import * as echarts from 'echarts';

    const props = defineProps({
        sectorDivId: {
          type: String,
          default: '',
        },
        sectorDivListAll: {
          type: Object,
          default: () => {
            return {}
          },
        },
    })
    onMounted(()=>{
      initChart();
    })
    const dataMap = reactive({
        chartData: [],
        colors: ["#4F9EFD", "#00EA9C", "#FFDD77"],
        currentDivIndex: -1, // 当前循环饼图的index值
        emphasisIndex: 0,
        prevIndex: 0,
        showTooltip: true,
        sectorDivList: [
          { value: "10", name: "接口占比" },
          { value: "20", name: "库表占比" },
          { value: "30", name: "文件占比" },
        ],
        sectorDivList2: [
          { num: "40", name: "延迟数量" },
          { num: "50", name: "延迟数量" },
          { num: "60", name: "延迟数量" },
        ],
        myChart: null,
        timer: null,
    })
    const  numberFormatPlus = computed((val)=>{
      val = val ? val.toString() : val;
      let n = val.split(".");
      val = n[0];
      if (val && val.length >= 3) {
        let number = [];
        let len = val.length;
        while (len > 0) {
          let cur = val.slice(len - 3 > 0 ? len - 3 : 0, len);
          number.unshift(cur);
          len -= 3;
        }
        val = number.join(",");
        return n[1] ? val + "." + n[1] : val;
      }
      return val;
    })
    const initChart = () => {
      const seriesData = dataMap.sectorDivList;
      const colors = dataMap.colors;
      let option = {
        title: [],
        color: colors,
        tooltip: {
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.7)", // 提示框背景颜色
          // 提示框内容样式
          textStyle: {
            fontWeight: "bolder",
            fontSize: 20,
            fontFamily: "SourceHanSansCN",
          },
          position: "right", // 提示框提示方向，默认中间
          formatter: function (params: { marker: string; color: string; data: { [x: string]: string; }; percent: string; }) {
            return (
                params.marker +
                // 主要内容和内容颜色
                '<span style="color:' +
                params.color +
                '">' +
                '<span style="color:' +
                "#C9DCFF" +
                '">' +
                params.data["name"] +
                "</span>" +
                // "\n" +
                "<span style='display:inline-block;min-width:20px;'></span>" +
                params.percent +
                // "(" +
                // params.percent.toFixed(2) +
                "%" +
                // ")" +
                "</span>"
            );
          },
        },
        legend: {
          show: false,
        },
        series: [
          {
            name: "产业支柱详情",
            type: "pie",
            radius: ["30%", "70%"],
            center: ["50%", "35%"],
            avoidLabelOverlap: false,
            itemStyle: {
              // borderRadius: 10,
              borderColor: "rgba(0,0,0,0)",
              borderWidth: 5,
            },
            label: {
              show: false,
              position: "center",
              color: "#fff",
            },
            labelLine: {
              show: false,
            },
            data: seriesData,
          },
        ],
      };
      dataMap.myChart = echarts.init(document.getElementById(props.sectorDivId) as HTMLElement);
      dataMap.myChart.setOption(option);
      echartsInterval(dataMap.myChart);
    }
   const numberFormat = (val: string) => {
        val = val ? val.toString() : val;
        let n = val.split(".");
        val = n[0];
        if (val && val.length >= 3) {
          let number = [];
          let len = val.length;
          while (len > 0) {
            let cur = val.slice(len - 3 > 0 ? len - 3 : 0, len);
            number.unshift(cur);
            len -= 3;
          }
          val = number.join(",");
          return n[1] ? val + "." + n[1] : val;
        } else {
          return n[1] ? val + "." + n[1] : val;
        }
      }
    const mouseEnterChart = () => {
      dataMap.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: dataMap.prevIndex,
      });
      clearInterval(dataMap.timer);
    }
    const mouseLeaveChart = () => {
      echartsInterval(dataMap.myChart);
    }
    const echartsInterval = (myChart: { dispatchAction: (arg0: { type: string; seriesIndex: number; dataIndex: number; }) => void; } | null) => {
      let dataLen = dataMap.sectorDivList.length;
      dataMap.timer = setInterval(function () {
        // 取消之前高亮的图形
        myChart.dispatchAction({
          type: "downplay",
          seriesIndex: 0,
          dataIndex: dataMap.prevIndex,
        });
        // 高亮当前图形
        myChart.dispatchAction({
          type: "highlight",
          seriesIndex: 0,
          dataIndex: dataMap.emphasisIndex,
        });
        if (dataMap.showTooltip) {
          myChart.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: dataMap.emphasisIndex,
          });
        }
        // 记录上一个pie图index，轮播停止后还可以从上一次继续开始
        dataMap.prevIndex = dataMap.emphasisIndex;
        dataMap.currentDivIndex = dataMap.emphasisIndex;
        // 如果当前index是轮播图最后一个index，那么index值变为0，然后下一次重新开始
        if (dataMap.emphasisIndex == dataLen - 1) {
          dataMap.emphasisIndex = 0;
        } else {
          // 如果index不为0，那么加1
          dataMap.emphasisIndex = dataMap.emphasisIndex + 1;
        }
      }, 3000);
    }
    const hightlightEchart = (val: any) => {
      // 取消高亮
      dataMap.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: dataMap.emphasisIndex,
      });
      dataMap.emphasisIndex = val;
      // 高亮当前图形
      dataMap.myChart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: val,
      });
    }
    // Toggle图例
    const legendCickHandle = (name: any, row: any) => {
      // this.$set(row, "unselected", !row.unselected);
      reactive([row, "unselected", !row.unselected]);
      dataMap.myChart.dispatchAction({
        type: "legendToggleSelect",
        name: name,
      });
    }
    // 鼠标进入图例改变currentDivIndex
    const mouseEnterHandle = (index) => {
      dataMap.currentDivIndex = index;
      dataMap.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: dataMap.prevIndex,
      });
      hightlightEchart(index);
      if (dataMap.showTooltip) {
        dataMap.myChart.dispatchAction({
          type: "showTip",
          seriesIndex: 0,
          dataIndex: dataMap.currentDivIndex,
        });
      }
      clearInterval(dataMap.timer);
    }
    // 鼠标离开图例改变currentDivIndex
    const mouseLeaveHandle = () => {
      dataMap.myChart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
        dataIndex: dataMap.emphasisIndex,
      });
      echartsInterval(dataMap.myChart);
      dataMap.currentDivIndex = -1;
    }
    watch(()=>props.sectorDivListAll,(newval)=>{
      dataMap.sectorDivList[0].value = (newval.INTERFACE_RATIO * 100).toFixed(0);
      dataMap.sectorDivList[1].value = (newval.TABLE_RATIO * 100).toFixed(0);
      dataMap.sectorDivList[2].value = (newval.FILE_RATIO * 100).toFixed(0);
      dataMap.sectorDivList2[0].num = newval.INTERFACE_DELAY_TOTAL;
      dataMap.sectorDivList2[1].num = newval.TABLE_DELAY_TOTAL;
      dataMap.sectorDivList2[2].num = newval.FILE_DELAY_TOTAL;
      // 执行echarts图
      initChart();
      window.addEventListener("resize", function () {
        dataMap.myChart && dataMap.myChart.resize();
      });
    })
    onBeforeUnmount(()=>{
      clearInterval(dataMap.timer);
    })
</script>

<style lang="less" scoped>
.pie-chart {
    width: 100%;
    height: 100%;
    display: flex;
    .the-chart{
        width: 7rem;
        height: 10rem;
    }
    .chartCon{
        width: 60%;
        height: 100%;
        position: relative;
        .chart-legend,.chartRight {
            position: absolute;
            left: 0;
            top: 1.9rem;
            width: 1.7rem;
            height: 100%;
            p {
              font-size: 0.2rem;
              color: #fff;
            }
            .chart-legend-content {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                .chart-legend__item,.chartRight__item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        width: 2.2rem;
                        height: 0.36rem;
                        line-height: 0.36rem;
                        font-size: 0.2rem;
                        color: #c9dcff;
                        cursor: pointer;
                        user-select: none;
                        padding: 0 0.25rem 0 0.13rem;
                        &.unselected {
                            .icon {
                                background-color: #666 !important;
                            }
                        }
                        .icon {
                            display: inline-block;
                            width: 8px;
                            height: 8px;
                            border-radius: 50%;
                            margin-right: 10px;
                        }
                        .title {
                            width: 0.8rem;
                        }
                        .value {
                            width: 0.8rem;
                            text-align: right;
                            margin: 0.05rem 0 0 0.01rem;
                            font-family: "BoldCondensed";
                            font-size: 0.2rem;
                        }
                    }
                .chart-legend__item:nth-child(1) {
                        background: rgba(79, 158, 253, 0.1);
                    }
                 .chart-legend__item:nth-child(2) {
                        background: rgba(0, 234, 156, 0.1);
                        margin: 0.6rem 0;
                    }
                 .chart-legend__item:nth-child(3) {
                        background: rgba(255, 221, 119, 0.1);
                    }
                 // 延迟数量统计
                 .chartRight__item {
                         width: 2.3rem;
                         padding: 0 0.3rem 0 0.2rem;
                        .value {
                            display: flex;
                            span:nth-of-type(1){
                              color: #fc5a5a;
                            }
                            span {
                              color: #c9dcff;
                              outline: none;
                            }
                        }
                    }
                 .chartRight__item:nth-child(1) {
                      background: rgba(79, 158, 253, 0.1);
                    }
                 .chartRight__item:nth-child(2) {
                      background: rgba(0, 234, 156, 0.1);
                      margin: 0.6rem 0;
                    }
                 .chartRight__item:nth-child(3) {
                      background: rgba(255, 221, 119, 0.1);
                    }
            }
        }
        .chartRight {
            position: absolute;
            left: 50%;
            top: 1.9rem;
            width: 3rem;
            height: 100%;
            margin-left: 0.1rem;
        }
    }
}
</style>
