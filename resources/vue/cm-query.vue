<template>
    <li class="cm-item">
        <button
            :class="['cm-item__button', {'is-active' : isActive}, itemClass]"
            v-bind="$attrs"
            v-on="$listeners"
            @click="setQuery"
        >
            <slot />
        </button>
    </li>
</template>

<script>
import itemMixin from '../js/mixins/cm-item.js'

export default {

    name: 'cm-query',

    mixins: [ itemMixin ],

    props: {

        param: {
            type: Object,
            required: true
        }
    },


    computed: {

        routeQuery() {
            return this.$route.query
        },

        isActive() {
            let active = true
            for ( let param in this.param ) {
                active = active && (
                            this.routeQuery.hasOwnProperty(param) ?
                            this.routeQuery[param] === this.param[param] :
                            this.param[param] === ''
                        )
            }
            return active
        }
    },


    methods: {

        setQuery() {
            if ( this.isActive ) return // stop filtering empty query
            this.$router.push({ query: this.getMergedQuery()});
        },

        getMergedQuery() {
            return Object.assign({}, this.routeQuery, this.param)
        }
    },


    beforeCreate() {
        this._routerRoot = this
        this._router = AWEMA._vueRouter
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.history.current)
    }
}
</script>
