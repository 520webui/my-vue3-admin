<template>
    <div class="echarts-wrap">
        <title-tab
            :list="btnList"
            :targetTabIndex="targetBtnIndex"
            class="the-nav-btn"
            @clickTab="clickBtn"
        />
        <!--地图-->
        <div v-show="targetBtnIndex === 0" class="theEcharts-left-content">
            <title-tab
                :list="TabList"
                :targetTabIndex="targetTabIndex"
                class="TitleTab"
                @clickTab="clickTab"
            />
            <china-map-chart
                :domesticData="sticData"
                :effect="effect"
                :InOutType="InOutType"
                :migrateDialogMapType="theMapType"
                :migrate-id="chinaMapBtn"
            />
        </div>
        <!--地铁-->
        <div v-show="targetBtnIndex === 1" class="theEcharts-right-content">
            <div class="the-number-box">
                <div class="the-left">
                    <span>进站：</span>
                    <counter
                        :startNum="counterData.JZRC_TOTAL"
                        :intervalNum="counterData.JZRC"
                    />
                    <span>出站：</span>
                    <counter
                        :startNum="counterData.CZRC_TOTAL"
                        :intervalNum="counterData.CZRC"
                    />
                </div>
                <div class="the-right">
                    <span>增加：</span>
                    <number-roll
                        :number="dataList[0].data"
                        :unit="dataList[0].unit"
                        :numberStyle="{fontSize:'0.06rem'}"
                        :unitStyle="{
                            fontSize: dataList[0].unit == '分钟' ? '0.05rem' : '0.06rem'
                        }"
                    />
                </div>

            </div>
            <div id="subwaymap" class="wrap-subway">
                <the-base-chart
                    ref="subwaymap"
                    :option="subwaymMapOpts"
                    chartId="subwaymap"
                />
            </div>
        </div>
        <!--柱状 -->
        <div v-if="targetBtnIndex === 2" class="theEcharts-box theEcharts-box-plus">
            <!--自动轮播导航-->
            <auto-play-nav-table
                :list="autoTabList"
                @theCureentPM="theCureentPM"
            />
            <!--自动轮播表格-->
            <scroll-table
                :table-data="tableData"
            />
            <!--有滚动条的echart-->
            <div id="population_num_echart" class="the-scroll-chart">
                <base-chart
                    :option="populationNumOpt"
                    chart-id="population_num_echart"
                    @theChartGetZrClick="theChartGetZrClick"
                />
            </div>
        </div>
        <!--饼状-->
        <div v-if="targetBtnIndex === 3" class="theEcharts-box">
            <sector-div-pie
                sector-div-id="leftDivRightPie"
                :sector-div-list-all="arrList"
            />
        </div>
        <!--自动柱状-->
        <div v-if="targetBtnIndex === 4" class="theEcharts-box">
            <two-colum-bar-weiban
                twoColumId="twoColumIdWeiban"
                :woColumXdata="woColumXdata_weiban"
                :woColumDataList="woColumDataList_weiban"
                :woColumColor="woColumColor_weiban"
            />
        </div>
    </div>
</template>

