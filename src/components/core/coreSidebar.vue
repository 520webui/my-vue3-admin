<template>
    <div class="coreSidebar-wrap">
        <div v-for="(item,index) in theMenu"
             :key="index"
             :class="[{'targetActive':index === $store.state.theTargetIndex}]"
             @click="clickHandle(item,index)">
            <div class="the-menu-item">
              <el-tooltip
                  v-if="store.state.isCollapse"
                  class="box-item"
                  effect="dark"
                  :content=item.text
                  placement="right"
              >
                <span :class="[{'isCollapseWidth':store.state.isCollapse}]">
                    <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
                </span>
              </el-tooltip>
              <span v-else>
                 <el-icon>
                        <component :is="item.icon" />
                    </el-icon>
              </span>
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    :content=item.text
                    placement="right"
                >
                  <span v-if="!store.state.isCollapse">{{item.text}}</span>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
import { i18n } from '@/lang/index';
export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    const t = i18n.global.t;
    const dataMap = reactive({
      theMenu: [
        {
          id: 1,
          name: 'myVue',
          query: 'myVue',
          icon: 'Edit',
          text: t('menu.myVue')
        },
        {
          id: 2,
          name: 'canvas',
          query: 'canvas',
          icon: 'DocumentAdd',
          text: t('menu.canvas')
        },
        {
          id: 3,
          name: 'threeJs',
          query: 'threeJs',
          icon: 'Document',
          text: t('menu.threeJs')
        },
        {
          id: 4,
          name: 'transform',
          query: 'transform',
          icon: 'Notebook',
          text: t('menu.transform')
        },
        {
          id: 5,
          name: 'personSearch',
          query: 'personSearch',
          icon: 'Tickets',
          text: t('menu.personSearch')
        },
        {
          id: 6,
          name: 'dynamicsJs',
          query: 'dynamicsJs',
          icon: 'Memo',
          text: t('menu.dynamicsJs')
        },
        {
          id: 7,
          name: 'greenSock',
          query: 'greenSock',
          icon: 'Collection',
          text: t('menu.greenSock')
        },
        {
          id: 8,
          name: 'Es6',
          query: 'Es6',
          icon: 'Postcard',
          text: t('menu.Es6')
        },
        {
          id: 9,
          name: 'javaScript',
          query: 'javaScript',
          icon: 'ScaleToOriginal',
          text: t('menu.javaScript')
        },
        {
          id: 10,
          name: 'echarts',
          query: 'echarts',
            icon: 'Edit',
          text: t('menu.echarts')
        },
        {
          id: 11,
          name: 'contenteditable',
          query: 'contenteditable',
          icon: 'DocumentDelete',
          text: t('menu.contenteditable')
        },
        {
          id: 12,
          name: 'electronjs',
          query: 'electronjs',
          icon: 'DocumentChecked',
          text: t('menu.electronjs')
        },
        {
          id: 13,
          name: 'markdown',
          query: 'markdown',
          icon: 'DataBoard',
          text: t('menu.markdown')
        },
        {
          id: 14,
          name: 'vue3',
          query: 'vue3',
          icon: 'DataAnalysis',
          text: t('menu.vue3')
        },
      ],
    });
    // const lang = computed({})
   const clickHandle=(item: { id: any; name: any; }, index: any)=>{
     if (item.id !== store.state.activeTag.id) {
       store.state.activeTag = {};
       store.state.activeTag = item;
     }
     store.state.theTargetIndex = index;
     store.dispatch('addTags', item);
     router.push({ name: item.name });
   }
    onMounted(()=>{})
    // 监听单个普通类型
      /* watch(
          () => store.state.langTargetIndex,
          (newVal, oldVal) => {
           if (newVal === 1) {
                 dataMap.theMenu = dataMap.cnMenu;
            }
            if (newVal === 2) {
                 dataMap.theMenu = dataMap.enMenu;
            }
            if (newVal === 3) {
                 dataMap.theMenu = dataMap.jpMenu;
            }
      })*/
    return{
      ...toRefs(dataMap),
      clickHandle,
      // lang,
      store
    }
  }
})
</script>
<style lang="less" scoped>
    .coreSidebar-wrap{
      background-color: #333;
      width: 100%;
      height: 100%;
      color: #fff;
        overflow-y: auto;
      .the-menu-item{
        height: 0.5rem;
        line-height: 0.5rem;
        cursor: pointer;
        font-size: 0.14rem;
        border-bottom: 1px solid #ccc;
          display: flex;
          span:nth-of-type(1){
              width: 15%;
              text-align: center;
              /deep/.el-icon{
                  width:1em;
                  height:1em;
              }
          }
          span:nth-of-type(1).isCollapseWidth{
            width: 100%;
          }
          span:nth-of-type(2){
              width: 85%;
              text-align: left;
              overflow: hidden;
          }
      }
      .the-menu-item:hover{
        background-color: #666;
      }
      .targetActive{
        background-color: #666;
      }
    }
</style>
