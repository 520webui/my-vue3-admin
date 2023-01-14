<template>
    <el-config-provider :locale="localLanguage">
        <RouterView/>
    </el-config-provider>
</template>
<script lang="ts">
    import {reactive, defineComponent, computed,  onMounted, ref, toRefs,watchEffect } from 'vue';
    import {i18n} from '@/lang/index';
    export default defineComponent({
        setup() {
            const dataMap = reactive({})
            const locale = i18n.global.locale;
            const localLanguage = computed(() => {
                return i18n.global.messages[locale];
            });
            return{
                ...toRefs(dataMap),
                localLanguage
            }
         }
    })
</script>
<style lang="less">
#app {
  height: 100%;
  width: 100%;
}
</style>