<script>
    import ChinaMapChart from "@/components/theChart/chinaMapChart/index"
    import TitleTab from "@/components/theChart/tabBtn/index";
    import TheBaseChart from "@/components/theChart/baseChart/base-chart";
    import NumberRoll from "@/components/theChart/NumberRoll/index";
    import Counter from "@/components/theChart/counter/index";
    import SectorDivPie from "../../components/my-chart/sectorDiv-pie";
    import TwoColumBarWeiban from "../../components/my-chart/twoColumBarWeiban";
    import AutoPlayNavTable from "../../components/autoPlayNavTable/autoPlayNavTable";
    import ScrollTable from "../../components/scrollTable/scrollTable";
    import { TABLEDATA } from "./mockData"
    import BaseChart from "../../components/my-chart/base-chart";
    export default {
        name: 'echarts',
        components: { BaseChart, ScrollTable, AutoPlayNavTable, TwoColumBarWeiban, SectorDivPie, Counter, NumberRoll, TheBaseChart, TitleTab, ChinaMapChart },
        props: {
            /* migrateDialogData: { // 迁徙图数据
              default: {}
          },
          migrateDialogMapType:{ // 地图类型
              type:String,
              default : ''
          },*/
        },
        data () {
            return {
                btnList: [
                    { labelKey: '地图' },
                    { labelKey: '地铁' },
                    { labelKey: '柱状、自动轮播表格、自动滚动导航' },
                    { labelKey: '饼状' },
                    { labelKey: '自动柱状' },
                ],
                targetBtnIndex: 0,
                sticData: [],
                provinceSticData: [], // 省内
                chinaSticData: [], // 国内
                theMapType: '', // 地图类型  广东省 province 全国 nationwide
                effect: {
                    // symbol:
                    // 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
                    show: true,
                    period: 4, // 箭头指向速度，值越小速度越快
                    trailLength: 0.6, // 特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', // 箭头图标
                    symbolSize: 8, // 图标大小
                },
                InOutType: 'out',
                ChinaInOutType: 'out',
                nationwideOut: [
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "江门",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.590431",
                        LONGITUDE: "113.09494",
                        MD_ID: "13",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "14966",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "茂名",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.659752",
                        LONGITUDE: "110.919228",
                        MD_ID: "14",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "6266",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "潮州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.661701",
                        LONGITUDE: "116.632301",
                        MD_ID: "15",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "1872",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "中山",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.51595",
                        LONGITUDE: "113.3926",
                        MD_ID: "17",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "22515",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "东莞",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.046238",
                        LONGITUDE: "113.746262",
                        MD_ID: "23",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "48141",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "汕尾",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.774485",
                        LONGITUDE: "115.364235",
                        MD_ID: "25",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "3703",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "惠州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.079405",
                        LONGITUDE: "114.412598",
                        MD_ID: "26",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "21632",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "阳江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.859222",
                        LONGITUDE: "111.975105",
                        MD_ID: "40",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "4834",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "河源",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.746265",
                        LONGITUDE: "114.6978",
                        MD_ID: "41",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "4907",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "汕头",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.371019",
                        LONGITUDE: "116.708466",
                        MD_ID: "44",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "4135",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "揭阳",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.543777",
                        LONGITUDE: "116.355736",
                        MD_ID: "48",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "5121",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "佛山",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.028763",
                        LONGITUDE: "113.122719",
                        MD_ID: "59",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "203259",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "湛江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.274899",
                        LONGITUDE: "110.364975",
                        MD_ID: "61",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "6032",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "梅州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "24.299112",
                        LONGITUDE: "116.117584",
                        MD_ID: "70",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "3761",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "清远",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.685022",
                        LONGITUDE: "113.051224",
                        MD_ID: "75",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "34191",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "深圳",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.547001",
                        LONGITUDE: "114.085945",
                        MD_ID: "78",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "43230",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "韶关",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "24.801323",
                        LONGITUDE: "113.591545",
                        MD_ID: "83",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "9732",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "珠海",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.224979",
                        LONGITUDE: "113.553986",
                        MD_ID: "90",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "10350",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "云浮",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.929802",
                        LONGITUDE: "112.044441",
                        MD_ID: "96",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "5732",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "肇庆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.051546",
                        LONGITUDE: "112.472527",
                        MD_ID: "97",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "16540",
                        SEL_DATE: "2021-12-23",
                    },
                ], // 从广州出发
                nationwideIn: [
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "肇庆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.051546",
                        LONGITUDE: "112.472527",
                        MD_ID: "4",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "19053",
                        SEL_DATE: "2021-12-23"
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "汕尾",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.774485",
                        LONGITUDE: "115.364235",
                        MD_ID: "7",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "5698",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "云浮",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.929802",
                        LONGITUDE: "112.044441",
                        MD_ID: "11",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "7902",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "湛江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.274899",
                        LONGITUDE: "110.364975",
                        MD_ID: "24",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "7736",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "茂名",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.659752",
                        LONGITUDE: "110.919228",
                        MD_ID: "33",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "9102",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "珠海",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.224979",
                        LONGITUDE: "113.553986",
                        MD_ID: "35",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "9467",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "佛山",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.028763",
                        LONGITUDE: "113.122719",
                        MD_ID: "38",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "200513",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "揭阳",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.543777",
                        LONGITUDE: "116.355736",
                        MD_ID: "39",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "7334",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "惠州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.079405",
                        LONGITUDE: "114.412598",
                        MD_ID: "49",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "22938",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "清远",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.685022",
                        LONGITUDE: "113.051224",
                        MD_ID: "56",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "37888",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "汕头",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.371019",
                        LONGITUDE: "116.708466",
                        MD_ID: "57",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "6410",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "阳江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "21.859222",
                        LONGITUDE: "111.975105",
                        MD_ID: "58",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "6181",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "河源",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.746265",
                        LONGITUDE: "114.6978",
                        MD_ID: "66",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "6003",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "深圳",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.547001",
                        LONGITUDE: "114.085945",
                        MD_ID: "67",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "41724",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "江门",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.590431",
                        LONGITUDE: "113.09494",
                        MD_ID: "80",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "16027",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "潮州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.661701",
                        LONGITUDE: "116.632301",
                        MD_ID: "81",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "2694",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "东莞",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "23.046238",
                        LONGITUDE: "113.746262",
                        MD_ID: "84",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "53615",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "梅州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "24.299112",
                        LONGITUDE: "116.117584",
                        MD_ID: "88",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "4388",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "中山",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.51595",
                        LONGITUDE: "113.3926",
                        MD_ID: "92",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "21555",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "韶关",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "24.801323",
                        LONGITUDE: "113.591545",
                        MD_ID: "98",
                        ORG_SYS: "JT",
                        PIA_TYPE: "0",
                        POPULATION: "11586",
                        SEL_DATE: "2021-12-23",
                    },
                ], // 进入广州
                provinceIn: [
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "北京",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.904989",
                        LONGITUDE: "116.405285",
                        MD_ID: "2",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1327",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "江西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "28.676493",
                        LONGITUDE: "115.892151",
                        MD_ID: "3",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "9737",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "海南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "20.02",
                        LONGITUDE: "110.35",
                        MD_ID: "5",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2147",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "云南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "25.040609",
                        LONGITUDE: "102.71225",
                        MD_ID: "6",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1865",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "湖南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "28.19409",
                        LONGITUDE: "112.982277",
                        MD_ID: "8",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "19446",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "四川",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.659462",
                        LONGITUDE: "104.065735",
                        MD_ID: "9",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "3175",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "贵州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "26.578342",
                        LONGITUDE: "106.713478",
                        MD_ID: "10",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "3166",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "北京",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.916527",
                        LONGITUDE: "116.397128",
                        MD_ID: "18",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1327",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "宁夏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "38.46637",
                        LONGITUDE: "106.278175",
                        MD_ID: "19",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "126",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "吉林",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "43.886841",
                        LONGITUDE: "125.324501",
                        MD_ID: "22",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "428",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "山东",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.675808",
                        LONGITUDE: "117.000923",
                        MD_ID: "29",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2022",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "河南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.757977",
                        LONGITUDE: "113.665413",
                        MD_ID: "32",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2359",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "内蒙",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "40.81831",
                        LONGITUDE: "111.670799",
                        MD_ID: "34",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "324",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "西藏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "29.66036",
                        LONGITUDE: "91.13221",
                        MD_ID: "42",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "72",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "福建",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "26.075302",
                        LONGITUDE: "119.306236",
                        MD_ID: "47",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "4711",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "重庆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "29.40268",
                        LONGITUDE: "106.54041",
                        MD_ID: "50",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1868",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "河北",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.156631",
                        LONGITUDE: "117.201569",
                        MD_ID: "51",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1082",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "陕西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.263161",
                        LONGITUDE: "108.948021",
                        MD_ID: "54",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "579",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "天津",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.71755",
                        LONGITUDE: "117.30983",
                        MD_ID: "55",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "480",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "辽宁",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "41.796768",
                        LONGITUDE: "123.429092",
                        MD_ID: "62",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "553",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "江苏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "32.041546",
                        LONGITUDE: "118.76741",
                        MD_ID: "63",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2713",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "湖北",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.584354",
                        LONGITUDE: "114.298569",
                        MD_ID: "64",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "4084",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "新疆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "43.792816",
                        LONGITUDE: "87.617729",
                        MD_ID: "71",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "214",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "浙江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.287458",
                        LONGITUDE: "120.15358",
                        MD_ID: "72",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2368",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "黑龙江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "45.756966",
                        LONGITUDE: "126.642464",
                        MD_ID: "79",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "650",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "陕西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.263161",
                        LONGITUDE: "108.948021",
                        MD_ID: "82",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "348",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "青海",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.623177",
                        LONGITUDE: "101.778915",
                        MD_ID: "85",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "70",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "甘肃",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.058041",
                        LONGITUDE: "103.823555",
                        MD_ID: "87",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "362",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "广西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.82402",
                        LONGITUDE: "108.320007",
                        MD_ID: "94",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "17593",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "到达城市",
                        CITY_NAME: "安徽",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "31.861191",
                        LONGITUDE: "117.283043",
                        MD_ID: "99",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1566",
                        SEL_DATE: "2021-12-23",
                    },
                ], // 全国出
                provinceOut: [
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "黑龙江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "45.756966",
                        LONGITUDE: "126.642464",
                        MD_ID: "1",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "270",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "宁夏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "38.46637",
                        LONGITUDE: "106.278175",
                        MD_ID: "12",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "132",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "安徽",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "31.861191",
                        LONGITUDE: "117.283043",
                        MD_ID: "16",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1408",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "四川",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.659462",
                        LONGITUDE: "104.065735",
                        MD_ID: "20",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "3476",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "河南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.757977",
                        LONGITUDE: "113.665413",
                        MD_ID: "21",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2556",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "湖南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "28.19409",
                        LONGITUDE: "112.982277",
                        MD_ID: "27",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "18949",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "天津",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.71755",
                        LONGITUDE: "117.30983",
                        MD_ID: "28",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "341",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "陕西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.263161",
                        LONGITUDE: "108.948021",
                        MD_ID: "30",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "369",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "辽宁",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "41.796768",
                        LONGITUDE: "123.429092",
                        MD_ID: "31",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "524",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "青海",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.623177",
                        LONGITUDE: "101.778915",
                        MD_ID: "36",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "97",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "吉林",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "43.886841",
                        LONGITUDE: "125.324501",
                        MD_ID: "37",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "398",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "新疆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "43.792816",
                        LONGITUDE: "87.617729",
                        MD_ID: "43",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "165",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "贵州",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "26.578342",
                        LONGITUDE: "106.713478",
                        MD_ID: "45",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "3560",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "江苏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "32.041546",
                        LONGITUDE: "118.76741",
                        MD_ID: "46",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2316",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "福建",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "26.075302",
                        LONGITUDE: "119.306236",
                        MD_ID: "52",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "4184",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "甘肃",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.058041",
                        LONGITUDE: "103.823555",
                        MD_ID: "53",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "401",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "山东",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "36.675808",
                        LONGITUDE: "117.000923",
                        MD_ID: "60",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2043",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "广西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "22.82402",
                        LONGITUDE: "108.320007",
                        MD_ID: "65",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "15377",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "北京",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.916527",
                        LONGITUDE: "116.397128",
                        MD_ID: "68",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1374",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "河北",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.156631",
                        LONGITUDE: "117.201569",
                        MD_ID: "69",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "780",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "江西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "28.676493",
                        LONGITUDE: "115.892151",
                        MD_ID: "73",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "7771",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "海南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "20.02",
                        LONGITUDE: "110.35",
                        MD_ID: "74",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2030",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "西藏",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "29.66036",
                        LONGITUDE: "91.13221",
                        MD_ID: "76",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "30",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "陕西",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "34.263161",
                        LONGITUDE: "108.948021",
                        MD_ID: "77",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "262",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "浙江",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.287458",
                        LONGITUDE: "120.15358",
                        MD_ID: "86",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2176",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "重庆",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "29.40268",
                        LONGITUDE: "106.54041",
                        MD_ID: "89",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2059",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "北京",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "39.904989",
                        LONGITUDE: "116.405285",
                        MD_ID: "91",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "1374",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "内蒙",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "40.81831",
                        LONGITUDE: "111.670799",
                        MD_ID: "93",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "249",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "云南",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "25.040609",
                        LONGITUDE: "102.71225",
                        MD_ID: "95",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "2515",
                        SEL_DATE: "2021-12-23",
                    },
                    {
                        ARRIVE: "出发城市",
                        CITY_NAME: "湖北",
                        INSERT_TIME: "2021-12-24 08:32:56.0",
                        LATITUDE: "30.584354",
                        LONGITUDE: "114.298569",
                        MD_ID: "100",
                        ORG_SYS: "JT",
                        PIA_TYPE: "1",
                        POPULATION: "4683",
                        SEL_DATE: "2021-12-23",
                    },
                ], // 全国进
                chinaMapBtn: '',

                TabList: [
                    { labelKey: '省内客流流向分析' },
                    { labelKey: '全国客流流向分析' },
                    { labelKey: '疫情客流流向分析' },
                ],
                targetTabIndex: 0,

                subwaymMapOpts: null,
                counterData: {
                    "JZRC": "107768",
                    "INSERT_TIME": "2021-12-28 14:38:23.0",
                    "ORG": "",
                    "CZRC_TOTAL": "2016568",
                    "CZRC": "106297",
                    "JZRC_TOTAL": "2092664",
                    "MD_ID": "1562"
                },
                dataList: [
                    {
                        // title: "居民健康档案建档率",
                        // icon: require("../images/jk.png"),
                        data: '99',
                        unit: "%",
                        rate: '--',
                        rateUnit: "%",
                    },
                ],
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
                woColumXdata_weiban: ["人力资源和社会保障局", "卫生健康委员会", "政务服务数据管理局", "发展和改革委员会", "公安局", "中级法院",
                                      "市场监督管理局",
                                      "生态环境局",
                                      "商务局",
                                      "水务局",
                                      "城市管理行政执法局",
                                      "住房和城乡建设局",
                                      "来穗局",
                                      "规划和自然资源局",
                                      "应急管理局",
                                      "交通运输局",
                                      "民政局",
                                      "审计局",
                                      "工改办",
                                      "工业和信息化局",
                                      "文化和旅游局",
                                      "组织部",
                                      "气象局",
                                      "统计局",
                                      "科学技术局",
                                      "教育局",
                                      "医疗保障局",
                                      "体育局",
                                      "供电局",
                                      "交通局",
                                      "司法局",
                                      "广州供电局",
                                      "税务局",
                                      "住房公积金管理中心",
                                      "腾讯",
                                      "市政府办公厅",
                                      "地方金融监管局",
                                      "劳动局",
                                      "财政局",
                                      "公共资源交易中心",
                                      "广州燃气集团有限公司",
                                      "广州市自来水有限公司"],
                woColumDataList_weiban: [
                    "155141.0", "107069.0", "28730.6", "20069.7", "12745.0", "5398.42", "4568.96", "4235.04", "3612.51", "3390.91", "2536.18", "2496.79", "495.06", "266.47", "229.32", "194.95", "120.44", "111.15", "66.76", "39.38", "14.14", "8.67", "7.65", "1.83", "1.49", "1.45", "1.38", "1.17", "0.8", "0.6", "0.51", "0.17", "0.13", "0.05", "0.02", "0.02", "0.01", "0.0", "0.0",
                    "0.0",
                    "0.0",
                    "0.0",
                ],
                woColumColor_weiban: "#35ACFF",
                autoTabList: [
                    { labelKey: "2016" },
                    { labelKey: "2017" },
                    { labelKey: "2018" },
                    { labelKey: "2019" },
                    { labelKey: "2020" },
                ],
                tableData: TABLEDATA,
                populationNumOpt: null,
            }
        },
        created () {
        },
        mounted () {
            this.changeMap(this.nationwideOut, 'out');
            this.setSubwayData();
            this.initData();
        },
        methods: {
            clickBtn (tab) {
                this.targetBtnIndex = tab.targetIndex;
            },
            changeMap (val, type) {
                this.InOutType = type;
                this.sticData = val;
                this.theMapType = 'province';
                this.chinaMapBtn = 'provinceMapBtn';
            },
            changeMapChina (val, type) {
                this.InOutType = type;
                this.sticData = val;
                this.theMapType = 'nationwide';
                this.chinaMapBtn = 'chinaMapBtn';
            },
            changeMapChinaYQ (val, type) {
                this.InOutType = type;
                this.sticData = val;
                this.theMapType = 'nationwide';
                this.chinaMapBtn = 'chinaMapBtnYQ';
            },
            clickTab (tab) {
                this.targetTabIndex = tab.targetIndex
                if (tab.targetIndex === 0) {
                    this.changeMap(this.nationwideOut, 'out');
                }
                if (tab.targetIndex === 1) {
                    this.changeMapChina(this.provinceOut, 'out');
                }
                if (tab.targetIndex === 2) {
                    this.changeMapChinaYQ(this.provinceIn, 'in');
                }
            },
            // 地铁线路图
            setSubwayData (nodeData) {
                this.subwaymMapOpts = {
                    backgroundColor: "transparent",
                    grid: [
                        {
                            left: "-1%",
                            top: "5%",
                            right: "-1%",
                            bottom: "2%",
                            containLabel: true,
                        },
                    ],
                    xAxis: {
                        show: false,
                        min: 50,
                        max: 2300,
                        axisPointer: {
                            show: false,
                        },
                    },
                    yAxis: {
                        show: false,
                        min: 50,
                        max: 2000,
                        axisPointer: {
                            show: false,
                        },
                    },
                    tooltip: {
                        show: false,
                    },
                    series: [
                        {
                            type: "graph",
                            zlevel: 5,
                            coordinateSystem: "cartesian2d",
                            symbol: "rect",
                            label: {
                                normal: {
                                    show: true, // 是否显示站点
                                },
                            },
                            nodes: [
                                {
                                    "name": "一号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        495,
                                        840
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#F9E103",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "二号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        680,
                                        500
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#6699CC",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "三号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1130,
                                        380
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#EA6632",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "四号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1450,
                                        400
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#66CC33",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "五号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        405,
                                        963
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#F0134D",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "六号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        430,
                                        1200
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#FF1493",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "七号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        890,
                                        320
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#3FA37E",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "八号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        590,
                                        1350
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#00CCFF",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "九号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        405,
                                        1500
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#99C857",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "十三号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1655,
                                        620
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#A7B942",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "十四号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1300,
                                        1700
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#E066FF",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "二十一号线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1680,
                                        1120
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#516DFB",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "广佛线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        365,
                                        552
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#C9E887",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "APM线",
                                    "symbolSize": 0.1,
                                    "value": [
                                        1140,
                                        840
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#00A1CB",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "广清城际",
                                    "symbolSize": 0.1,
                                    "value": [
                                        350,
                                        1840
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#00CCFF",
                                        "position": "bottom",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "广州东环城际",
                                    "symbolSize": 0.1,
                                    "value": [
                                        590,
                                        1750
                                    ],
                                    "x": 800,
                                    "y": 400,
                                    "fixed": true,
                                    "category": 1,
                                    "label": {
                                        "color": "#66CC33",
                                        "position": "top",
                                        "show": true,
                                        "fontSize": 16,
                                        "fontWeight": 1000,
                                        "fontFamily": "BoldCondensed,SourceHanSansCN"
                                    }
                                },
                                {
                                    "name": "昌岗",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        733.94,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "车陂南",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1358.46,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "陈家祠",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        600.3,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大学城南",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        589.04
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "东山口",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        947.53,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "高增",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        898,
                                        1485
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "公园前",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        733.94,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "广州东站",
                                    "symbol": "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACldJREFUeNq8mmtMVdkVx7eIKOIDn4gvUFuQghjFR6dlfOA79ZFaR/2iNWZMJu2HdtKZpk07TZ0mpp1p06RN+8U2WtExgpgZUzS1GmtQ6wsRH/gCBRF8IiqoKApdvz1n32zO3HPOBbErWV65nLP3/q+19n+ttTddHj16pGpqatQbki6i3ZzPFtHmzhy8paVFjRo1SvXs2VNFA2LXrl2dtegU0TTRyaKpogmi0c7vW0UbRatES0WLRa+I1nV0whcvXqi1a9eqpKSk0CSvI2+JviM6TXSsaFw73q0UPSe6W7RQ9FZHFxEI5OXLl9qFSFRUlIqO1q8QLt8T/aHotx1vfEVaW1vbuqzLVx5LdnSRKPGdL/oX0XLebW5uVt26dQv3XvuAAGLBggUqISFBD9jU1KQKCwvfrq+v39C1a9dsP9BITEyMBm+Ehb169SoESsawfz9M9Meia+S5P2dnZ/8hPT390d69e9WNGzf0/B0GwqKGDRumVUgh7tixYx/V1dW9L4PG2M8AgAUNHDhQDRkyRD8/YMAA1atXrzZAiOmHDx+q27dva4K5c+eOevLkiQbkeBqJl58/KikpWSKx/wP5/5FOCS0sUVlZOWbr1q25Yqm3sLIJGxYWFxenxo0bpzIyMtTw4cNVjx49fMcbMWKEfh65f/++unLlijp//ryqra3VXgIQ4J8/f54pc/5b5v+V6O9fCwggzp07l1FcXFwglk8xIAgRJpw6dapWPNER4T108uTJ6uLFi+rIkSPq1q1bOiQBJZ+x8tineEn0lx0GIoNlFBUV/VPcm4T7EbGUtvzcuXNVcnJyp+QDDJaZmalSUlLU0aNHtRKuVrj9gi0n+tOOABkjWiCTJJlQwhNZWVlq3rx5gSHUEWHMnJwcbSghFfalvck/dPLQx+0Bwiq3OwlOg8BC06dP1xO9acEzffv2VTt37lT37t2zwawXrRDd5n4nymOs9U52Du2JadOm/V9AGIHyV6xYofr166eNaAkb/+uRAPmW6AfmB/YE4RQEwp38OkMggmXLlumQs/LTENHfudfuBoIP/2i+xxPEK3siqObZsWOH2rdvX+DihAH1Zo4UODkJYiGRWu98V3Sp3x7hgSnGwrDG/PnzVffu3X09wcYUmlaG2fCexThtpLq6Wh0/flxVVVWpOXPmRETdEyZM0PmmrKxMmRQg8jPRL0xFbXuEVfzItvLEiRPVyJEjfScBwJkzZ3QpzSSHDh1SJ0+e9Hy+oaFBP3fp0iW1adMmdeLEiTZljZdgHOawns0SnRcutNgb3zRlBxmbZOcn7J/Dhw+HyhA2JYxDlg8nhColCc8D5tmzZ9qb27dvV3fv3vWda9CgQXpcxrDkPVOw2kDeMT+zoLFjx+p6yU8oLaibCCMDfuHChap3795hnwfE06dPQ8AJRQARNps3b1ZSy/l6Z9KkSSo2NtbeK2/LGMk2EHqI2SE3yURk2qCC8uzZs6FFYSne8QMPENRdlgOGyppKd9u2bbqY9KJkQt3ySp/S0tIcG8goJ5Nrb+DGoUOH+gKRUl4nK6yKhViMV0gZefz4sR4/XH9hvHP16lW1ceNGvdfYp25JTU1VtsGFPHIIcQMkzalltKUTExN9mcodJlAj4LGYnzx48MD391gaMLQCFju1EdIBazOsKu3AN8SDIY7Msh8O8obxnIlVwAPEi3IjAYIxCE0qYRbr1RXGx8drpQVwGrMkmXe48UiqO6MGid0wITRRQUIRaC/cdIvmZ6pp+hW/1pYsD6lYpNBPDJQY5dDXQJPcKNDg6yDBvbjfeIUwCwqbxsbGEG1jLLxoFsTiSXiRZHyMZj8nGz4hymGsHgYIiwvqjzXNiVUAzDu4mNaVBXrVYICAIHhn5syZas2aNTrJmYKQMWArCCGSct9FFPFRTkYPPqYIYxXyBSHBImCw8vLyNvRs6irjhfT0dLVu3ToNBECEEhvb9PxkfWK/vWGtv5J/mti7xr0sIJKSgcFgKWNxPskrfFZUVKgtW7aogoKCEOcPHjxYLV68WPXv379NeALO7BXe9coh7jB1EUUTNEM8NBggWC5ciIRtIceMUadOnQq1qzdv3lS5ubn6+Ma0qgDwsKKW0aNHtwllTlmCBOq3RYxzz4xebYeEzS5BQLAwFjVGuHbtWggYSqcXRBo8ZzzrXmS4isJVHTSPHz/+jgFSaj8ciXuJ5wsXLoRAGI+ak0EmZB8EMSCFIxncjOHqBsPOCyGYlkHmqZF3qk0GO2Mfa8JAWCgcnxM+hNP169d1GLDwcGFjgMBufsJ5liEMU3f5CWQAGMKWNcr414TF6s0KoJv7hgapaL1ilY0GUAZkMK/kxSQwW9DCIAYzBu8EVdzUYoYcWIt0kMfZhwZIregpsynhfF4IJ9xHQKGzZ8/Wz7oZxAYStD/oQegYTWmDEbki8Ot/AG68h+Nlf/zLrn5bnbYxNKBkS894xcrkgtWrV+uSggnCUTYnIH5Cd0hFgEcc6+rxvOTy5cs6X1k1XbmQTbG7sfrChJdTVep2NOgcFzCzZs3S77jLbq8wwVu0x6h9ljxlyhTPwpNwArhL8uX7RjcQLlk+szc9bWxQTmGzc3AHIDI1zzMpC/IKLej9wIED2guEJwYgn/j1M4CGaKycQ474u9dx0J+cY0m9EBjFlBiRHNusWrVKH93wLupFvZThS5cu1WRAaPHJPYxX0oR4aLRcv+e08boXkAoHTGgv4BW7hvI9EZfFZ2dna+9gXb/zYUhj+fLluvdZtGhRqAIIR+O0wHjR2uREzydBJ42/FS2za6/du3cHnnK4uzgWF3TQDUPBgBx0eMn+/fv1XnXR+K/Vl5eqvkCou95lfxkrk0nz8/NVXV37LmAjufvzaxkIJ+5MXM/sFP1bpIfY/xX9uT0ZtMcJBxvuTQtkwfHrwYMH3ZehZc49Y0ukQJRzU7TBZFEGpDECTElJyRsDwV7Iy8vTnnBVDmxsbpJr2n1jxU2RJLUYCakPAMLA0Ct7hsw/Y8YMz03aXiH5QrFFRUWapVx7woC41KGrNwaXZujD06dPN0i3t55TPsMcVL4Ujlxscu0QdBTkV/1y0sh5MWFrjlMNYxFO8p0viEAgDMTClyxZ8rF4oko6wE8kNwx2Lip1IuOYk3KGLM+5L5/kCUB7xT/kQdGJV6mdIBHTAtiH6FLZ5sl370v/URtEHNGRMA9WWrly5T8yMzOPFhYWbmhqalrGdyiNEYsj17AwAAKE8r1Pnz6hOMcoJD8KUoBQipuDCzdzSca/LcXgb6Qw/Ss5BO8HHRgGXk8zEPnAsdhVmZjD7hWiPzHXc7Y1WRwWhuXCHe0YA3jQbr1orszxqQC9uWfPHh1uQa1AIBDTZNmVrdNI7ZD/8idF3xH9vugM9eVdeOhPM6wsHIlcFM0DBNUFQCsrK/W8Ef8tCg+HOyyO4ASD/3zu6NdEJ3If4xy/ciju1SExGcnosuh/RPkTDfj8aSQnJu4rP+P1aOI4LS3tddmz3NE852fuLKCxRNFY5+yMFT1w6qQaJ4xem7JNYfo/AQYAqpk3qBLp2UoAAAAASUVORK5CYII=",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1076.62,
                                        1161.69
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "广州火车站",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        733.94,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "广州南站",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        733.94,
                                        237
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "广州塔",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1076.62,
                                        831.62
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "海珠广场",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        733.94,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "汉溪长隆",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1076.62,
                                        468.53
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "黄村",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1437.5,
                                        984.89
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "黄沙",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        561.819999999999,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "嘉禾望岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "bottom",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        898,
                                        1349.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "客村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "left",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1076.62,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "沥滘",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1076.62,
                                        626.35
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "林和西",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "left",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1076.62,
                                        1099.42000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "南洲",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        575
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "区庄",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        947.53,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "沙园",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        638,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "石壁",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        733.94,
                                        315
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "苏元",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1902.9,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "坦尾",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        475.89,
                                        1040.66
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "体育西路",
                                    "symbol": "circle",
                                    "type": "effectScatter",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "top",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1076.62,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "天河客运站",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "right",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1378.22,
                                        1206.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "万胜围",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "right",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1358.46,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "文化公园",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        621.099999999999,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "西村",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "西塱",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        561.819999999999,
                                        629.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "新和",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1275,
                                        1726.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "燕塘",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1076.62,
                                        1206.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "杨箕",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        994.72,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "鱼珠",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1467.14,
                                        790.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "员村",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1245.88,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "镇龙",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1902.9,
                                        1556.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "珠江新城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "top",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1076.62,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "白江",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1896.4,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "白云大道北",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        930.5,
                                        1323.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "白云东平",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        950,
                                        1401.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "白云公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        761.5,
                                        1213.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "白云文化广场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        787.5,
                                        1239.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "板桥",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1299.7,
                                        563.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#3FA37E",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "宝岗大道",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        690,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "北京路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        807.78,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "朝安",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        366.819999999999,
                                        432
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "车陂",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1398.5,
                                        939
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "赤草",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1431,
                                        1882.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "赤岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1167.1,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "从化客运站",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1483,
                                        1934.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大观南路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1437.5,
                                        1023.89
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大剧院",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        934.06
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大沙地",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1547.61,
                                        790.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大沙东",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1623.92,
                                        790.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大石",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "left",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1076.62,
                                        520.79
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "大塘",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1076.62,
                                        689.66
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大学城北",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        648.32
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "大涌",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1755.35,
                                        24.1900000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "低涌",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        351.92
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东风",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1535,
                                        1986.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东湖",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        947.53,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东平",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        339,
                                        133
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东圃",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1391.35,
                                        863.21
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东晓南",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        640
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "东涌",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1358.46,
                                        292.64
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "动物园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        994.72,
                                        1064.97
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "番禺广场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1197.52,
                                        439.02
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "芳村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        561.819999999999,
                                        845.66
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "飞鹅岭",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        89.3999999999999,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "飞沙角",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1670.72,
                                        159.13
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "飞翔公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        733.94,
                                        1187.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "枫下",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1501.98,
                                        1716.66
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "凤岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1967.9,
                                        1705.61
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "凤凰新村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        586,
                                        835
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "妇儿中心",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        993.99
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "岗顶",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1275.52,
                                        1021.68
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "高塘石",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1614.3,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "高增1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        898,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "官湖",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2042,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "官洲",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        707.6
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "广隆",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1670.72,
                                        65.53
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "广隆1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1670.72,
                                        24.1900000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "广州北站",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        300,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "桂城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        405.819999999999,
                                        432
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "海傍",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        411.33
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "海心沙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        906.76
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "海心沙1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1100.02,
                                        831.62
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "汉溪长隆1",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1076.62,
                                        439.02
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "何棠下",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1630.94,
                                        1656.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "河沙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        468.35,
                                        1118.01
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "鹤洞",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        601.599999999999,
                                        698.76
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "横沙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        468.35,
                                        1242.81
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "红卫",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1369.77,
                                        1766.06
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花城大道",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        961.23
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花城路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        401.4,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花地湾",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        561.819999999999,
                                        773.77
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花都广场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        547,
                                        1615
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花都汽车城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        193.399999999999,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花果山公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        526.2,
                                        1583.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "华师",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1332.33,
                                        1064.06
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄陂",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1687.1,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄边",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        865.5,
                                        1317.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄阁",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1532.53,
                                        237.91
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄阁汽车城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1449.59,
                                        237.91
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄花岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1007.72,
                                        1157.53
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄花岗1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        947.53,
                                        1157.53
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "黄埔大道",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        1017.65
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "会江",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        733.94,
                                        380
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "机场北(2号航站楼)",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        898,
                                        1602
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "机场南(1号航站楼)",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        898,
                                        1537
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "纪念堂",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        733.94,
                                        1040.66
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "季华园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        262.819999999999,
                                        315
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "江南西",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        733.94,
                                        833.18
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "江泰路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        705
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "江夏",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        839.5,
                                        1291.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "蕉门",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1600.78,
                                        237.91
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "滘口",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        415.309999999999,
                                        981.64
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "金峰",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1766.4,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "金坑",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1902.9,
                                        1465.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "金融高新区",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        444.819999999999,
                                        629.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "金洲",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1670.72,
                                        237.91
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "京溪南方医院",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1020.2,
                                        1253.6
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "菊树",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        522.819999999999,
                                        629.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "柯木塱",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1551.9,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "科学城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1786.55,
                                        1229.03
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "科韵路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1302.17,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "坑贝",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1902.9,
                                        1673.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "坑口",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        561.819999999999,
                                        701.88
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "魁奇路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        262.819999999999,
                                        250
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "澜石",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        262.819999999999,
                                        185
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "礌岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        444.819999999999,
                                        497
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沥滘1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        900,
                                        626.35
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沥滘2",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        900,
                                        575
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "莲塘",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        703,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "烈士陵园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        882.27,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "猎德",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1133.3,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "林和西1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1100.02,
                                        1099.42000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "龙洞",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1486.9,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "龙归",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        898,
                                        1401.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "龙溪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        483.819999999999,
                                        629.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "鹭江",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        953.25,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "萝岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1961.4,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "洛溪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        510
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "马鞍山公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        651,
                                        1615
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "马沥",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1210,
                                        1661.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "梅花园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1050.1,
                                        1230.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "磨碟沙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1216.89,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南村万博",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1134.6,
                                        494.4
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#3FA37E",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1750.8,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南桂路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        444.819999999999,
                                        432
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南海神庙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1593.5,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南横",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        2047.46,
                                        139.11000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南浦",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        445
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南沙客运港",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2047.46,
                                        237.91
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "南洲1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        712.099999999999,
                                        575
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "农讲所",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        819.09,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "琶洲",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1316.34,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "普君北路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        314.819999999999,
                                        432
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "千灯湖",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        444.819999999999,
                                        562
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "清布",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        768,
                                        1550
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#99C857",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "庆盛",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1400.06,
                                        267.94
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "区庄1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        994.72,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "人和",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        898,
                                        1447.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "如意坊",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        492.4,
                                        998.28
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "三溪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1426.58,
                                        830.58
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "三元里",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        733.94,
                                        1152.85
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沙贝",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        468.35,
                                        1180.41
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沙村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1826.2,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沙河顶",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1007.72,
                                        1182.49
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "沙涌",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        601.599999999999,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "厦滘",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1076.62,
                                        574.74
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "山田",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2097.9,
                                        1770.61
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "神岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1379,
                                        1830.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "神舟路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1670.2,
                                        1169.36
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "石牌桥",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1213.12,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "石碁",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        470.48
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "石溪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        712.099999999999,
                                        608.41
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "世纪莲",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        287,
                                        133
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "市二宫",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        733.94,
                                        894.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "市桥",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "bottom",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        1126.15,
                                        439.02
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "双岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1520.18,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "水西",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1902.9,
                                        1368
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "太和",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1054,
                                        1505.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "太平",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1327,
                                        1778.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "潭村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1189.59,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "汤村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1766.53,
                                        1592.38
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "棠东",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1380.17,
                                        984.89
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "塘坑",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1899.65,
                                        24.1900000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "塘坑1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2047.46,
                                        24.1900000000001
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "淘金",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        904.11,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "体育中心",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1206.23,
                                        1115.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "体育中心1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1206.23,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "体育中心2",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1206.23,
                                        1161.69
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "体育中心南",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        1073.68
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "天河公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1289.17,
                                        939.39
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "天河南",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1100.02,
                                        1044.69
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00A1CB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "天河智慧城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1553.85,
                                        1109.69
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "天平架",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1038.4,
                                        1206.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "天平架1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1007.72,
                                        1206.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "同福西",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        603.55,
                                        884.335
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "同和",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        20,
                                        20
                                    ],
                                    "label": {
                                        "color": "yellow",
                                        "position": "bottom",
                                        "fontWeight": "bold"
                                    },
                                    "value": [
                                        990.3,
                                        1277
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "rgba(131,211,245,1)",
                                            "borderColor": "rgba(39,184,247,0.5)",
                                            "borderWidth": 20,
                                            "shadowColor": "rgba(255,255,255,1)",
                                            "shadowBlur": 30
                                        }
                                    }
                                },
                                {
                                    "name": "同济路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        262.819999999999,
                                        367
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "团一大广场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        878.5,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "旺村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1698.15,
                                        1624.88
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "文冲",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1704.13,
                                        790.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "五山",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1379.52,
                                        1106.31
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "五羊邨",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        994.72,
                                        892.2
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "西场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        599.91,
                                        1079.79
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "西门口",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "insideBottom"
                                    },
                                    "value": [
                                        667.64,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "夏良",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1002,
                                        1453.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "夏园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1671.5,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "暹岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1826.2,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "香雪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2022.5,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "萧岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        813.5,
                                        1265.3
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "小北",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        820,
                                        1118.14
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "晓港",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        796.21,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "谢村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        831.7,
                                        354
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#3FA37E",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新城东",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        391,
                                        133
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新港东",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        1266.55,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新南",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1436.07,
                                        1747.86
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新沙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2129.1,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新塘",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1965.3,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "新造",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1358.46,
                                        529.76
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#66CC33",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "浔峰岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        468.35,
                                        1305.08
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "燕岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        712.099999999999,
                                        673.41
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "一德路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        667.25,
                                        933.67
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "永泰",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        960.4,
                                        1300.4
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#EA6632",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "裕丰围",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1467.14,
                                        745.17
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "裕丰围1",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        0,
                                        0
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1467.14,
                                        686.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "员岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1223,
                                        532.1
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#3FA37E",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "越秀公园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        733.94,
                                        1080.44
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#6699CC",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "增城广场",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        2227.9,
                                        1834.31
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "长湴",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        1378.22,
                                        1264
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "长平",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1902.9,
                                        1413.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "长寿路",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        561.819999999999,
                                        982.55
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F9E103",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "镇龙北",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1838.16,
                                        1558.58
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "镇龙西",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1902.9,
                                        1517.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "知识城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1563.73,
                                        1688.71
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "植物园",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1405,
                                        1316
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#FF1493",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "中大",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        875.12,
                                        768.05
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "中山八",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        561.3,
                                        1041.18
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#F0134D",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "中新",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        1902.9,
                                        1608.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "钟村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "bottom"
                                    },
                                    "value": [
                                        966.9,
                                        417.7
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#3FA37E",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "钟岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2162.9,
                                        1801.81
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "钟落潭",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1158,
                                        1609.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "朱村",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        2032.9,
                                        1738.11
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#516DFB",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "竹料",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        1106,
                                        1557.8
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#E066FF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "祖庙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        262.819999999999,
                                        432
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#C9E887",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "滘心",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        603.94,
                                        1465.93
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "亭岗",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        603.94,
                                        1427.2866
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "石井",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        621.1,
                                        1388.6434
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "小坪",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1350
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "石潭",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1311.356
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "聚龙",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1272.7134
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "上步",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1234.07
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "同德",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1195.42667
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "鹅掌坦",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        638.26,
                                        1156.783
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "华林寺",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        610,
                                        960
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花山镇",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        730,
                                        1735
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花城街",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "top"
                                    },
                                    "value": [
                                        463,
                                        1735
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#A7B942",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "花都",
                                    "symbol": "image://data:image/png;base64,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",
                                    "symbolSize": [
                                        12,
                                        12
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "right"
                                    },
                                    "value": [
                                        300,
                                        1570
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#FFFFFF"
                                        }
                                    }
                                },
                                {
                                    "name": "乐同",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        300,
                                        1620
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "狮岭",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        300,
                                        1690
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "银盏",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        300,
                                        1760
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "龙塘镇",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        300,
                                        1830
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                                {
                                    "name": "清城",
                                    "symbol": "circle",
                                    "symbolSize": [
                                        8,
                                        8
                                    ],
                                    "label": {
                                        "color": "#EFEFEF",
                                        "position": "left"
                                    },
                                    "value": [
                                        300,
                                        1900
                                    ],
                                    "x": 1000,
                                    "y": 1000,
                                    "fixed": true,
                                    "category": 2,
                                    "itemStyle": {
                                        "normal": {
                                            "color": "#112852",
                                            "borderColor": "#00CCFF",
                                            "borderWidth": 2
                                        }
                                    }
                                },
                            ],
                            edges: [
                                // 13号线
                                {
                                    source: "鱼珠",
                                    target: "裕丰围",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "裕丰围",
                                    target: "裕丰围1",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "裕丰围1",
                                    target: "双岗",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "双岗",
                                    target: "南海神庙",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "南海神庙",
                                    target: "夏园",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "夏园",
                                    target: "南岗",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "南岗",
                                    target: "沙村",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "沙村",
                                    target: "白江",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "白江",
                                    target: "新塘",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "新塘",
                                    target: "官湖",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                {
                                    source: "官湖",
                                    target: "新沙",
                                    value: "十三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#A7B942",
                                        }
                                    }
                                },
                                // 十四号线
                                {
                                    source: "嘉禾望岗",
                                    target: "白云东平",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "白云东平",
                                    target: "夏良",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "夏良",
                                    target: "太和",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "太和",
                                    target: "竹料",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "竹料",
                                    target: "钟落潭",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "钟落潭",
                                    target: "马沥",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "马沥",
                                    target: "新和",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "新和",
                                    target: "太平",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "太平",
                                    target: "神岗",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "神岗",
                                    target: "赤草",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "赤草",
                                    target: "从化客运站",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "从化客运站",
                                    target: "东风",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                // 14号线支线(知识城线)
                                {
                                    source: "新和",
                                    target: "红卫",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "红卫",
                                    target: "新南",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "新南",
                                    target: "枫下",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "枫下",
                                    target: "知识城",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "知识城",
                                    target: "何棠下",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "何棠下",
                                    target: "旺村",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "旺村",
                                    target: "汤村",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "汤村",
                                    target: "镇龙北",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                {
                                    source: "镇龙北",
                                    target: "镇龙",
                                    value: "十四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#E066FF",
                                        }
                                    }
                                },
                                // 1号线
                                {
                                    source: "西塱",
                                    target: "坑口",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "坑口",
                                    target: "花地湾",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "花地湾",
                                    target: "芳村",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "芳村",
                                    target: "黄沙",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "黄沙",
                                    target: "长寿路",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "长寿路",
                                    target: "陈家祠",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "陈家祠",
                                    target: "西门口",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "西门口",
                                    target: "公园前",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "公园前",
                                    target: "农讲所",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "农讲所",
                                    target: "烈士陵园",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "烈士陵园",
                                    target: "东山口",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "东山口",
                                    target: "杨箕",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "杨箕",
                                    target: "体育西路",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "体育西路",
                                    target: "体育中心1",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "体育中心1",
                                    target: "体育中心",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "体育中心",
                                    target: "体育中心2",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                {
                                    source: "体育中心2",
                                    target: "广州东站",
                                    value: "一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F9E103",
                                        }
                                    }
                                },
                                // 21号线
                                {
                                    source: "员村",
                                    target: "天河公园",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "天河公园",
                                    target: "棠东",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "棠东",
                                    target: "黄村",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "黄村",
                                    target: "大观南路",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "大观南路",
                                    target: "天河智慧城",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "天河智慧城",
                                    target: "神舟路",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "神舟路",
                                    target: "科学城",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "科学城",
                                    target: "苏元",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "苏元",
                                    target: "水西",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "水西",
                                    target: "长平",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "长平",
                                    target: "金坑",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "金坑",
                                    target: "镇龙西",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "镇龙西",
                                    target: "镇龙",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "镇龙",
                                    target: "中新",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "中新",
                                    target: "坑贝",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "坑贝",
                                    target: "凤岗",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "凤岗",
                                    target: "朱村",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "朱村",
                                    target: "山田",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "山田",
                                    target: "钟岗",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                {
                                    source: "钟岗",
                                    target: "增城广场",
                                    value: "二十一号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#516DFB",
                                        }
                                    }
                                },
                                // 2号线
                                {
                                    source: "嘉禾望岗",
                                    target: "黄边",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "黄边",
                                    target: "江夏",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "江夏",
                                    target: "萧岗",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "萧岗",
                                    target: "白云文化广场",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "白云文化广场",
                                    target: "白云公园",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "白云公园",
                                    target: "飞翔公园",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "飞翔公园",
                                    target: "三元里",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "三元里",
                                    target: "广州火车站",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "广州火车站",
                                    target: "越秀公园",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "越秀公园",
                                    target: "纪念堂",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "纪念堂",
                                    target: "公园前",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "公园前",
                                    target: "海珠广场",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "海珠广场",
                                    target: "市二宫",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "市二宫",
                                    target: "江南西",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "江南西",
                                    target: "昌岗",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "昌岗",
                                    target: "江泰路",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "江泰路",
                                    target: "东晓南",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "东晓南",
                                    target: "南洲",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "南洲",
                                    target: "洛溪",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "洛溪",
                                    target: "南浦",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "南浦",
                                    target: "会江",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "会江",
                                    target: "石壁",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                {
                                    source: "石壁",
                                    target: "广州南站",
                                    value: "二号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#6699CC",
                                        }
                                    }
                                },
                                // 3号线
                                {
                                    source: "天河客运站",
                                    target: "五山",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "五山",
                                    target: "华师",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "华师",
                                    target: "岗顶",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "岗顶",
                                    target: "石牌桥",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "石牌桥",
                                    target: "体育西路",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "体育西路",
                                    target: "珠江新城",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "珠江新城",
                                    target: "广州塔",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "广州塔",
                                    target: "客村",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "客村",
                                    target: "大塘",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "大塘",
                                    target: "沥滘",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "沥滘",
                                    target: "厦滘",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "厦滘",
                                    target: "大石",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "大石",
                                    target: "汉溪长隆",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "汉溪长隆",
                                    target: "汉溪长隆1",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "汉溪长隆1",
                                    target: "市桥",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "市桥",
                                    target: "番禺广场",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                // 3号线北延段
                                {
                                    source: "体育西路",
                                    target: "林和西",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "林和西",
                                    target: "燕塘",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "燕塘",
                                    target: "广州东站",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "广州东站",
                                    target: "梅花园",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "梅花园",
                                    target: "京溪南方医院",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "京溪南方医院",
                                    target: "同和",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "同和",
                                    target: "永泰",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "永泰",
                                    target: "白云大道北",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "白云大道北",
                                    target: "嘉禾望岗",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "嘉禾望岗",
                                    target: "龙归",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "龙归",
                                    target: "人和",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "人和",
                                    target: "高增",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "高增",
                                    target: "机场南(1号航站楼)",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                {
                                    source: "机场南(1号航站楼)",
                                    target: "机场北(2号航站楼)",
                                    value: "三号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#EA6632",
                                        }
                                    }
                                },
                                // 4号线
                                {
                                    source: "黄村",
                                    target: "车陂",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "车陂",
                                    target: "车陂南",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "车陂南",
                                    target: "万胜围",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "万胜围",
                                    target: "官洲",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "官洲",
                                    target: "大学城北",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "大学城北",
                                    target: "大学城南",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "大学城南",
                                    target: "新造",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "新造",
                                    target: "石碁",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "石碁",
                                    target: "海傍",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "海傍",
                                    target: "低涌",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "低涌",
                                    target: "东涌",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "东涌",
                                    target: "庆盛",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "庆盛",
                                    target: "黄阁汽车城",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "黄阁汽车城",
                                    target: "黄阁",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "黄阁",
                                    target: "蕉门",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "蕉门",
                                    target: "金洲",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "金洲",
                                    target: "飞沙角",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "飞沙角",
                                    target: "广隆",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "广隆",
                                    target: "广隆1",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "广隆1",
                                    target: "大涌",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "大涌",
                                    target: "塘坑",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "塘坑",
                                    target: "塘坑1",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "塘坑1",
                                    target: "南横",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "南横",
                                    target: "南沙客运港",
                                    value: "四号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                // 5号线
                                {
                                    source: "滘口",
                                    target: "坦尾",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "坦尾",
                                    target: "中山八",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "中山八",
                                    target: "西场",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "西场",
                                    target: "西村",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "西村",
                                    target: "广州火车站",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "广州火车站",
                                    target: "小北",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "小北",
                                    target: "淘金",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "淘金",
                                    target: "区庄",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "区庄",
                                    target: "区庄1",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "区庄1",
                                    target: "动物园",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "动物园",
                                    target: "杨箕",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "杨箕",
                                    target: "五羊邨",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "五羊邨",
                                    target: "珠江新城",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "珠江新城",
                                    target: "猎德",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "猎德",
                                    target: "潭村",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "潭村",
                                    target: "员村",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "员村",
                                    target: "科韵路",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "科韵路",
                                    target: "车陂南",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "车陂南",
                                    target: "东圃",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "东圃",
                                    target: "三溪",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "三溪",
                                    target: "鱼珠",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "鱼珠",
                                    target: "大沙地",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "大沙地",
                                    target: "大沙东",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                {
                                    source: "大沙东",
                                    target: "文冲",
                                    value: "五号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#F0134D",
                                        }
                                    }
                                },
                                // 6号线
                                {
                                    source: "香雪",
                                    target: "萝岗",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "萝岗",
                                    target: "苏元",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "苏元",
                                    target: "暹岗",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "暹岗",
                                    target: "金峰",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "金峰",
                                    target: "黄陂",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "黄陂",
                                    target: "高塘石",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "高塘石",
                                    target: "柯木塱",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "柯木塱",
                                    target: "龙洞",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "龙洞",
                                    target: "植物园",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "植物园",
                                    target: "长湴",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "长湴",
                                    target: "天河客运站",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "天河客运站",
                                    target: "燕塘",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "燕塘",
                                    target: "天平架",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "天平架",
                                    target: "天平架1",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "天平架1",
                                    target: "沙河顶",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "沙河顶",
                                    target: "黄花岗",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "黄花岗",
                                    target: "黄花岗1",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "黄花岗1",
                                    target: "区庄",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "区庄",
                                    target: "东山口",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "东山口",
                                    target: "东湖",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "东湖",
                                    target: "团一大广场",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "团一大广场",
                                    target: "北京路",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "北京路",
                                    target: "海珠广场",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "海珠广场",
                                    target: "一德路",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "一德路",
                                    target: "文化公园",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "文化公园",
                                    target: "黄沙",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "黄沙",
                                    target: "如意坊",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "如意坊",
                                    target: "坦尾",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "坦尾",
                                    target: "河沙",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "河沙",
                                    target: "沙贝",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "沙贝",
                                    target: "横沙",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                {
                                    source: "横沙",
                                    target: "浔峰岗",
                                    value: "六号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#FF1493",
                                        }
                                    }
                                },
                                // 7号线
                                {
                                    source: "广州南站",
                                    target: "石壁",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "石壁",
                                    target: "谢村",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "谢村",
                                    target: "钟村",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "钟村",
                                    target: "汉溪长隆",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "汉溪长隆",
                                    target: "南村万博",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "南村万博",
                                    target: "员岗",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "员岗",
                                    target: "板桥",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                {
                                    source: "板桥",
                                    target: "大学城南",
                                    value: "七号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#3FA37E",
                                        }
                                    }
                                },
                                // 8号线
                                {
                                    source: "滘心",
                                    target: "亭岗",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "亭岗",
                                    target: "石井",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "石井",
                                    target: "小坪",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "小坪",
                                    target: "石潭",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "石潭",
                                    target: "聚龙",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "聚龙",
                                    target: "上步",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "上步",
                                    target: "同德",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "同德",
                                    target: "鹅掌坦",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "鹅掌坦",
                                    target: "西村",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "西村",
                                    target: "陈家祠",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "陈家祠",
                                    target: "华林寺",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "华林寺",
                                    target: "文化公园",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "文化公园",
                                    target: "同福西",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "同福西",
                                    target: "凤凰新村",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "凤凰新村",
                                    target: "沙园",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "沙园",
                                    target: "宝岗大道",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "宝岗大道",
                                    target: "昌岗",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "昌岗",
                                    target: "晓港",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "晓港",
                                    target: "中大",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "中大",
                                    target: "鹭江",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "鹭江",
                                    target: "客村",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "客村",
                                    target: "赤岗",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "赤岗",
                                    target: "磨碟沙",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "磨碟沙",
                                    target: "新港东",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "新港东",
                                    target: "琶洲",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "琶洲",
                                    target: "万胜围",
                                    value: "八号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                // 9号线
                                {
                                    source: "高增",
                                    target: "高增1",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "高增1",
                                    target: "清塘",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "清塘",
                                    target: "清布",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "清布",
                                    target: "莲塘",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "莲塘",
                                    target: "马鞍山公园",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "马鞍山公园",
                                    target: "花都广场",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "花都广场",
                                    target: "花果山公园",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "花果山公园",
                                    target: "花城路",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "花城路",
                                    target: "广州北站",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "广州北站",
                                    target: "花都汽车城",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                {
                                    source: "花都汽车城",
                                    target: "飞鹅岭",
                                    value: "九号线",
                                    lineStyle: {
                                        normal: {
                                            color: "#99C857",
                                        }
                                    }
                                },
                                // APM线
                                {
                                    source: "林和西",
                                    target: "林和西1",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "林和西1",
                                    target: "体育中心南",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "体育中心南",
                                    target: "天河南",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "天河南",
                                    target: "黄埔大道",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "黄埔大道",
                                    target: "妇儿中心",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "妇儿中心",
                                    target: "花城大道",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "花城大道",
                                    target: "大剧院",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "大剧院",
                                    target: "海心沙",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "海心沙",
                                    target: "海心沙1",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                {
                                    source: "海心沙1",
                                    target: "广州塔",
                                    value: "APM线",
                                    lineStyle: {
                                        normal: {
                                            color: "#00A1CB",
                                        }
                                    }
                                },
                                // 广佛线
                                {
                                    source: "沥滘",
                                    target: "沥滘1",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "沥滘1",
                                    target: "沥滘2",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "沥滘2",
                                    target: "南洲",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "南洲",
                                    target: "南洲1",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "南洲1",
                                    target: "石溪",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "石溪",
                                    target: "燕岗",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "燕岗",
                                    target: "沙园",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "沙园",
                                    target: "沙涌",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "沙涌",
                                    target: "鹤洞",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "鹤洞",
                                    target: "西塱",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "西塱",
                                    target: "菊树",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "菊树",
                                    target: "龙溪",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "龙溪",
                                    target: "金融高新区",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "金融高新区",
                                    target: "千灯湖",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "千灯湖",
                                    target: "礌岗",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "礌岗",
                                    target: "南桂路",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "南桂路",
                                    target: "桂城",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "桂城",
                                    target: "朝安",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "朝安",
                                    target: "普君北路",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "普君北路",
                                    target: "祖庙",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "祖庙",
                                    target: "同济路",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "同济路",
                                    target: "季华园",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "季华园",
                                    target: "魁奇路",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "魁奇路",
                                    target: "澜石",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "澜石",
                                    target: "世纪莲",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "世纪莲",
                                    target: "东平",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "东平",
                                    target: "新城东",
                                    value: "广佛线",
                                    lineStyle: {
                                        normal: {
                                            color: "#C9E887",
                                        }
                                    }
                                },
                                {
                                    source: "机场北(2号航站楼)",
                                    target: "花山镇",
                                    value: "广州东环城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "花山镇",
                                    target: "花城街",
                                    value: "广州东环城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "花城街",
                                    target: "花都",
                                    value: "广州东环城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#66CC33",
                                        }
                                    }
                                },
                                {
                                    source: "花都",
                                    target: "乐同",
                                    value: "广清城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "乐同",
                                    target: "狮岭",
                                    value: "广清城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "狮岭",
                                    target: "银盏",
                                    value: "广清城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "银盏",
                                    target: "龙塘镇",
                                    value: "广清城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                                {
                                    source: "龙塘镇",
                                    target: "清城",
                                    value: "广清城际",
                                    lineStyle: {
                                        normal: {
                                            color: "#00CCFF",
                                        }
                                    }
                                },
                            ],
                            lineStyle: {
                                normal: {
                                    opacity: 0.6, // 线条透明度
                                    color: "#53B5EA",
                                    curveness: 0,
                                    width: 5, // 线条宽度
                                },
                            },
                        },
                    ],
                };
            },
            // 人口迁徙时间轴回调 根据年份切换数据
            theCureentPM (yearData) {
                // console.log(yearData,'2222222222222222');
            },
            // 柱形图区域 点击
            theChartGetZrClick (params) {
                // console.log(params,'pppppppppppppp')
                /* switch (params.type) {
                  case 0: // 区域
                      // if(params.name == '其他'){
                      //   return
                      // }
                      this.populationNumFlag = 1 // 下砖到 街道
                      this.fetchPopulationNum({parent_code:params.code},this.populationNumFlag)
                      break;
                  case 1: // 街道
                      this.populationNumFlag = 2 // 下转到 社区
                      this.fetchPopulationNum({parent_code:params.code},this.populationNumFlag)
                      break;
              }*/
            },
            initData () {
                const dataNameArr = [
                    {
                        "name": "户籍人口",
                        "value": [
                            {
                                "value": "63.59",
                                "code": "440104",
                                "type": 0
                            },
                            {
                                "value": "86.07",
                                "code": "440105",
                                "type": 0
                            },
                            {
                                "value": "57.84",
                                "code": "440103",
                                "type": 0
                            },
                            {
                                "value": "93.50",
                                "code": "440106",
                                "type": 0
                            },
                            {
                                "value": "98.73",
                                "code": "440111",
                                "type": 0
                            },
                            {
                                "value": "34.20",
                                "code": "440112",
                                "type": 0
                            },
                            {
                                "value": "2.30",
                                "code": "440114",
                                "type": 0
                            },
                            {
                                "value": "68.52",
                                "code": "440113",
                                "type": 0
                            },
                            {
                                "value": "31.84",
                                "code": "440115",
                                "type": 0
                            },
                            {
                                "value": "41.10",
                                "code": "440117",
                                "type": 0
                            },
                            {
                                "value": "36.67",
                                "code": "440118",
                                "type": 0
                            },
                            {
                                "value": "399.18",
                                "code": "440100",
                                "type": 0
                            }
                        ]
                    },
                    {
                        "name": "非户籍人口",
                        "value": [
                            {
                                "value": "16.90",
                                "code": "440104",
                                "type": 0
                            },
                            {
                                "value": "51.19",
                                "code": "440105",
                                "type": 0
                            },
                            {
                                "value": "17.74",
                                "code": "440103",
                                "type": 0
                            },
                            {
                                "value": "95.25",
                                "code": "440106",
                                "type": 0
                            },
                            {
                                "value": "153.78",
                                "code": "440111",
                                "type": 0
                            },
                            {
                                "value": "26.14",
                                "code": "440112",
                                "type": 0
                            },
                            {
                                "value": "1.85",
                                "code": "440114",
                                "type": 0
                            },
                            {
                                "value": "101.03",
                                "code": "440113",
                                "type": 0
                            },
                            {
                                "value": "20.49",
                                "code": "440115",
                                "type": 0
                            },
                            {
                                "value": "2.86",
                                "code": "440117",
                                "type": 0
                            },
                            {
                                "value": "17.87",
                                "code": "440118",
                                "type": 0
                            },
                            {
                                "value": "976.50",
                                "code": "440100",
                                "type": 0
                            }
                        ]
                    }
                ];
                const xDataNameArr = [
                    "越秀",
                    "海珠",
                    "荔湾",
                    "天河",
                    "白云",
                    "黄埔",
                    "花都",
                    "番禺",
                    "南沙",
                    "从化",
                    "增城",
                    "其他"
                ];
                this.populationNumOpt = this.setOptions(dataNameArr, xDataNameArr, 0);
            },
            // 设置 ecahrts
            setOptions (data, xData, type) {

                let maxValueSpan = 0
                let end = 100 - 1500 / 31
                switch (type) {
                case 0:
                    maxValueSpan = 11
                    end = 90
                    break;
                case 1:
                    maxValueSpan = 4
                    break;
                case 2:
                    maxValueSpan = 3
                    break;

                }
                let dataZoom = [
                    // 给x轴设置滚动条
                    {
                        start: 0, // 默认为0
                        end: end, // 默认为100
                        type: "slider",
                        show: true,
                        xAxisIndex: [0],
                        maxValueSpan: maxValueSpan,
                        handleSize: 0, // 滑动条的 左右2个滑动条的大小
                        height: 10, // 组件高度
                        left: "10%", // 左边的距离
                        right: "10%", // 右边的距离
                        bottom: 10, // 右边的距离
                        borderColor: "#000",
                        fillerColor: "#269cdb",
                        borderRadius: 5,
                        backgroundColor: "#33384b", // 两边未选中的滑动条区域的颜色
                        showDataShadow: false, // 是否显示数据阴影 默认auto
                        showDetail: false, // 即拖拽时候是否显示详细数值信息 默认true
                        realtime: true, // 是否实时更新
                        filterMode: "filter",
                    },
                ]

                return {
                    dataZoom,
                    grid: {
                        top: "16%",
                        bottom: "17%", // 也可设置left和right设置距离来控制图表的大小
                        right: "4%",
                        left: "8%",
                    },
                    tooltip: {
                        trigger: "axis",
                        axisPointer: {
                            type: "shadow",
                            label: {
                                show: false,
                            },
                        },
                        textStyle: {
                            fontSize: 24,
                            fontWeight: "bold",
                            fontFamily: "BoldCondensed,SourceHanSansCN",
                        },
                        formatter: (params) => {
                            let marker = "";
                            let total = 0
                            // console.log(params,'params')
                            let relVal = `<span style="font-size: 0.048rem;font-weight: bold;font-family: DINNextLTPro-BoldCondensed;">${params[0].name}</span>`;
                            for (var i = 0, len = params.length; i < len; i++) {
                                marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[i].color.colorStops[1].color}"></span> `;
                                relVal +=
                                    "<br/>" +
                                    marker +
                                    '<span style="font-size: 0.04rem;font-weight: bold;font-family: DINNextLTPro-BoldCondensed;">' +
                                    params[i].seriesName + " : " + Number(params[i].value).toFixed(2) +
                                    "万人" +
                                    "</span>";
                                total += Number(params[i].value)
                            }
                            relVal +=
                                "<br/>" +
                                `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#ffad5a"></span> ` +
                                '<span style="font-size: 0.04rem;font-weight: bold;font-family: DINNextLTPro-BoldCondensed;">' +
                                "总数 : " + total.toFixed(2) +
                                "万人" +
                                "</span>"
                            return relVal;
                        },
                    },
                    legend: {
                        name: ['户籍人口', '非户籍人口'],
                        top: "0%",
                        right: "4%",
                        icon: "circle",
                        textStyle: {
                            color: "#A0B2D3",
                            fontSize: 20,
                            fontFamily: "SourceHanSansCN",
                            fontWeight: "600",
                        },
                    },
                    xAxis: {
                        data: xData,
                        axisLine: {
                            show: true, // 隐藏X轴轴线
                            lineStyle: {
                                color: "rgba(255, 255, 255, 0.08)",
                            },
                        },
                        axisTick: {
                            show: false, // 隐藏X轴刻度
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 20,
                                fontFamily: "SourceHanSansCN",
                                fontWeight: "600",
                                color: "#A0B2D3", // X轴文字颜色
                            },
                        },
                    },
                    yAxis: [
                        {
                            name: "(单位:万人)",
                            nameTextStyle: {
                                color: "#A0B2D3",
                                fontSize: 20,
                                fontWeight: "bold",
                                textStyle: {
                                    fontFamily: "SourceHanSansCN",
                                },
                                padding: [0, 0, 0, -18],
                            },
                            type: "value",
                            splitLine: {
                                show: true,
                                lineStyle: {
                                    color: "rgba(33,35,98,1)",
                                },
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                show: false,
                                lineStyle: {
                                    color: "#C9DCFF",
                                },
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    fontSize: 26,
                                    fontFamily: "BoldCondensed",
                                    fontWeight: "600",
                                    color: "#A0B2D3", // X轴文字颜色
                                },
                            },
                        },
                        {
                            type: "value",
                            position: "right",
                            splitLine: {
                                show: false,
                            },
                            axisTick: {
                                show: false,
                            },
                            axisLine: {
                                show: false,
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: "#C9DCFF",
                                },
                            },
                        },
                    ],
                    series: [
                        {
                            name: data[0].name,
                            type: "bar",
                            barWidth: "30",
                            showBackground: false,
                            backgroundStyle: {
                                color: "rgba(16, 21, 31, 0.4)",
                            },
                            itemStyle: {
                                normal: {
                                    color: {
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            {
                                                offset: 1,
                                                color: "rgba(79, 158, 253,1)",
                                            },
                                            {
                                                offset: 0,
                                                color: "rgba(101, 165, 243,1)",
                                            },
                                        ],
                                    },
                                },
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: "#2dc0ec",
                                    shadowBlur: 10,
                                    borderColor: "#2dc0ec",
                                    borderWidth: 2,
                                },
                            },
                            data: data[0].value,
                            rawdate: [321],
                            stack: "a",
                            zlevel: 1,
                        }, {
                            name: data[1].name,
                            type: "bar",
                            barWidth: "30",
                            showBackground: false,
                            backgroundStyle: {
                                color: "#00E9EA",
                            },
                            itemStyle: {
                                normal: {
                                    color: {
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [
                                            {
                                                offset: 1,
                                                color: "#00E9EA",
                                            },
                                            {
                                                offset: 0,
                                                color: "#00E9EA",
                                            },
                                        ],
                                    },
                                },
                            },
                            emphasis: {
                                itemStyle: {
                                    shadowColor: "#2dc0ec",
                                    shadowBlur: 10,
                                    borderColor: "#2dc0ec",
                                    borderWidth: 2,
                                },
                            },
                            data: data[1].value,
                            stack: "a",
                            zlevel: 1,
                        },
                    ],
                };
            },
        }
    }
</script>

<style lang="less" scoped>
    .echarts-wrap{
      width: 100%;
      height: 100%;
      .the-nav-btn{
        z-index: 2112;
        position: absolute;
        top: 1rem;
        left: 2rem;
        /deep/ .title-tab-small-button{
          width: 1rem;
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
        height: 9.2rem;
        z-index: 2;
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
    }
</style>
