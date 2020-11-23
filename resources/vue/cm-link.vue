<template>
    <li class="cm-item">
        <a
            :class="['cm-item__link', itemClass]"
            :href="href"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot />
        </a>
    </li>
</template>

<script>
import itemMixin from '../js/mixins/cm-item.js'

export default {

    name: 'cm-link',

    mixins: [ itemMixin ],

    props: {

        href: {
            type: String,
            required: true
        }
    }
}
</script>
