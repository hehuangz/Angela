import ruleTrigger from './ruleTrigger'
let confGlobal
let someSpanIsNot24

// span不为24的用el-col包裹
function colWrapper (scheme, str) {
    if (someSpanIsNot24 || scheme.__config__.span !== 24) {
        return `<el-col :span="${scheme.__config__.span}">
        ${str}
      </el-col>`
    }
    return str
}

function buildFormTemplate (scheme, child, type) {
    let labelPosition = ''
    if (scheme.labelPosition !== 'right') {
        labelPosition = `label-position="${scheme.labelPosition}"`
    }
    const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : ''
    let str = `<el-form ref="${scheme.formRef}" :model="${scheme.formModel}" :rules="${scheme.formRules}" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
        ${child}
        ${buildFromBtns(scheme, type)}
      </el-form>`
    if (someSpanIsNot24) {
        str = `<el-row :gutter="${scheme.gutter}">
          ${str}
        </el-row>`
    }
    return str
}

function buildFromBtns (scheme, type) {
    let str = ''
    if (scheme.formBtns && type === 'file') {
        str = `<el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>`
        if (someSpanIsNot24) {
            str = `<el-col :span="24">
            ${str}
          </el-col>`
        }
    }
    return str
}

function attrBuilder (el) {
    return {
        tag: el.__config__.tag,
        vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
        clearable: el.clearable ? 'clearable' : '',
        placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
        width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
        disabled: el.disabled ? ':disabled=\'true\'' : ''
    }
}

// el-buttin 子级
function buildElButtonChild (scheme) {
    const children = []
    const slot = scheme.__slot__ || {}
    if (slot.default) {
        children.push(slot.default)
    }
    return children.join('\n')
}

// el-input 子级
function buildElInputChild (scheme) {
    const children = []
    const slot = scheme.__slot__
    if (slot && slot.prepend) {
        children.push(`<template slot="prepend">${slot.prepend}</template>`)
    }
    if (slot && slot.append) {
        children.push(`<template slot="append">${slot.append}</template>`)
    }
    return children.join('\n')
}

const tags = {
    'el-button': el => {
        const {
            tag, disabled
        } = attrBuilder(el)
        const type = el.type ? `type="${el.type}"` : ''
        const icon = el.icon ? `icon="${el.icon}"` : ''
        const round = el.round ? 'round' : ''
        const size = el.size ? `size="${el.size}"` : ''
        const plain = el.plain ? 'plain' : ''
        const circle = el.circle ? 'circle' : ''
        let child = buildElButtonChild(el)

        if (child) child = `\n${child}\n` // 换行
        return `<${tag} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>`
    },
    'el-input': el => {
        const {
            tag, disabled, vModel, clearable, placeholder, width
        } = attrBuilder(el)
        const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
        const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
        const readonly = el.readonly ? 'readonly' : ''
        const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
        const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
        const showPassword = el['show-password'] ? 'show-password' : ''
        const type = el.type ? `type="${el.type}"` : ''
        const autosize = el.autosize && el.autosize.minRows
            ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
            : ''
        let child = buildElInputChild(el)

        if (child) child = `\n${child}\n` // 换行
        return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`
    }
}

const layouts = {
    colFormItem (scheme) {
        const config = scheme.__config__
        let labelWidth = ''
        let label = `label="${config.label}"`
        if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
            labelWidth = `label-width="${config.labelWidth}px"`
        }
        if (config.showLabel === false) {
            labelWidth = 'label-width="0"'
            label = ''
        }
        const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
        const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
        let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
          ${tagDom}
        </el-form-item>`
        str = colWrapper(scheme, str)
        return str
    }
}

/**
 * @param {Object} formConfig 表单配置
 * @param {String} type 弹窗还是页面
 */
export function makeUpHtml (formConfig, type) {
    const htmlList = []
    confGlobal = formConfig
    // 遍历渲染每个组件成html
    formConfig.fields.forEach(el => {
        htmlList.push(layouts[el.__config__.layout](el))
    })
    const htmlStr = htmlList.join('\n')
    // 将组件代码放进form标签
    const temp = buildFormTemplate(formConfig, htmlStr, type)
    confGlobal = null
    return temp
}
