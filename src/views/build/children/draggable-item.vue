<script>
import render from '@/components/render/render'
export default {
    components: {
        render
    },
    props: [
        'element',
        'index',
        'drawingList',
        'activeId',
        'formConf'
    ],
    render (h) {
        const config = this.element.__config__
        const element = this.element
        return (
            <el-form-item
                label={config.showLabel ? config.label : ''}
                label-width={`${config.labelWidth}px`}
                required={config.required}>
                <render
                    key={config.renderKey}
                    conf={element}
                    onInput={ event => { this.$set(config, 'defaultValue', event) }}
                />
            </el-form-item>
        )
    }
}
</script>
