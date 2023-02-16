<template>

</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed} from 'vue';
import { useStore } from "vuex"
import {useRouter} from "vue-router";
import { ElMessage } from "element-plus";
import screenfull from "screenfull"

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter();
    const dataMap = reactive({

    })


    const props = defineProps({
      /** 全屏的元素，默认是 html */
      element: {
        type: String,
        default: "html"
      },
      /** 打开全屏提示语 */
      openTips: {
        type: String,
        default: "全屏"
      },
      /** 关闭全屏提示语 */
      exitTips: {
        type: String,
        default: "退出全屏"
      }
    })

    const tips = ref<string>(props.openTips)
    const isFullscreen = ref<boolean>(false)

    const click = () => {
      const dom = document.querySelector(props.element) || undefined
      if (!screenfull.isEnabled) {
        ElMessage.warning("您的浏览器无法工作")
        return
      }
      screenfull.toggle(dom)
    }

    const change = () => {
      isFullscreen.value = screenfull.isFullscreen
      tips.value = screenfull.isFullscreen ? props.exitTips : props.openTips
    }

    screenfull.on("change", change)
    onMounted(()=>{})
    return{
      ...toRefs(dataMap),
    }
  }
})
</script>

<style scoped>

</style>
