<template>
  <div class="medical-title-tab-wrap">
    <div
        class="title-tab-button"
        :class="[big ? 'title-tab-big-button' : 'title-tab-small-button',
      {'title-tab-target': item.value == targetTabIndex},
      {'title-tab-target': index == targetTabIndex},
      {'title-tab-no-open' : item.open ? item.open === '关闭'  : false}
      ]"
        @click="clickHandle(item,index)"
        :key="index"
        v-for="(item,index) in list"
    >
      <img v-if="eyesIcon" :src="eyesIconImg" />
      {{item.labelKey}}
      <div
          @click="Calendardisabled()"
          v-if="item.labelKey == '自定义时间'">
        <!-- 自定义时间组件 -->
<!--        &lt;!&ndash;<Calendar
            @emitDate="emitDate"
            :btnDisabled="watchTabClick"
            :onlyDate="onlyDate"
            :dateType="dateType"/>&ndash;&gt;-->
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/components/calendar'
import eyes_close from './images/eyes_close.png'
import eyes_open from './images/eyes_open.png'
export default {
  // props: ["targetTabIndex", "list","big","onlyDate","eyesIcon"],
  props :{
    targetTabIndex : { // tab 下标
      type : String | Number,
      default : 2
    },
    list : { // tab 渲染列表
      type : Array,
      default : [{labelKey:'tabName'}] // 如果 labelKey 为 "自定义时间" 则 默认多选日期功能
    },
    big : {
      type : Boolean,
      default : false
    },
    onlyDate : { // 自定义时间 单选日期 默认多选日期
      type : Boolean,
      default : false,
    },
    eyesIcon : { // 眼睛icon图标
      type : Boolean,
      default : false
    },
    eyesIconImgFlag : { // 眼睛icon图标 切换
      type : Boolean,
      default : false
    },
    dateType : { // 选择年 月 日
      type : String,
      default : 'date'
    }
  },
  name:'title-tab',
  data() {
    return {
      watchTabClick:false, // 用于关闭 Calendar 月份左右箭头 disabled 效果
      eyesIconImg : eyes_close,
    };
  },
  components :{Calendar},
  created () {

  },
  methods: {
    clickHandle(item, index) {
      if(this.eyesIcon){

      }
      if(item.open ? item.open == '关闭' : false){
        console.log(item.open,'item.openitem.open')
        return false
      }
      item.targetIndex = index;
      this.$emit("clickTab",item);
    },
    emitDate(startTime,endTime){
      this.$emit('emitDate',startTime,endTime)
      // let item = {
      //   targetIndex : this.list.length - 1 ,
      //   labelKey : '自定义时间'
      // }
      // this.$emit("clickTab",item);
    },
    Calendardisabled(){
      this.watchTabClick = !this.watchTabClick
    },
  },
  watch: {
    eyesIconImgFlag: { // 切换眼睛图标
      handler (flag) {
        this.eyesIconImg = flag ? eyes_open : eyes_close
      }
    }
  },


};
</script>

<style lang="less" scope>
.medical-title-tab-wrap {
  display: flex;
  justify-content: flex-start;
  pointer-events:auto;
  position: relative;
  z-index: 2001;
  cursor: pointer;
  margin: 0.02rem 0 0.02rem 0;
  .title-tab-button{
    background: rgba(79, 158, 253, 0.3);
    border: 1px solid #4F9EFD;
    color: #CBDDFF;
    border-radius: 5%;
    text-align: center;
    // font-size: 0.048rem;
    font-size: 0.04rem;
    font-weight: bold;
    height: 0.08rem;
    margin-right: 0.01rem;
    position: relative;
    line-height: normal;
    &.title-tab-target {
      background: #4F9EFD;
      border: 1px solid #4F9EFD;
      color: #fff;
      box-shadow:none;
    }
    &.title-tab-no-open{
      background: rgba(148,154,160,0.3);
      border-color: #828b97;
      cursor:not-allowed ;
    }
    img{
      width: 24px;
      float: left;
      padding-right:10px;
    }
  }
  .title-tab-small-button {
    width: 0.288rem;
    display: flex;
    align-items: center;
    justify-content: center;
    // width: 0.62rem;
    // padding: 0.005rem 0.015rem;
    // height: 0.05rem;
    // box-shadow:RGBA(37, 68, 122, 1) 0px 0px 18px inset;
    position: relative;
  }
  .title-tab-big-button{
    width: 1.02rem;
    padding: 0 0.02rem;
    height: 0.56rem;

  }
}
</style>
