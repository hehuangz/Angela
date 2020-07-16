<template>
    <el-drawer
        v-bind="$attrs"
        title="我是为了用户的可访问性而设的无用Title，请忽略我"
        :with-header="false"
        @opened="onOpen"
        @close="onClose">
        <div class="g-h">
            <el-row class="g-h" style="height: 100%;">
                <el-col :md="24" :lg="12" class="left-editor">
                    <el-tabs v-model="activeTab" type="card" class="build-editor-tabs">
                        <el-tab-pane name="html">
                            <span slot="label">
                                <i v-if="activeTab==='html'" class="el-icon-edit" />
                                <i v-else class="el-icon-document" />
                                template
                            </span>
                        </el-tab-pane>
                        <el-tab-pane name="js">
                            <span slot="label">
                                <i v-if="activeTab==='js'" class="el-icon-edit" />
                                <i v-else class="el-icon-document" />
                                script
                            </span>
                        </el-tab-pane>
                        <el-tab-pane name="css">
                            <span slot="label">
                                <i v-if="activeTab==='css'" class="el-icon-edit" />
                                <i v-else class="el-icon-document" />
                                css
                            </span>
                        </el-tab-pane>
                    </el-tabs>
                    <div v-show="activeTab==='html'" id="editorHtml" class="tab-editor" />
                    <div v-show="activeTab==='js'" id="editorJs" class="tab-editor" />
                    <div v-show="activeTab==='css'" id="editorCss" class="tab-editor" />
                </el-col>
                <el-col :md="24" :lg="12" class="right-preview">
                </el-col>
            </el-row>
        </div>
    </el-drawer>
</template>

<script>
import { makeUpHtml } from '@/components/generator/html'
import { makeUpJs } from '@/components/generator/js'
import { makeUpCss } from '@/components/generator/css'
import loadMonaco from '@/utils/loadMonaco'
import loadBeautifier from '@/utils/loadBeautifier'
import { beautifierConf } from '@/utils/loadConf'
const editorObj = {
    html: null,
    js: null,
    css: null
}
const mode = {
    html: 'html',
    js: 'javascript',
    css: 'css'
}
let beautifier
let monaco

export default {
    props: {
        formData: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    data () {
        return {
            activeTab: 'html'
        }
    },
    mounted () {
        console.log(this.$attrs, 11)
    },
    methods: {
        onOpen () {
            this.htmlCode = makeUpHtml(this.formData)
            this.jsCode = makeUpJs(this.formData)
            this.cssCode = makeUpCss(this.formData)
            loadBeautifier(btf => {
                beautifier = btf
                this.htmlCode = beautifier.html(this.htmlCode, beautifierConf.html)
                this.jsCode = beautifier.js(this.jsCode, beautifierConf.js)
                this.cssCode = beautifier.css(this.cssCode, beautifierConf.html)

                loadMonaco(val => {
                    monaco = val
                    this.setEditorValue('editorHtml', 'html', this.htmlCode)
                    this.setEditorValue('editorJs', 'js', this.jsCode)
                    this.setEditorValue('editorCss', 'css', this.cssCode)
                    if (!this.isInitcode) {
                        this.isRefreshCode = true
                        this.isIframeLoaded && (this.isInitcode = true) && this.runCode()
                    }
                })
            })
        },
        setEditorValue (id, type, codeStr) {
            if (editorObj[type]) {
                editorObj[type].setValue(codeStr)
            } else {
                editorObj[type] = monaco.editor.create(document.getElementById(id), {
                    value: codeStr,
                    theme: 'vs-dark',
                    language: mode[type],
                    automaticLayout: true
                })
            }
            // ctrl + s 刷新
            editorObj[type].onKeyDown(e => {
                if (e.keyCode === 49 && (e.metaKey || e.ctrlKey)) {
                    this.runCode()
                }
            })
        },
        onClose () {

        }
    }
}
</script>

<style lang="less" scoped>
.left-editor {
    position: relative;
    height: 100%;
    background: #1e1e1e;
    overflow: hidden;
}

.right-preview {
    height: 100%;
}

.tab-editor {
    background: @editorTabsborderColor;
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 14px;
}
</style>
