import contextMenu from '../vue/context-menu.vue'
import cmButton from '../vue/cm-button.vue'
import cmLink from '../vue/cm-link.vue'
import cmSeparator from '../vue/cm-separator.vue'
import cmPanel from '../vue/cm-panel.vue'
import cmAjax from '../vue/cm-ajax.vue'
import cmQuery from '../vue/cm-query.vue'

function install(Vue) {

    if ( this.installed ) return
    this.installed = true

    Vue.component('context-menu', contextMenu)
    Vue.component('cm-button', cmButton)
    Vue.component('cm-link', cmLink)
    Vue.component('cm-separator', cmSeparator)
    Vue.component('cm-panel', cmPanel)
    Vue.component('cm-ajax', cmAjax)
    Vue.component('cm-query', cmQuery)
}

export default {
    installed: false,
    install
}
