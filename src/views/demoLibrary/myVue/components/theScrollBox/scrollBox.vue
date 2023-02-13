<template>
    <div ref="scrollbarbox" class="scrollBox-wrap scrollbar">
        <div v-for="(item,index) in dataObj" :key="index">
            <div class="the-item-box">
                <div class="the-color-box the-box">
                    <span v-if="item.totalNum <= item.thresholdNum"  style="background: #55a532; border: 2px solid #52e550;"></span>
                    <span v-else style="background: red; border: 2px solid red;"></span>
                    <span class="w50">{{nowDate}}</span>
                    <span class="w50">{{item.addrees}}</span>
                </div>
                <div class="the-box the-num-color">
                    <span v-if="item.totalNum <= item.thresholdNum" class="w33">正常</span>
                    <span v-else class="w33">告警</span>
                    <span v-if="item.totalNum <= item.thresholdNum" class="w33">总量:<strong style="color: #55a532">{{item.totalNum}}</strong></span>
                    <span v-else class="w33">总量:<strong style="color: red">{{item.totalNum}}</strong></span>
                    <span class="w33">阈值:{{item.thresholdNum}}</span>
                </div>
                <div class="the-box">
                    <span class="w33">青佶</span>
                    <span class="w33">实时:{{item.qjNowNum}}</span>
                    <span class="w33">配额:{{item.qjPe}}</span>
                </div>
                <div class="the-box">
                    <span class="w33">摩拜</span>
                    <span class="w33">实时:{{item.mpNowNum}}</span>
                    <span class="w33">配额:{{item.mpPe}}</span>
                </div>
                <div class="the-box">
                    <span class="w33">哈啰</span>
                    <span class="w33">实时:{{item.hlNowNum}}</span>
                    <span class="w33">配额:{{item.hlPe}}</span>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch,defineProps } from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'
    export default defineComponent({
      name: "theScrollBox",
      props: {
        loop:{
          type: Boolean,
          default: true
        }
      },
      setup(props, contex) {
        const store = useStore();
        const router = useRouter();
        const dataMap = reactive({
          dataObj: [
            {
              // time: time,
              addrees: '沙河片区',
              thresholdNum: 6806,
              totalNum: 3372,
              qjNowNum: 894,
              qjPe: 1624,
              mpNowNum: 2662,
              mpPe: 222,
              hlNowNum: 854,
              hlPe: 2468,
            },
            {
              // time: 2021 - 02 - 27 15: 36,
              addrees: '九龙地区',
              thresholdNum: 609,
              totalNum: 88,
              qjNowNum: 150,
              qjPe: 29,
              mpNowNum: 58,
              mpPe: 222,
              hlNowNum: 1,
              hlPe: 237,
            },
            {
              // time: 2021 - 02 - 27 15: 36,
              addrees: '科丰路片区',
              thresholdNum: 3345,
              totalNum: 6088,
              qjNowNum: 852,
              qjPe: 823,
              mpNowNum: 2399,
              mpPe: 1308,
              hlNowNum: 2837,
              hlPe: 1213,
            }, {
              // time: 2021 - 02 - 27 15: 36,
              addrees: '中大片区',
              thresholdNum: 12666,
              totalNum: 17135,
              qjNowNum: 3506,
              qjPe: 3117,
              mpNowNum: 6286,
              mpPe: 4954,
              hlNowNum: 7343,
              hlPe: 4593,
            },
            {
              // time: 2021 - 02 - 27 15: 36,
              addrees: '白云新城片区',
              thresholdNum: 17196,
              totalNum: 23714,
              qjNowNum: 8518,
              qjPe: 4232,
              mpNowNum: 7199,
              mpPe: 6726,
              hlNowNum: 7997,
              hlPe: 6236,
            },
            {
              // time: 2021 - 02 - 27 15: 36,
              addrees: '龙洞片区',
              thresholdNum: 4017,
              totalNum: 3142,
              qjNowNum: 668,
              qjPe: 988,
              mpNowNum: 1620,
              mpPe: 1571,
              hlNowNum: 854,
              hlPe: 1456,
            },

            {
              addrees: '嘉禾望岗片区',
              // time: 2021 - 02 - 27 15: 36,
              thresholdNum: 20006,
              totalNum: 14203,
              qjNowNum: 2481,
              qjPe: 4923,
              mpNowNum: 3261,
              mpPe: 7826,
              hlNowNum: 8461,
              hlPe: 7256
            },
            {
              addrees: '开发区西区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 4548,
              totalNum: 310,
              qjNowNum: 90,
              qjPe: 1119,
              mpNowNum: 158,
              mpPe: 1779,
              hlNowNum: 62,
              hlPe: 1649
            },
            {
              addrees: '智慧城核心片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 7088,
              totalNum: 6683,
              qjNowNum: 2036,
              qjPe: 1744,
              mpNowNum: 2475,
              mpPe: 2772,
              hlNowNum: 2172,
              hlPe: 2570
            },
            {
              addrees: '开发区东区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 2599,
              totalNum: 2484,
              qjNowNum: 111,
              qjPe: 639,
              mpNowNum: 609,
              mpPe: 1016,
              hlNowNum: 1764,
              hlPe: 942
            },
            {
              addrees: '白云区北部片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 18118,
              totalNum: 1264,
              qjNowNum: 339,
              qjPe: 4459,
              mpNowNum: 589,
              mpPe: 7087,
              hlNowNum: 336,
              hlPe: 6571
            },
            {
              addrees: '科学城片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 3868,
              totalNum: 6495,
              qjNowNum: 1477,
              qjPe: 951,
              mpNowNum: 1586,
              mpPe: 1513,
              hlNowNum: 3432,
              hlPe: 1402
            },
            {
              addrees: '江高片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 14310,
              totalNum: 8273,
              qjNowNum: 771,
              qjPe: 3521,
              mpNowNum: 1580,
              mpPe: 5597,
              hlNowNum: 5922,
              hlPe: 5190
            },
            {
              addrees: '鱼珠-文冲片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 10094,
              totalNum: 14395,
              qjNowNum: 2895,
              qjPe: 2484,
              mpNowNum: 4757,
              mpPe: 3948,
              hlNowNum: 6743,
              hlPe: 3661
            },
            {
              addrees: '珠江新城片区',
              // time: 2021 - 02 - 27 15: 36,
              thresholdNum: 9152,
              totalNum: 17104,
              qjNowNum: 3586,
              qjPe: 2252,
              mpNowNum: 6155,
              mpPe: 3580,
              hlNowNum: 7363,
              hlPe: 3319
            },
            {
              addrees: '广州大学城',
              // time: 2021 - 02 - 27 15: 36,
              thresholdNum: 9000,
              totalNum: 22208,
              qjNowNum: 2717,
              qjPe: 2215,
              mpNowNum: 5360,
              mpPe: 3520,
              hlNowNum: 14131,
              hlPe: 3264
            },
            {
              addrees: '金沙洲片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 3002,
              totalNum: 3753,
              qjNowNum: 410,
              qjPe: 738,
              mpNowNum: 3085,
              mpPe: 1174,
              hlNowNum: 258,
              hlPe: 1088
            },
            {
              addrees: '白云湖片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 18111,
              totalNum: 19027,
              qjNowNum: 4346,
              qjPe: 4457,
              mpNowNum: 5408,
              mpPe: 7084,
              hlNowNum: 9273,
              hlPe: 6568
            },
            {
              addrees: '西场片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 5340,
              totalNum: 7182,
              qjNowNum: 1993,
              qjPe: 1314,
              mpNowNum: 2796,
              mpPe: 2088,
              hlNowNum: 2393,
              hlPe: 1936
            },
            {
              addrees: '海珠西片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 27364,
              totalNum: 20662,
              qjNowNum: 4007,
              qjPe: 6734,
              mpNowNum: 9929,
              mpPe: 10704,
              hlNowNum: 6726,
              hlPe: 9924
            },
            {
              addrees: '西关片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 6150,
              totalNum: 9938,
              qjNowNum: 2435,
              qjPe: 1513,
              mpNowNum: 3737,
              mpPe: 2405,
              hlNowNum: 3766,
              hlPe: 2230
            },
            {
              addrees: '燕岗片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 8561,
              totalNum: 9875,
              qjNowNum: 2220,
              qjPe: 2106,
              mpNowNum: 3699,
              mpPe: 3348,
              hlNowNum: 3956,
              hlPe: 3105
            },
            {
              addrees: '大坦沙片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 5943,
              totalNum: 2121,
              qjNowNum: 980,
              qjPe: 232,
              mpNowNum: 601,
              mpPe: 368,
              hlNowNum: 540,
              hlPe: 342
            },
            {
              addrees: '五山-汇景片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 7747,
              totalNum: 15871,
              qjNowNum: 4409,
              qjPe: 1906,
              mpNowNum: 6118,
              mpPe: 3030,
              hlNowNum: 5344,
              hlPe: 2809
            },
            {
              addrees: '生物岛片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 4119,
              totalNum: 5071,
              qjNowNum: 1047,
              qjPe: 1013,
              mpNowNum: 1444,
              mpPe: 1611,
              hlNowNum: 2580,
              hlPe: 1493
            },
            {
              addrees: '石围塘片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 3529,
              totalNum: 6464,
              qjNowNum: 775,
              qjPe: 868,
              mpNowNum: 3794,
              mpPe: 1380,
              hlNowNum: 1895,
              hlPe: 1279
            },
            {
              addrees: '矿泉片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 1531,
              totalNum: 2828,
              qjNowNum: 817,
              qjPe: 376,
              mpNowNum: 1054,
              mpPe: 598,
              hlNowNum: 957,
              hlPe: 555
            },
            {
              addrees: '琶洲岛片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 5171,
              totalNum: 8105,
              qjNowNum: 1522,
              qjPe: 1272,
              mpNowNum: 3504,
              mpPe: 2022,
              hlNowNum: 3079,
              hlPe: 1875
            },
            {
              addrees: '黄花岗片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 3085,
              totalNum: 4130,
              qjNowNum: 1097,
              qjPe: 759,
              mpNowNum: 1461,
              mpPe: 1206,
              hlNowNum: 1572,
              hlPe: 1118
            },
            {
              addrees: '东山片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 7431,
              totalNum: 16585,
              qjNowNum: 4548,
              qjPe: 1828,
              mpNowNum: 5768,
              mpPe: 2906,
              hlNowNum: 6269,
              hlPe: 2695
            },
            {
              addrees: '海珠东片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 4460,
              totalNum: 11741,
              qjNowNum: 3018,
              qjPe: 1097,
              mpNowNum: 3809,
              mpPe: 1744,
              hlNowNum: 4914,
              hlPe: 1617
            },
            {
              addrees: '登封片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 1337,
              totalNum: 1076,
              qjNowNum: 253,
              qjPe: 329,
              mpNowNum: 507,
              mpPe: 523,
              hlNowNum: 316,
              hlPe: 484
            },
            {
              addrees: '流花片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 2557,
              totalNum: 6542,
              qjNowNum: 1657,
              qjPe: 629,
              mpNowNum: 2299,
              mpPe: 1000,
              hlNowNum: 2586,
              hlPe: 927
            },
            {
              addrees: '长洲岛片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 704,
              totalNum: 5248,
              qjNowNum: 876,
              qjPe: 173,
              mpNowNum: 1630,
              mpPe: 275,
              hlNowNum: 2742,
              hlPe: 255
            },
            {
              addrees: '奥体片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 15353,
              totalNum: 18219,
              qjNowNum: 4021,
              qjPe: 3778,
              mpNowNum: 5901,
              mpPe: 6005,
              hlNowNum: 8297,
              hlPe: 5568
            },
            {
              addrees: '广州塔片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 12261,
              totalNum: 10075,
              qjNowNum: 2138,
              qjPe: 3017,
              mpNowNum: 3158,
              mpPe: 4796,
              hlNowNum: 4779,
              hlPe: 4446
            },
            {
              addrees: '香雪片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 1963,
              totalNum: 1707,
              qjNowNum: 185,
              qjPe: 483,
              mpNowNum: 309,
              mpPe: 767,
              hlNowNum: 1213,
              hlPe: 711
            },
            {
              addrees: '天河公园片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 15773,
              totalNum: 19603,
              qjNowNum: 4815,
              qjPe: 3881,
              mpNowNum: 7855,
              mpPe: 6170,
              hlNowNum: 6933,
              hlPe: 5720
            },
            {
              addrees: '员村片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 7248,
              totalNum: 13220,
              qjNowNum: 3817,
              qjPe: 1783,
              mpNowNum: 4128,
              mpPe: 2835,
              hlNowNum: 5275,
              hlPe: 2628
            },
            {
              addrees: '东沙片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 2240,
              totalNum: 3787,
              qjNowNum: 393,
              qjPe: 551,
              mpNowNum: 2350,
              mpPe: 876,
              hlNowNum: 1044,
              hlPe: 812
            },
            {
              addrees: '龙溪片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 2467,
              totalNum: 9030,
              qjNowNum: 1386,
              qjPe: 607,
              mpNowNum: 5650,
              mpPe: 965,
              hlNowNum: 1994,
              hlPe: 894
            },
            {
              addrees: '芳村大道东片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 2967,
              totalNum: 2960,
              qjNowNum: 334,
              qjPe: 730,
              mpNowNum: 1517,
              mpPe: 1160,
              hlNowNum: 1109,
              hlPe: 1076
            },
            {
              addrees: '天河路片区',
              // time: 2021 - 02 - 2715: 36,
              thresholdNum: 19938,
              totalNum: 15442,
              qjNowNum: 3447,
              qjPe: 4907,
              mpNowNum: 6415,
              mpPe: 7799,
              hlNowNum: 5580,
              hlPe: 7231
            },

          ],
          nowDate: null,
          timer: null,
        })
        const dealWithTime = (data:any)=>{
          let Y = data.getFullYear();
          let M = data.getMonth() + 1;
          let D = data.getDate();
          let H = data.getHours();
          let Min = data.getMinutes();
          let W = data.getDay();
          H = H < 10 ? "0" + H : H;
          Min = Min < 10 ? "0" + Min : Min;
          switch (W) {
            case 0:
              W = "日";
              break;
            case 1:
              W = "一";
              break;
            case 2:
              W = "二";
              break;
            case 3:
              W = "三";
              break;
            case 4:
              W = "四";
              break;
            case 5:
              W = "五";
              break;
            case 6:
              W = "六";
              break;
            default:
              break;
          }
          dataMap.nowDate = Y + '-' + (M < 10 ? "0" + M : M) + '-' + D + '   ' + (Min - 15 <= 0 ? H - 1 : H) + ':' + (Min - 15 <= 0 ? Min + 45 : (Min - 15 < 10 ? "0" + (Min - 15) : Min));
        }
        const scrollbarbox = ref(null)
        const theBoxScroll = ()=> {
          if (props.loop) {
            let divData = scrollbarbox.value
            dataMap.timer = setInterval(() => {
              divData.scrollTop += 2;
              if (
                  parseInt(divData.clientHeight + divData.scrollTop) ==
                  divData.scrollHeight
              ) {
                divData.scrollTop = 0;
              }
            }, 50);

            divData.onmouseenter = () => {
              clearInterval(dataMap.timer)
              dataMap.timer = null
            }

            divData.onmouseleave = () => {
              dataMap.timer = setInterval(() => {
                divData.scrollTop += 2
                if (parseInt(divData.clientHeight + divData.scrollTop) == divData.scrollHeight) {
                  divData.scrollTop = 0
                }
              }, 50)
            }
          }
        }
        onMounted(()=>{
              dealWithTime(new Date());
              // 定时刷新时间
              dataMap.timer = setInterval(() => {
                  dealWithTime(new Date()) // 修改数据date
              }, 1000);
              theBoxScroll();
        })
        return{
          ...toRefs(dataMap),
          dealWithTime,
          theBoxScroll,
          scrollbarbox
        }
      }
    })
</script>
<style lang="less" scoped>
    .scrollBox-wrap {
        padding: 0.02rem 0.04rem 0.04rem 0.04rem;
        width: 98%;
        height: 100%;
        overflow-y: auto;
        background: url("images/bg.png") no-repeat;
        background-size: 100% 100%;
        font-size: 0.2rem;
        cursor: pointer;
        .the-item-box {
            margin-top: 0.2rem;
            .the-box {
                width: 100%;
                display: flex;
                line-height: 0.2rem;
            }

            .the-color-box {
                span:nth-of-type(1) {
                    width: 0.4rem;
                    height: 0.4rem;
                    display: block;
                    margin-right: 0.6rem;
                }

                span:nth-of-type(3) {
                    color: #00b5b9;
                }
            }

            .the-num-color {
                span:nth-of-type(2) {
                    strong {
                        color: #55a532;
                    }
                }
            }

            .w50 {
                width: 50%;
                text-align: center;
            }

            .w33 {
                width: 33.33%;
                text-align: center;
            }
        }
    }
</style>
