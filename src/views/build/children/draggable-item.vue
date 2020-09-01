<script>
import render from '@/components/render/render'

const layouts = {
    colFormItem (h, element, index, parent) {
        const config = element.__config__
        const { activeItem } = this.$listeners
        return (
            <el-col
                span={config.span}
                class="drawing-item"
                nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
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
            </el-col>
        )
    }
}

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
        const layout = layouts[this.element.__config__.layout]
        return layout.call(this, h, this.element, this.index, this.drawingList)
    }
}
</script>
