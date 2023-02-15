<template>
    <div class="coreHeader-wrap">
        <div class="the-title">
            <div v-if="!collapse">My DemoLibrary</div>
            <div v-else>My</div>
            <div class="the-collapse" @click.stop="handleCollapse">
                <el-icon v-if="!collapse">
                    <Fold/>
                </el-icon>
                <el-icon v-else>
                    <Expand/>
                </el-icon>
            </div>
        </div>
        <div class="the-user">
            <!--主题切换-->
            <div class="user-theme">
              <change-theme/>
            </div>
            <!--语言切换-->
            <div class="the-language">
                <div class="icon"></div>
                <div class="the-lang">{{lang}}</div>
                <div class="lang-list">
                    <div v-for="(item,index) in langList" :key="index" class="lang-list-item" @click="handleSetLanguage(item.value)">{{item.name}}</div>
                </div>
            </div>
            <!--个人信息-->
            <div class="user-info">
                {{'个人信息'}}
                <div class="info-list">
                    <div>{{'部门信息'}}</div>
                    <div @click="logout">{{'退出'}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {reactive, defineComponent, onMounted, ref, toRefs,computed} from 'vue';
import { useStore } from "vuex"
import {useRouter} from "vue-router";
import ChangeTheme from "@/components/changeTheme.vue";
export default defineComponent({
  components: {ChangeTheme},
  setup() {
    const store = useStore()
    const router = useRouter();
    const dataMap = reactive({
        langList: [
            {
                name: 'ZH 简体中文',
                value: 'zh-cn',
            },
            {
                name: 'EN English',
                value: 'en',
            },
            {
                name: 'JP 日本語の',
                value: 'ja',
            },
      ],
      language: 'ZH 简体中文',
      collapse: false,
    })
    const lang = computed({
      get () {
        return store.state.lang;
      },
      set (newValue) {
        return newValue;
      }
    })
    const handleSetLanguage = (lang: any) => {
        store.dispatch('changeLanguage',lang);
        location.reload();
    };
    const handleCollapse=()=>{
        dataMap.collapse = !dataMap.collapse;
        store.state.isCollapse = !store.state.isCollapse;
    };
    const logout = () => {
      localStorage.removeItem('loginToken');
      router.push('/login');
    }
    onMounted(()=>{})
    return{
      ...toRefs(dataMap),
      handleSetLanguage,
      handleCollapse,
      logout,
      lang,
      store
    }
  }
})
</script>

<style lang="less" scoped>
  .coreHeader-wrap{
    height:100%;
    width: 100%;
    background-color: #000;
    line-height: 0.5rem;
    color: #fff;
    display: flex;
    .the-title{
      margin-left: 0.2rem;
      font-weight: bolder;
      font-size: 0.2rem;
      float: left;
      width: 30%;
      display: flex;
        .the-collapse{
            cursor: pointer;
            margin-left: 20px;
            .el-icon{
                margin-top: 18px;
            }
        }
    }
    .the-user{
      width: 70%;
      margin-right: 0.6rem;
      font-size: 0.18rem;
      position: relative;
        .user-theme{
          width: 100px;
          // height: 50px;
          line-height: 50px;
          text-align: center;
          position: absolute;
          right: 300px;
          top: 0;
        }
        .the-language{
            height: 50px;
            width: 150px;
            line-height: 50px;
            text-align: center;
            position: absolute;
            right: 150px;
            top: 0;
            cursor: pointer;
            display: flex;
            z-index: 9999999;
            .icon {
              display: inline-block;
              width: 18px;
              height: 18px;
              margin-right: 5px;
              background: transparent url("./assets/language_icon.png") no-repeat center center / 100% 100%;
              margin-top: 14px;
            }
            .the-lang{
              margin-left: 6px;
            }
            .lang-list{
                display: none;
                position: absolute;
                bottom: -110px;
                background: #0F5080;
                padding: 10px;
              .lang-list-item{
                width: 120px;
                height: 30px;
                text-align: left;
                line-height: 30px;
              }
              .lang-list-item:hover{
                background: #4F9EFD;
              }
            }
        }
        .user-info{
          position: absolute;
          right: 50px;
          cursor: pointer;
          width: 100px;
          .info-list{
            display: none;
            position: absolute;
            right: 0;
            bottom: -120px;
            background: #0F5080;
            padding: 10px;
            z-index: 11;
          }
        }
        .the-language:hover{
            .the-lang{
              color: #0e6de9;
            }
            .lang-list{
              display: block;
            }
        }
        .user-info:hover{
          .info-list{
            display: block;
          }
        }
    }
  }
</style>
