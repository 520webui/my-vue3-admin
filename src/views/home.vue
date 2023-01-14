<template>
  <div class="home-wrap">
    <!--顶部导航信息-->
    <div class="the-header">
      <core-header/>
    </div>
    <div class="the-content">
      <!--侧边导航栏-->
      <div class="the-siderbar" :class="[{'isCollapse-the-siderbar': $store.state.isCollapse}]">
        <core-sidebar/>
      </div>
      <div class="the-content-box" :class="[{'isCollapse-the-content-box': $store.state.isCollapse}]">
        <!--选中导航标签-->
          <core-tags-nav/>
        <div class="scroll-wrapper" @scroll="scroll">
            <router-view v-slot="{ Component }">
                <transition name="move" mode="out-in">
                    <keep-alive :include="keepAlive.value">
                        <component :is="Component"></component>
                    </keep-alive>
                </transition>
            </router-view>
        </div>
      </div>
    </div>
    <div v-show="backTop"
         style="position:fixed;right:0;bottom:200px;cursor:pointer;z-index:9999;color:#1890ff;"
         @click="backToTop">
      <el-tooltip content='返回顶部'>
          <el-icon style="font-size:60px;"><CaretTop/></el-icon>
      </el-tooltip>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs} from 'vue';
import CoreHeader from "@/components/core/coreHeader.vue";
import CoreSidebar from "@/components/core/coreSidebar.vue";
import CoreTagsNav from "@/components/core/coreTagsNav.vue";
import keepAlive from '../keepAlive';
import { useStore } from "vuex"
export default defineComponent({
  components: {CoreTagsNav, CoreHeader,CoreSidebar},
  setup() {
        const store = useStore();
        const dataMap = reactive({
          keepAlive:keepAlive,
          backTop: false,
        })
      // 点击返回顶部  的距离
      let dom: { scrollTop: any; } | null = null;  // 定义全局的变量，来记录滚动盒子的dom元素
      let num = 0;     // 滚动盒子的高度
      const scroll = (e: { target: { scrollTop: number; }; }) => {     // e 是事件对象
          num = e.target.scrollTop;        // 滚动条距离顶部的距离
          dom = e.target;     // 滚动盒子
          if (num > 400) {
              dataMap.backTop = true;        // 大于400，就显示
          } else {
              dataMap.backTop = false;         // 小于400，就隐藏
          }
      }
      const backToTop=()=>{
          let time = setInterval(() => {
              if (num <= 0) {
                  clearInterval(time); // 清空
              } else {
                  num = num - 20;
                  dom.scrollTop = num;
              }
          }, 10);
      }
    onMounted(()=>{})
    return{
      ...toRefs(dataMap),
        backToTop,
        scroll,
        store
    }
  }
})
</script>

<style lang="less" scoped>
.home-wrap{
   width: 100%;
   height: 100%;
   overflow: hidden;
  .the-header{
    width: 100%;
    height: 0.5rem;
  }
  .the-content{
    display: flex;
    width: 100%;
    height: calc(100% - 0.5rem);
    .the-siderbar{
      width: 1.5rem;
    }
    .isCollapse-the-siderbar{
      width: 0.5rem;
    }
    .the-content-box{
      width: calc(100% - 1.5rem);
      .scroll-wrapper{
        height: calc(100% - 0.8rem);
        overflow-x:hidden;
        overflow-y: auto;
        background: #f2f2f2;
        padding: 0.1rem 0 0.1rem 0.1rem;
      }
    }
      .isCollapse-the-content-box{
        width: calc(100% - 0.5rem);
    }
  }
}
</style>
