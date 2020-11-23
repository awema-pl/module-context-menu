<template functional>
  <li class="cm-item">
      <div :class="['cm-item__panel', {'is-secondary': props.secondary}]">
            <slot></slot>
            {{ context }}
      </div>
  </li>
</template>

<script>
export default {

    name: 'cm-panel',

    functional: true,

    props: {

        secondary: {
            type: Boolean,
            default: false
        }
    }
}
</script>
