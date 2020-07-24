import Vue from 'vue/dist/vue.js'
import { loadScriptQueue } from '@/utils/loadScript'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Element)

const $previewApp = document.getElementById('previewApp')
const childAttrs = {
    file: '',
    dialog: ' width="600px" class="dialog-width" v-if="visible" :visible.sync="visible" :modal-append-to-body="false" '
}

window.addEventListener('message', init, false)

function buildLinks (links) {
    let strs = ''
    links.forEach(url => {
        strs += `<link href="${url}" rel="stylesheet">`
    })
    return strs
}

function init (event) {
    console.log(event, 22)
    if (event.data && event.data.type && (event.data.type === 'refreshFrame')) {
        const code = event.data.data
        console.log(code.js, 44)
        const attrs = childAttrs[code.generateConf.type || 'file']
        let links = ''

        if (Array.isArray(code.links) && code.links.length > 0) {
            links = buildLinks(code.links)
        }

        $previewApp.innerHTML = `${links}<style>${code.css}</style><div id="app"></div>`

        if (Array.isArray(code.scripts) && code.scripts.length > 0) {
            loadScriptQueue(code.scripts, () => {
                newVue(attrs, code.js, code.html)
            })
        } else {
            newVue(attrs, code.js, code.html)
        }
    }
}

function newVue (attrs, main, html) {
    main = eval(`(${main})`)
    main.template = `<div>${html}</div>`
    console.log(main, 33)
    const res = Vue.compile(`<div><h1>hjgas</h1><child ${attrs}/></div>`)
    new Vue({
        components: {
            child: main
        },
        data () {
            return {
                visible: true
            }
        },
        render: res.render
    }).$mount('#app')
}
