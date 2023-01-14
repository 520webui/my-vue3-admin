<template>
    <div class="coreTagsNav-wrap">
        <div v-for="(item,index) in $store.getters.tags"
             :key="index"
             class="tagsList-box"
             :class="{ active: $store.getters.activeTag.id === item.id}"
        >
            <div class="m-tag-text" @click="goToTag(item)">{{item.text}}
                <el-icon v-if="item.id !== 1" class="m-icon-ios-close-empt" @click.stop="closeTags(item)"><Close /></el-icon>
            </div>
        </div>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="small" type="primary">
                    标签选项
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="small">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>
<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
    import { useStore } from "vuex"
    import { useRouter,useRoute } from 'vue-router'
    export default defineComponent({
        setup() {
            const store = useStore();
            const router = useRouter();
            const route = useRoute();
            const dataMap = reactive({})
            onMounted(()=>{
                // store.dispatch('addTags', route);
                closeAll();// 重刷页面的时候
            })
            const closeTags = (item: any)=>{
                store.dispatch('closeTag', item);
                if(store.getters.activeTag.name==='myVue'){
                    router.push('/');
                    store.state.theTargetIndex=0;
                } else {
                    store.state.theTargetIndex = store.state.activeTag.id -1
                    router.push({ name: store.getters.activeTag.name });
                }
            }
            const goToTag = (item: { id: number; name: any; })=>{
                if (item.id !== store.state.activeTag.id) {
                    store.state.activeTag = {};
                    store.state.activeTag = item;
                }
                store.state.theTargetIndex = store.state.activeTag.id -1
                router.push({ name: store.state.activeTag.name });
            }
            const closeOther=()=>{
                store.dispatch('closeOther');
                router.push({ name: store.state.activeTag.name });
            }
            const closeAll=()=>{
                router.push('/');
                store.dispatch('closeAllTag');
            }
            const handleTags=(command: string)=>{
                command === 'other' ? closeOther() : closeAll();
            }
            return{
                ...toRefs(dataMap),
                closeTags,
                handleTags,
                closeOther,
                closeAll,
                goToTag
            }
        }
    })
</script>

<style lang="less" scoped>
  .coreTagsNav-wrap{
     height: 0.4rem;
     line-height: 0.4rem;
     width: 100%;
     background-color: #727272;
     color: #fff;
     display: flex;
     position: relative;
    .tagsList-box{
      height: 0.3rem;
      padding: 0 0.2rem;
      border: 1px solid #999;
      text-align: center;
      line-height: 0.35rem;
      margin-left: 0.08rem;
      margin-top: 0.033rem;
      cursor: pointer;
      background-color: #4c5156;
    }
    .active {
      .m-tag-text {
        color: #318BF5 !important;
      }
      .m-icon-ios-close-empty {

        color: #318BF5 !important;
      }
    }
     .tags-close-box {
          position: absolute;
          right: 0;
          top: 6px;
          box-sizing: border-box;
          padding-top: 1px;
          text-align: center;
          width: 110px;
          height: 30px;
          z-index: 10;
    }
  }
</style>
