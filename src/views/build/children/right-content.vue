<template>
    <div class="build-right-content g-bg-white g-vh g-fs-0 g-border-l-e5e5e5">
        <el-tabs v-model="currentTab" class="center-tabs">
            <el-tab-pane label="属性" name="attr" />
            <el-tab-pane label="数据" name="data" />
        </el-tabs>
        <el-scrollbar class="scrollbar-content">
            <el-form v-show="currentTab==='attr'" size="small" label-width="90px" class="g-pd-15">
                <!-- 暂时这样写死，流程跑通再定json配置 -->
                <div class="g-lh-44">表单属性</div>
                <el-form-item label="表单名">
                    <el-input v-model="formConf.formRef" placeholder="请输入表单名（ref）" />
                </el-form-item>
                <el-form-item label="表单模型">
                    <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
                </el-form-item>
                <el-form-item label="校验模型">
                    <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
                </el-form-item>
                <el-form-item label="标签宽度">
                    <el-input v-model.number="formConf.labelWidth" type="number" placeholder="请输入标签宽度" />
                </el-form-item>
                <el-form-item label="禁用表单">
                    <el-switch v-model="formConf.disabled" />
                </el-form-item>

                <div class="g-lh-44">组件属性</div>
                <el-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
                    <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
                </el-form-item>
                <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
                    <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="placeholder">
                    <el-input v-model="activeData.placeholder" placeholder="请输入placeholder内容" />
                </el-form-item>
                <el-form-item label="maxlength">
                    <el-input v-model="activeData.maxlength" placeholder="请输入maxlength" />
                </el-form-item>
                <el-form-item label="显示计数器">
                    <el-switch v-model="activeData['show-word-limit']" />
                </el-form-item>
                <el-form-item label="disabled">
                    <el-switch v-model="activeData.disabled" />
                </el-form-item>
            </el-form>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import drawingDefault from '@/components/generator/default/drawingDefault'
import { formConf } from '@/components/generator/config'
export default {
    name: 'build-right-content',
    data () {
        return {
            currentTab: 'attr',
            activeData: drawingDefault[0],
            formConf: formConf
        }
    },
    computed: {
        ...mapState(['build'])
    },
    watch: {
        '$store.state.build.activeData' () {
            console.log(this.activeData.__vModel__, 11)
        }
    }
}
</script>

<style lang="less" scoped>
.build-build-right-content {
    width: 20%;
    min-width: 300px;
}
</style>
