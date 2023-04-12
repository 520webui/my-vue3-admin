<template>
    <div class="coreTagsNav-wrap">
        <div v-for="(item,index) in $store.getters.tags"
             :key="index"
             class="tagsList-box"
             :class="{ active: $store.getters.activeTag.id === item.id}">
            <div class="m-tag-text" @click="goToTag(item)">{{item.text}}
                <el-icon v-if="item.id !== 1" class="m-icon-ios-close-empt" style="position: absolute" @click.stop="closeTags(item)"><Close /></el-icon>
            </div>
        </div>
        <div class="tags-close-box">
            <el-dropdown trigger="click" @command="handleTags">
                <el-button size="small" type="primary">
                    标签选项
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu style="overflow-y: auto;max-height: 300px" size="small">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item v-for="tag in theTags"
                                          :key="tag.name"
                                          :name="tag.name"
                                          :class="{'clickIndex':$store.getters.activeTag.id === tag.id}"
                                          @click="handleSwitchTag(tag)">{{tag.name}}
                        </el-dropdown-item>
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
            const dataMap = reactive({
              theTags:[],
              theActiveTag:{},
            })
            onMounted(()=>{
                // store.dispatch('addTags', route);
                closeAll();// 重刷页面的时候
                dataMap.theTags=store.state.tags;
                dataMap.theActiveTag=store.state.activeTag;
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
            const handleSwitchTag = (tag: any) => {
              goToTag(tag);
            }
            const closeOther=()=>{
                store.dispatch('closeOther');
                router.push({ name: store.state.activeTag.name });
                dataMap.theTags = store.state.tags;
                dataMap.theActiveTag = store.state.activeTag;
            }
            const closeAll=()=>{
                router.push('/');
                store.dispatch('closeAllTag');
                dataMap.theTags = store.state.tags;
                dataMap.theActiveTag = store.state.activeTag;
            }
            const handleTags=(command: any)=>{
              if(command === 'other' || command === 'all'){
                command === 'other' ? closeOther() : closeAll();
              }
            }
            return{
                ...toRefs(dataMap),
                closeTags,
                handleTags,
                closeOther,
                closeAll,
                handleSwitchTag,
                goToTag
            }
        }
    })
</script>

<style lang="less" scoped>
  .coreTagsNav-wrap{
     height: 0.4rem;
     line-height: 0.4rem;
     // width: 100%;
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
      overflow: visible;
      white-space: nowrap;
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
      top: 0;
      box-sizing: border-box;
      padding-top: 10px;
      text-align: center;
      width: 110px;
      height: 0.4rem;
      z-index: 10;
      overflow: hidden;
      background-color: #727272;
    }
  }
</style>
<style lang="less">
.clickIndex{
  background: #318BF5 !important;
  color: #fff;
  margin-top: 5px !important;
}
</style>
