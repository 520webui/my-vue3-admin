<script>
    export default {
        name: "render01",
        data () {
            return {
                show: false,
                isClick: false,
            }
        },
        methods: {
            clickHandler () {
                this.isClick = !this.isClick;
            }
        },
        render () {
            let iftext;
            if (this.show) {
                iftext = <p style={{ height: '40px' }}>很好</p>
            } else {
                iftext = <p style={{ height: '40px' }}>不好</p>
            }
            let isClick;
            if (this.isClick) {
                isClick = <p style={{ height: '40px', color: 'blue' }}>{'测试'}</p>
            } else {
                isClick = <p style={{ height: '60px', color: 'red' }}>{'测试'}</p>
            }
            const data = {
                on: {
                    click: this.clickHandler
                },
                style: {
                    color: 'tan',
                    fontSize: '44px',
                    position: 'absolute',
                    top: 0,
                    height: '100%',
                    background: 'pink',
                    zIndex: 99999999,
                },
                class: {
                    foo: true,
                    bar: false
                },
            }
            return (<div{...data}>
                        { iftext }
                        { isClick }
                   </div>)
        }
    }
</script>
<style lang="less">
</style>
