<template>
    <li class="cm-item">
        <button
            :class="['cm-item__button', itemClass]"
            v-bind="$attrs"
            v-on="$listeners"
        >
            <slot />
        </button>
    </li>
</template>

<script>
import itemMixin from '../js/mixins/cm-item.js'

export default {

    name: 'cm-button',

    mixins: [ itemMixin ]
}
</script>

<style lang="css">
</style>
