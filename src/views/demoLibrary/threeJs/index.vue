<template>
  <div class="container-wrap">
    <div class="itme-box">
      {{'threeJs'}}
    </div>
    <div class="itme-box">
    </div>
    <div class="itme-box">
    </div>
    <div class="itme-box itme-box-relative"></div>
    <div class="itme-box itme-box-relative"></div>
    <div class="itme-box">{{$t('menu.myVue')}}</div>
    <div class="itme-box">{{$t('table.tOperation')}}</div>
    <div class="itme-box itme-box-relative">
      {{$t('mpanel.submit')}}
    </div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
    <div class="itme-box"></div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
import { useStore } from "vuex"
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const dataMap = reactive({})
    return{
      ...toRefs(dataMap),
    }
  }
})
</script>

<style lang="less" scoped>
.container-wrap{
  .itme-box{
    float: left;
    margin-right: 0.1rem;
    margin-top: 0.1rem;
    width: 49%;
    height: 2.9rem;
    border-radius: 10px;
    background-color: #1b67c3;
    line-height: 2.9rem;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
    position: relative;
  }
}
</style>
