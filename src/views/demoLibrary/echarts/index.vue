<template>
  <div class="container-wrap">
<!--<div class="itme-box">{{$t('menu.myVue')}}</div>
    <div class="itme-box">{{$t('table.tOperation')}}</div>
    <div class="itme-box itme-box-relative">
      {{$t('mpanel.submit')}}
    </div>-->
    <tab-btn
        :list="btnList"
        :targetTabIndex="targetBtnIndex"
        class="the-nav-btn"
        @clickTab="clickBtn"
    />
    <!--地图-->
    <div v-show="targetBtnIndex === 0" class="theEcharts-left-content">
        {{'地图'}}
    </div>
    <!--地铁-->
    <div v-show="targetBtnIndex === 1" class="theEcharts-right-content">
        {{'地铁'}}
    </div>
    <!--柱状-->
    <div v-show="targetBtnIndex === 2" class="theEcharts-box theEcharts-box-plus">
        {{'柱状'}}
    </div>
    <!--饼状-->
    <div v-show="targetBtnIndex === 3" class="theEcharts-box theEcharts-pieBox">
    <!--自己写的饼状样式-->
      <sector-div-pie
          sectorDivId="leftDivRightPie"
          :sectorDivListAll="arrList"/>
      <!--自己写的饼状样式-->
      <native-pie/>
    </div>

    <!--自动柱状-->
    <div v-show="targetBtnIndex === 4" class="theEcharts-box">
        {{'自动柱状'}}
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
import BaseChart from "@/components/my-chart/base-chart.vue";
import tabBtn from "./compoments/theChart/tabBtn/index.vue";
import SectorDivPie from "./compoments/myChart/sectorDivPie/index.vue";
import NativePie from "@/views/demoLibrary/echarts/compoments/myChart/sectorDivPie/nativePie.vue";
export default defineComponent({
  components: {NativePie, SectorDivPie, BaseChart , tabBtn},
  setup() {
    const store = useStore();
    const router = useRouter();
    const dataMap = reactive({
      btnList:[
        { labelKey: '地图' },
        { labelKey: '地铁' },
        { labelKey: '柱状、自动轮播表格、自动滚动导航' },
        { labelKey: '饼状' },
        { labelKey: '自动柱状' },
      ],
      targetBtnIndex:0,
      arrList: {
        FILE_DELAY_TOTAL: "118",
        FILE_RATIO: "0.51",
        INSERT_TIME: "2021-11-29 02:24:01.0",
        INTERFACE_DELAY_TOTAL: "58",
        INTERFACE_RATIO: "0.19",
        MD_ID: "1",
        ORG_SYS: "zsj",
        TABLE_DELAY_TOTAL: "147",
        TABLE_RATIO: "0.3",
      },
    })
    const clickBtn = (tab: { targetIndex: number; }) => {
      dataMap.targetBtnIndex = tab.targetIndex;
    }

    const initChart = () => {

    }
    const setOptions = (data: number[], xData: string[]) => {
      return {

      }
    }
    onMounted(()=>{
      initChart();
    })
    return{
      ...toRefs(dataMap),
      clickBtn,
      initChart,
      setOptions,
    }
  }
})
</script>

<style lang="less" scoped>
.container-wrap{
  width: 100%;
  height: 100%;
  background-color: rgba(2, 15, 43, 0.7);
  .the-nav-btn{
    z-index: 2112;
    position: absolute;
    top: 1.2rem;
    left: 2rem;
    /deep/ .title-tab-small-button{
      width: 1.88rem;
      height: 0.4rem;
      margin-left: 0.15rem;
    }
  }
  .theEcharts-left-content {
    pointer-events: auto;
    width: 15rem;
    height: 9.4rem;
    z-index: 2;
    background: inherit;
    background-color: rgba(2, 15, 43, 0.7);
    .TitleTab{
      z-index: 2112;
      position: absolute;
      top: 2.4rem;
      left: 2.88rem;
      /deep/ .title-tab-small-button{
        width: 1rem;
        height: 0.4rem;
        margin-left: 0.15rem;
      }
    }
  }
  .theEcharts-right-content {
    pointer-events: auto;
    width: 15rem;
    height: 9.4rem;
    z-index: 2;
    background: inherit;
    background-color: rgba(2, 15, 43, 0.7);
    position: relative;
    .the-number-box{
      width: 100%;
      height: 0.4rem;
      position: absolute;
      top: 0.8rem;
      .the-left{
        width: 60%;
        float: left;
        flex: 1;
        display: flex;
      }
      .the-right{
        width: 40%;
        float: right;
        height: 100%;
        display: flex;
      }
    }
    .wrap-subway {
      width: 15rem;
      height: 9.4rem;
    }
  }
  .theEcharts-box{
    pointer-events: auto;
    width: 15rem;
    height: 9.4rem;
    //z-index: 2;
    background: inherit;
    background-color: rgba(2, 15, 43, 0.7);
    position: relative;
  }
  .theEcharts-box-plus{
    height: 19.2rem;
  }
  .the-scroll-chart{
    width: 100%;
    height: 6rem;
    position: absolute;
    top: 8.5rem;
  }
  .theEcharts-pieBox{
    width: 100%;
    height: auto;
  }
}
</style>
