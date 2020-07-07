<template>
    <el-drawer
        v-bind="$attrs"
        title="我是为了用户的可访问性而设的无用Title，请忽略我"
        :with-header="false"
        @opened="onOpen"
        @close="onClose">
        <div class="g-h">
            <el-row class="g-h">
                <el-col :md="24" :lg="12" class="left-editor">

                </el-col>
                <el-col :md="24" :lg="12" class="right-preview">
                </el-col>
            </el-row>
        </div>
    </el-drawer>
</template>

<script>
export default {
    props: {

    },
    data () {
        return {

        }
    },
    mounted () {
        console.log(this.$attrs, 11)
    },
    methods: {
        onOpen () {

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
</style>
