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
                <!-- 预览 -->
                <el-col :md="24" :lg="12" class="right-preview">
                    <div class="g-w g-pd-l-15">
                        <el-button
                            icon="el-icon-refresh"
                            type="text"
                            @click="runCode"
                        >刷新</el-button>
                        <el-button
                            icon="el-icon-circle-close"
                            class="g-c-danger"
                            type="text"
                            @click="$emit('update:visible', false)"
                        >关闭</el-button>
                    </div>
                    <iframe
                        v-show="isIframeLoaded"
                        ref="previewPage"
                        class="result-wrapper"
                        frameborder="0"
                        src="preview.html"
                        @load="iframeLoad"
                    />
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
import { beautifierConf, exportDefault } from '@/utils/loadConf'
import { parse } from '@babel/parser'
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
            activeTab: 'html',
            isIframeLoaded: false,
            isInitcode: false // 保证open后两个异步只执行一次runcode
        }
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
        runCode () {
            const jsCodeStr = editorObj.js.getValue()
            try {
                const ast = parse(jsCodeStr, { sourceType: 'module' })
                const astBody = ast.program.body
                if (astBody.length > 1) {
                    this.$confirm(
                        'js格式不能识别，仅支持修改export default的对象内容',
                        '提示',
                        {
                            type: 'warning'
                        }
                    )
                    return
                }
                if (astBody[0].type === 'ExportDefaultDeclaration') {
                    const postData = {
                        type: 'refreshFrame',
                        data: {
                            generateConf: this.generateConf,
                            html: editorObj.html.getValue(),
                            js: jsCodeStr.replace(exportDefault, ''),
                            css: editorObj.css.getValue(),
                            scripts: this.scripts,
                            links: this.links
                        }
                    }

                    this.$refs.previewPage.contentWindow.postMessage(
                        postData,
                        location.origin
                    )
                } else {
                    this.$message.error('请使用export default')
                }
            } catch (err) {
                this.$message.error(`js错误：${err}`)
                console.error(err)
            }
        },
        onClose () {
            this.isInitcode = false
        },
        iframeLoad () {
            if (!this.isInitcode) {
                this.isIframeLoaded = true
                this.isRefreshCode && (this.isInitcode = true) && this.runCode()
            }
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
