<template>
    <div class="build-center-content g-bg-white g-vh g-w">
        <!-- 顶部按钮区 -->
        <div class="g-tr g-lh-50 g-border-b-e5e5e5 g-pd-r-15">
            <el-button icon="el-icon-video-play" type="text" @click="run">运行</el-button>
            <el-button icon="el-icon-view" type="text" @click="preview">预览</el-button>
            <el-button icon="el-icon-download" type="text" @click="download">导出代码</el-button>
            <el-button icon="el-icon-collection" type="text" @click="save">保存</el-button>
            <el-button class="g-c-danger" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
        </div>
        <!-- 拖拽展示区 -->
        <el-scrollbar class="scrollbar-content g-pd-15">
            <div class="center-board-row">
                <el-form
                    :size="formConf.size"
                    :disabled="formConf.disabled"
                    :label-width="formConf.labelWidth + 'px'">
                    <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                        <draggable-item
                            v-for="(element, index) in drawingList"
                            :key="element.renderKey"
                            :drawing-list="drawingList"
                            :element="element"
                            :index="index"
                            :form-conf="formConf"
                            @activeItem="activeItem"
                        />
                    </draggable>
                    <div v-show="!drawingList.length" class="empty-info">
                        从左侧拖入或点选组件进行表单设计
                    </div>
                </el-form>
            </div>
        </el-scrollbar>

        <!-- 运行区，抽屉的方式 -->
        <form-drawer
            :visible.sync="drawerVisible"
            :form-data="formData"
            size="100%"
            :generateConf="{type: 'file'}"
        />
    </div>
</template>

<script>
import { formConf } from '@/components/generator/config'
import drawingDefault from '@/components/generator/default/drawingDefault'
import draggable from 'vuedraggable'
import draggableItem from './draggable-item'
import { saveDrawingList } from '@/utils/db'
import { debounce } from 'throttle-debounce' // 加入防抖，提升缓存表单的性能
import { buildModule, BUILD_ACTIVEDATA } from '@/store/modules/build'
import formDrawer from './form-drawer'
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import loadBeautifier from '@/utils/loadBeautifier'
import { beautifierConf } from '@/utils/loadConf'
import { saveAs } from 'file-saver'
let beautifier

export default {
    name: 'build-center-content',
    components: {
        draggable,
        draggableItem,
        formDrawer
    },
    data () {
        return {
            drawingList: drawingDefault,
            formConf: formConf,
            saveDrawingListDebounce: debounce(340, saveDrawingList(this.drawingList)),
            drawerVisible: false,
            formData: {}
        }
    },
    watch: {
        drawingList: {
            handler (val) {
                this.saveDrawingListDebounce(val)
            },
            deep: true
        }
    },
    mounted () {
        loadBeautifier(btf => {
            beautifier = btf
        })
    },
    methods: {
        activeItem (element) {
            this.$store.dispatch(`${buildModule.name}/${BUILD_ACTIVEDATA}`, element)
        },
        run () {
            this.assembleFormData()
            this.drawerVisible = true
        },
        preview () {},
        download () {
            const codeStr = this.generateCode()
            const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
            saveAs(blob, 'download.vue')
        },
        save () {},
        empty () {},
        assembleFormData () {
            this.formData = {
                fields: JSON.parse(JSON.stringify(this.drawingList)),
                ...this.formConf
            }
        },
        generateCode () {
            this.assembleFormData()
            const script = vueScript(makeUpJs(this.formData))
            const html = vueTemplate(makeUpHtml(this.formData))
            const css = cssStyle(makeUpCss(this.formData))
            return beautifier.html(html + script + css, beautifierConf.html)
        }
    }
}
</script>

<style lang="less" scoped>
.drawing-board {
    height: 100%;
    position: relative;
}
</style>
