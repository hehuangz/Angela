<template>
    <div class="build g-flex g-jc-sb">
        <!-- 左侧组件选择区 -->
        <left-content />
        <!-- 中间拖拽区 -->
        <center-content />
        <!-- 右侧配置区 -->
        <right-content />
    </div>
</template>

<script>
import leftContent from './children/left-content'
import centerContent from './children/center-content'
import rightContent from './children/right-content'
export default {
    name: 'build',
    components: {
        leftContent,
        centerContent,
        rightContent
    },
    methods: {
    }
}
</script>

<style lang="less" scoped>
.build {
    background-color: #eaeaea;
}
</style>
