<template>
    <div
        class="calendar-wrap"
        :class="[big ? 'calendar-wrap-big' : '' ]"
    >
        <!-- 多选日期 -->
        <el-date-picker
            v-if="!onlyDate"
            v-model="value"
            type="datetimerange"
            popper-class="my-date-picker"
            value-format="yyyy-MM-dd"
            :editable="false"
            unlink-panels
            placeholder="自定义时间"
            :picker-options="pickerOptions"
            @change="getSelectDate"
        >
        </el-date-picker>

        <!-- 单选日期 -->
        <el-date-picker
            v-if="onlyDate"
            v-model="value"
            popper-class="my-date-only-picker"
            :value-format="
                dateType == 'date' ? 'yyyy-MM-dd' : dateType == 'month' ? 'yyyy-MM' : 'yyyy'
            "
            :editable="false"
            unlink-panels
            placeholder=""
            :picker-options="pickerOptions"
            :type="dateType"
            @change="getOnlySelectDate"
        >
        </el-date-picker>

    </div>
</template>

<script>
    /*
     * 自定义时间选择器
     * 默认通过 tabBtn 组件 进行调用
    */
    export default {
        name: "calendar",
        props: {
            titleObj: {// 标题对象
                type: Object,
                default: () => {},
            },
            btnDisabled: {
                type: Boolean,
                default: false
            },
            height: {
                default: false
            },
            width: {
                default: false
            },
            big: {
                default: false
            },
            onlyDate: { // false ：多选日期 ture : 单选日期
                default: false
            },
            dateType: {
                type: String,
                default: 'date'
            }
        },
        data () {
            return {
                value: '',
                intervalYear: new Date().getFullYear() - 2016,
                pickerOptions: {
                    disabledDate: (time) => {
                        return time.getTime() < Date.now() - (1000 * 60 * 60 * 24 * 365 * this.intervalYear) || time.getTime() > Date.now()
                    },
                },
            }
        },
        created () {
        },
        mounted () {

        },
        methods: {
            getSelectDate (date) {
                if (date == null) {
                    return
                }
                // let startDate = date[0].split('-')
                // let endDate = date[1].split('-')
                // let lastDate = null
                // let num = null
                let nowDate = this.$moment().format("YYYY-MM-DD")
                // let dateFlag = 'dateFlag' // 判断大小月份
                // let flag = false

                let STime = this.$moment(date[0]).valueOf()
                let ETime = this.$moment(date[1]).valueOf()
                let nowTime = this.$moment(nowDate).valueOf()

                if (STime > nowTime || ETime > nowTime) {
                    this.$message.error(`不能选择当日往后的日期`)
                    return false
                }
                let startTime = date[0]
                let endTime = date[1]
                this.$emit('emitDate', startTime, endTime)
            },
            getOnlySelectDate (date) {
                let STime = this.$moment(date).valueOf()
                let nowTime = this.$moment(this.$moment().format(
                    this.dateType == 'date' ? 'YYYY-MM-dd' : this.dateType == 'month' ? 'YYYY-MM' : 'YYYY'
                )).valueOf()
                if (date == null || STime > nowTime) {
                    this.$ElMessage({
                        message: '请选择当天往前的日期',
                        type: "error"
                    })
                    return
                }
                this.$emit('emitDate', date)
            }
        },
        watch: {
            'btnDisabled' () { // 监听 btnDisabled 变化 关闭 disabled
                let buttonArr = document.querySelectorAll('.el-picker-panel__icon-btn')
                buttonArr.forEach((bDom) => {
                    bDom.disabled = false
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.calendar-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

}
.calendar-wrap /deep/ .el-input__inner {
    // width: 0.2rem;
    // height: 0.064rem;
    width: 100%;
    height: 100%;
    background: transparent;
    border : none;
}
.calendar-wrap /deep/ .el-input__prefix{
    color: transparent;
    background: transparent;
}
.calendar-wrap /deep/ .el-range__icon { // 图标
    color: transparent;
    background: transparent;
}
.calendar-wrap /deep/ .el-range-separator{
    color: transparent;
    background: transparent;
}
.calendar-wrap /deep/  .el-range-input{ // input 内容
    color: transparent;
    position: absolute;
    background: transparent;
    z-index: -1;
}
.calendar-wrap /deep/  .el-range__close-icon{ // 关闭图标
    color: transparent;
}
.calendar-wrap /deep/ .el-input__inner { // element input
    padding: 0;
    &::placeholder { // placeholder样式
        color: red !important;
        font-weight: bold;
    }
}
.calendar-wrap-big /deep/ .el-input__inner {
    width: 0.5rem;
    height: 0.12rem;
}

.calendar-wrap /deep/ .el-date-editor{
    width: 100%;
    height: 100%;
    position: absolute;
    color: transparent;
    // z-index: -1;
    top: 0;
    left: 0;
    color: transparent;
}
.calendar-wrap /deep/ .el-date-editor .el-icon-circle-close{
    display: none;
}
.calendar-wrap /deep/ .el-input__inner{
    cursor: pointer;
    color: transparent;
}
</style>
<style lang="less">
.my-date-picker{ // 日历弹出框样式
   background: #041937;
   width: calc(646px / 2);
   overflow: hidden;
   z-index: 9999 !important;
   .el-picker-panel__body-wrapper{
    width: 100%;
      min-width : 0;
   }
   .el-picker-panel__body{
       width: 100%;
       min-width : 0;
   }
   .el-date-range-picker__time-header{
       display: none;
   }
   .el-date-range-picker__content{
       width: 100%;
   }
   .is-right{
       display: none;
   }
   .el-date-range-picker__header {
        color: #fff;
        div{
                font-size: 0.04rem;
                font-weight: bold;
        }
        .el-picker-panel__icon-btn{
        color: #fff;
    }

   }
    .el-date-table, td.prev-month,td.next-month{
        color:  #9c9ea1 ;
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-date-table td.available {
        color:  #fff ; // #606266
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-date-table td.in-range div{
        background: #9c9ea1;
    }
    .el-date-table td.disabled div{
        color:  #5d5d5e ;
        font-size: 0.04rem;
        font-weight: bold;
        background: transparent;
    }
   .el-date-table th{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
   }
   .el-picker-panel__icon-btn.is-disabled:hover{
       cursor: pointer;
   }
   .el-picker-panel__footer{ // 确定部分
        background: #041937;
        .el-button{
            background: #213c6d;
            color: #fff;
            font-weight: bold;
            font-size: 0.03rem;
            line-height: 0.03rem;
            border: 1px solid #fff;
            padding: 7px 15px
        }
   }
}

.my-date-only-picker{ // 单选日期弹出框样式
    background: #041937;
    // .el-year-table,.el-month-table
    // 日
    .el-date-table td.prev-month,td.next-month{
        color:  #9c9ea1 ;
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-date-table td.available {
        color:  #fff ; // #606266
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-date-table td.disabled div{
        color:  #5d5d5e ;
        font-size: 0.04rem;
        font-weight: bold;
        background: transparent;
    }
   .el-date-table th{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
   }
   .el-date-picker__header-label,
   .el-picker-panel__icon-btn{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
       margin: 0;
   }
   // 月
    .el-month-table td.prev-month,td.next-month{
        color:  #9c9ea1 ;
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-month-table td.available  .cell{
        color:  #fff ; // #606266
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-month-table td.disabled .cell{
        color:  #5d5d5e ;
        font-size: 0.04rem;
        font-weight: bold;
        background: transparent;
    }
    .el-month-table td.today .cell{
        color: #409EFF;
    }
   .el-month-table td .cell{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
   }
   .el-date-picker__header-label,
   .el-picker-panel__icon-btn{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
       margin: 0;
   }
   // 年
     .el-year-table td.prev-month,td.next-month{
        color:  #9c9ea1 ;
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-year-table td.available  .cell{
        color:  #fff ; // #606266
        font-size: 0.04rem;
        font-weight: bold;
    }
    .el-year-table td.disabled .cell{
        color:  #5d5d5e ;
        font-size: 0.04rem;
        font-weight: bold;
        background: transparent;
    }
    .el-year-table td.current:not(.disabled) .cell{
        color: #409EFF;
    }
   .el-year-table th{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
   }
   .el-date-picker__header-label,
   .el-picker-panel__icon-btn{
       color: #fff;
       font-size: 0.04rem;
       font-weight: bold;
       margin: 0;
   }
}
</style>
