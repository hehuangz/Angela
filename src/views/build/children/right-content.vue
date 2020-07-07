<template>
    <div class="right-content g-bg-white g-vh g-fs-0 g-border-l-e5e5e5">
        <el-tabs v-model="currentTab" class="center-tabs">
            <el-tab-pane label="属性" name="attr" />
            <el-tab-pane label="数据" name="data" />
        </el-tabs>
        <el-scrollbar class="scrollbar-content">
            <!-- <el-form-item v-if="activeData.__vModel__!==undefined" label="字段名">
                <el-input v-model="activeData.__vModel__" placeholder="请输入字段名（v-model）" />
            </el-form-item>
            <el-form-item v-if="activeData.__config__.label!==undefined" label="标题">
                <el-input v-model="activeData.__config__.label" placeholder="请输入标题" />
            </el-form-item> -->
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'right-content',
    data () {
        return {
            currentTab: 'attr'
        }
    }

}
</script>

<style lang="less" scoped>
.right-content {
    width: 20%;
    min-width: 300px;
}
</style>
