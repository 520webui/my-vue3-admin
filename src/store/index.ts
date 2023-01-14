import { createStore } from "vuex";
import { i18n } from '@/lang/index';
const t = i18n.global.t;
// @ts-ignore
import { getLanguage, setLanguage, setSettings, getSettings } from '@/plugins/cookies';
const index = createStore({
    state: () => {
        return {
            tags: [{ id: 1, name: 'myVue', query: 'myVue',text: t('menu.myVue') }],
            activeTag: { id: 1, name: 'myVue', query: 'myVue',text: t('menu.myVue') },
            theTargetIndex: 0,
            lang: getLanguage() || 'zh-cn',
            isCollapse: false,
            // langTargetIndex: 1,
        };
    },
    getters: {
        tags (state) {
            return state.tags;
        },
        activeTag (state) {
            return state.activeTag;
        },
        theTargetIndex (state) {
            return state.theTargetIndex;
        },
       /* langTargetIndex (state) {
            return state.langTargetIndex;
        },*/
        lang: (state) => state.lang,
    },
    mutations: {
        // 新增标签
        ADD_TAGS (state, tag) {
            if (state.tags.filter(item => item.name === tag.name).length === 0) {
                if (tag.name === 'myVue') {
                    state.tags.unshift(tag);
                } else {
                    state.tags.push(tag);
                }
                state.activeTag = tag;
            }
        },
        // 删除标签
        CLOSE_TAG (state, tag) {
            let index = -1;
            state.tags.forEach((item, i) => {
                // 首页不允许删除
                if (item.name === 'myVue') {
                    return
                }
                if (item.name === tag.name) {
                    index = i;
                }
            });
            if (index > -1) {
                state.tags.splice(index, 1);
                if (tag.name === state.activeTag.name) {
                    [state.activeTag] = [state.tags[index] ? state.tags[index] : state.tags[index - 1]]; // 关闭标签页后，优先高亮下一个标签页，如果没有下一个则高亮上一个
                }
            }
            // 删除完剩下最后一项得时候 左侧导航当前状态回归
           /* if (state.tags.length === 1) {
                state.theTargetIndex = 0;
            } else {
                state.theTargetIndex = state.activeTag.id - 1;// 跟着删除左侧盗汗跟着高亮显示当前路由选项
            }*/
        },
        // 关闭所有
        CLOSE_AllTAG(state){
            // @ts-ignore
            state.tags=[{ id: 1, name: 'myVue', query: 'myVue',text: t('menu.myVue') }];
            // @ts-ignore
            state.activeTag= { id: 1, name: 'myVue', query: 'myVue',text: t('menu.myVue') };
            state.theTargetIndex= 0;
        },
        // 关闭其他
        CLOSE_OTHERTAG(state){
            let arr =[{ id: 1, name: 'myVue', query: 'myVue',text: t('menu.myVue') }];
            if(state.tags.length>2&&state.activeTag.name!='myVue'){
                arr.push(state.activeTag)
            }
            // @ts-ignore
            state.tags=arr;
            state.theTargetIndex = state.activeTag.id -1;
        },
        CHANGE_LANGUAGE: (state, lang) => {
            setLanguage(lang);
            state.lang = lang;
        },
    },
    actions: {
        addTags (context, tag) {
            context.commit('ADD_TAGS', tag);
        },
        closeTag (context, tag) {
            context.commit('CLOSE_TAG', tag);
        },
        closeOther (context) {
            context.commit('CLOSE_OTHERTAG');
        },
        closeAllTag (context) {
            context.commit('CLOSE_AllTAG');
        },
        /**
         * @description 切换语言
         * @param {string} lang 语言 可选值： zh-cn|en
         */
        changeLanguage: ({ commit }, lang) => {
            commit('CHANGE_LANGUAGE', lang);
        },
    },
});

export default index;
