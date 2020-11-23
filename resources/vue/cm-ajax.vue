<template>
    <li class="cm-item">
        <button
            :class="['cm-item__button', itemClass]"
            v-bind="$attrs"
            @click="fetchData"
        >
            <slot />
        </button>
    </li>
</template>

<script>
import itemMixin from '../js/mixins/cm-item.js'

export default {

    name: 'cm-ajax',

    inheritAttrs: false,

    mixins: [ itemMixin ],

    props: {

        params: {
            type: Object,
            default: () => ({})
        },

        url: {
            type: String,
            required: true
        },

        method: {
            type: String,
            default: 'post',
            validator(method) {
                return ['get', 'put', 'post', 'delete', 'patch'].includes(method.toLowerCase())
            }
        }
    },


    methods: {

        fetchData() {
            AWEMA.ajax( this.params, this.url, this.method )
                .then( data => {
                    this.$emit('sended', data);
                })
                .catch( error => {
                    this.$emit('error', error);
                })
        }
    }
}
</script>
