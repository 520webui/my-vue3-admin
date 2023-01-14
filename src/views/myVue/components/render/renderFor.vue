<script>
    export default {
        name: "renderFor",
        data () {
            return {
                list: [{ id: 1, name: 'qin' }, { id: 2, name: 'ji' }, { id: 3, name: 'zero' }],
            }
        },
        render () {
            const data = {
                style: {
                    marginLeft: '20px',
                    fontSize: '40px',
                },
            }
            const data1 = {
                style: {
                    fontSize: '60px',
                    background: 'pink',
                },
            }
            const style1 = {
                style: {
                    height: '100%',
                    color: 'red',
                    position: 'absolute',
                    top: 0,
                    ...data1.style
                },
            }
            return (
                  <div {...style1}>
                        {this.list.map(item =>
                            <span {...data}>{ item.name }</span>
                        )}
                  </div>
            )
        }
    }
</script>
