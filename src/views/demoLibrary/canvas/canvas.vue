<template>
    <div>{{'canva====>>>'}}</div>
</template>

<script lang="ts">
    import {reactive, defineComponent, onMounted, ref, toRefs,computed,watch } from 'vue';
    import {useStore} from "vuex";
    import {useRouter} from "vue-router";

    export default defineComponent({
        setup() {
            const store = useStore();
            const router = useRouter();
            const dataMap = reactive({

            })
            return{
                ...toRefs(dataMap),
            }
        }
    });
</script>
<style scoped>

</style>
