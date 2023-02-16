<template>
  <el-dropdown trigger="click" @command="handleSetTheme">
    <div>
      <el-tooltip effect="dark" content="主题模式" placement="bottom">
        <el-icon :size="20" style="margin-top: 15px;color: #fff">
          <MagicStick />
        </el-icon>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
            v-for="(theme, index) in themeList"
            :key="index"
            :disabled="activeThemeName === theme.name"
            :command="theme.name"
        >
          <span>{{ theme.title }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed} from 'vue';
import { useStore } from "vuex"
import {useRouter} from "vue-router";
import{ ThemeName, useTheme } from "@/hooks/useTheme"
import { MagicStick } from "@element-plus/icons-vue"

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter();
    const dataMap = reactive({

    })
    const { themeList, activeThemeName, setTheme } = useTheme()

    const handleSetTheme = (name: ThemeName) => {
      setTheme(name)
    }
    onMounted(()=>{})
    return{
      ...toRefs(dataMap),
      handleSetTheme,
      themeList,
      MagicStick,
      activeThemeName
    }
  }
})
</script>

<style scoped>

</style>
