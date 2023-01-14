<template>

</template>

<script>
    export default {
        name: "render02",
        methods: {
            renderHeader: (h, params) => {
                let icon = h('Tooltip', {
                    props: {
                        placement: 'top',
                        content: this.mainMesg,
                    },
                    style: {
                        display: 'inline-flex',
                        marginLeft: '5px',
                    }
                }, [h('Icon', { props: { type: 'ios-information', size: 13 }})]);
                return h('div', {}, [h('span', {}, this.$t('srm.materInfoChange.mainIdentification')), icon])
            },
        }
    }
</script>

<style scoped>

</style>
