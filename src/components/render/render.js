/**
 * value绑定为默认值
 */
function vModel (self, dataObject, defaultValue) {
    dataObject.props.value = defaultValue
    dataObject.on.input = val => {
        self.$emit('input', val)
    }
}

/**
 * 将./slots中的文件挂载到对象componentChild上
 * 文件名为key，对应JSON配置中的__config__.tag
 * 文件内容为value，解析JSON配置中的__slot__
 */
const componentChild = {}
const slotsFiles = require.context('./slots', true, /\.js$/)
const keys = slotsFiles.keys() || []
keys.forEach(key => {
    const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1') // 取文件名
    const value = slotsFiles(key).default
    componentChild[tag] = value
})

export default {
    props: ['conf'],
    render (h) {
        const dataObject = {
            attrs: {},
            props: {},
            on: {},
            style: {}
        }
        const confClone = JSON.parse(JSON.stringify(this.conf))

        // 赋值dataObject
        Object.keys(confClone).forEach(key => {
            const val = confClone[key]
            if (key === '__vModel__') { // 设置value
                vModel(this, dataObject, confClone.__config__.defaultValue)
            } else if (dataObject[key]) { // dataObject属性值增加confClone的
                dataObject[key] = { ...dataObject[key], ...val }
            } else { // 其余confClone属性绑定在dataObject.attrs上
                dataObject.attrs[key] = val
            }
        })

        // 赋值children
        const children = []
        const childObjs = componentChild[confClone.__config__.tag]
        if (childObjs) {
            Object.keys(childObjs).forEach(key => {
                const childFunc = childObjs[key]
                if (confClone.__slot__ && confClone.__slot__[key]) {
                    children.push(childFunc(h, confClone, key))
                }
            })
        }

        delete dataObject.attrs.__config__
        delete dataObject.attrs.__slot__
        return h(this.conf.__config__.tag, dataObject, children)
    }
}
