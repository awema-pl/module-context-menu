import contextMenu from './plugin.js'

const awemaPlugin = {

    install() {
        Vue.use(contextMenu)
    }
}

if ( 'AWEMA' in window ) {
    AWEMA.use(awemaPlugin)
} else {
    window.__awema_plugins_stack__ = window.__awema_plugins_stack__ || []
    window.__awema_plugins_stack__.push(awemaPlugin)
}
