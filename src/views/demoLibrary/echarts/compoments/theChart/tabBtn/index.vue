<template>
  <div class="medical-title-tab-wrap">
    <div
        class="title-tab-button"
        :class="[big ? 'title-tab-big-button' : 'title-tab-small-button',
      {'title-tab-target': item.value == targetTabIndex},
      {'title-tab-target': index == targetTabIndex},
      {'title-tab-no-open' : item.open ? item.open === '关闭'  : false}
      ]"
        @click="clickBtn(item,index)"
        :key="index"
        v-for="(item,index) in list"
    >
      <img v-if="eyesIcon" :src="eyesIconImg" />
      {{item.labelKey}}
      <div
          @click="Calendardisabled()"
          v-if="item.labelKey == '自定义时间'">
        <!-- 自定义时间组件 -->
        <!--&lt;!&ndash;<Calendar
            @emitDate="emitDate"
            :btnDisabled="watchTabClick"
            :onlyDate="onlyDate"
            :dateType="dateType"/>&ndash;&gt;-->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
    import eyes_close from './images/eyes_close.png'
    import eyes_open from './images/eyes_open.png'
    import {reactive, defineComponent, onMounted, ref, toRefs, computed, watch, defineProps} from 'vue';
    import { useStore } from "vuex"
    import { useRouter } from 'vue-router'
    const props = defineProps({
      targetTabIndex : { // tab 下标
        type : Number || String,
        default : 1
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
    })
    const emit = defineEmits<{
      (e: "clickTab"): void,
      (e: "emitDate"): void
    }>()
    const mapData = reactive({
      watchTabClick:false, // 用于关闭 Calendar 月份左右箭头 disabled 效果
      eyesIconImg : eyes_close,
    })
    const clickBtn = (item: { open: string; targetIndex: any; }, index: any) => {
      if(props.eyesIcon){}
      if(item.open ? item.open == '关闭' : false){
        return false
      }
      item.targetIndex = index;
      emit("clickTab",item);
    }
    const emitDate = (startTime: any, endTime: any) => {
      emit('emitDate',startTime,endTime)
    }
    const Calendardisabled = () => {
      mapData.watchTabClick = !mapData.watchTabClick
    }
    watch(()=>props.eyesIconImgFlag,(flag)=>{
      mapData.eyesIconImg = flag ? eyes_open : eyes_close
    },{deep: true})
</script>

<style lang="less" scope>
.medical-title-tab-wrap {
  display: flex;
  justify-content: flex-start;
  pointer-events:auto;
  position: relative;
  z-index: 2001;
  cursor: pointer;
  // margin: 0.2rem 0 0.2rem 0;
  .title-tab-button{
    background: rgba(79, 158, 253, 0.3);
    border: 1px solid #4F9EFD;
    color: #CBDDFF;
    border-radius: 5%;
    text-align: center;
    font-size: 0.2rem;
    font-weight: bold;
    height: 0.4rem;
    margin-right: 0.1rem;
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
      width: 0.24px;
      float: left;
      padding-right:10px;
    }
  }
  .title-tab-small-button {
    width: 2.88rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 0.1rem;
  }
  .title-tab-big-button{
    width: 5rem;
    padding: 0 0.2rem;
    height: 2.8rem;

  }
}
</style>
