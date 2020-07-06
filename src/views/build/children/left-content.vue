<template>
    <div class="left-content g-bg-white g-vh g-fs-0 g-border-r-e5e5e5">
        <p class="g-tc g-fs-20 g-lh-50 g-border-b-e5e5e5">ANGELA页面搭建系统</p>
        <el-scrollbar class="scrollbar-content g-tl">
            <div class="g-pd-15">
                <div v-for="(item, index) in leftComponets" :key="index">
                    <p class="g-fs-18">{{item.title}}</p>
                    <draggable
                        class="Tag-leftComponent g-pd-b-20"
                        :list="item.list"
                        :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                        :clone="cloneComponent"
                        draggable=".components-item"
                        :sort="false"
                        @end="onEnd">
                        <div
                            v-for="(element, index) in item.list"
                            :key="index"
                            class="components-item">
                            <div class="components-body">
                                <svg-icon :iconName="element.__config__.tagIcon" />
                                {{element.__config__.label}}
                            </div>
                        </div>
                    </draggable>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import {
    searchComponents, tableComponents, formComponents, actionComponents
} from '@/components/generator/config'
export default {
    name: 'left-content',
    components: {
        draggable
    },
    data () {
        return {
            leftComponets: [
                {
                    title: '搜索框',
                    list: searchComponents
                },
                {
                    title: '表格',
                    list: tableComponents
                },
                {
                    title: '表单',
                    list: formComponents
                },
                {
                    title: '交互',
                    list: actionComponents
                }
            ]
        }
    },
    methods: {
        cloneComponent (origin) {
            const clone = JSON.parse(JSON.stringify(origin))
            return clone
        },
        onEnd (obj) {
            console.log(obj, 11)
        }
    }
}
</script>

<style lang="less" scoped>
.left-content {
    width: 15%;
    min-width: 240px;
}
</style>
