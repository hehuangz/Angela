<template>
    <div class="conter-content g-bg-white g-vh">
        <!-- 顶部按钮区 -->
        <div class="g-tr g-lh-50 g-border-b-e5e5e5 g-pd-r-15">
            <el-button icon="el-icon-video-play" type="text" @click="run">运行</el-button>
            <el-button icon="el-icon-view" type="text" @click="preview">预览</el-button>
            <el-button icon="el-icon-download" type="text" @click="download">导出代码</el-button>
            <el-button icon="el-icon-collection" type="text" @click="save">保存</el-button>
            <el-button class="g-c-danger" icon="el-icon-delete" type="text" @click="empty">清空</el-button>
        </div>
        <!-- 拖拽展示区 -->
        <div></div>
    </div>
</template>

<script>
export default {
    name: 'conter-content',
    methods: {
        run () {},
        preview () {},
        download () {},
        save () {},
        empty () {}
    }
}
</script>

<style lang="less" scoped>
.conter-content {
    width: 100%;
}
</style>
