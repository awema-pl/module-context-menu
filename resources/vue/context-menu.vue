<template>
  <div :class="['context-menu', positonClasses]" >

    <!-- toggle button -->
    <button
        type="button"
        aria-haspopup="true"
        :class="['context-menu__toggler', buttonClass, {'context-menu__toggler-default': ! $slots.toggler}]"
        @click.stop="toggleMenu"
        @keydown.esc="closeMenu"
        ref="toggler"
    >
        <slot name="toggler">
            <svg width="11" height="3" viewBox="0 0 600 168">
                <circle cx="84" cy="84" r="80"></circle>
                <circle cx="300" cy="84" r="80"></circle>
                <circle cx="516" cy="84" r="80"></circle>
            </svg>
        </slot>
    </button><!-- / toggle button -->

    <!-- dropdown -->
    <transition
        name="toggle-context-menu"
        @beforeEnter="prepare"
        @afterLeave="cleanup"
        @enter="checkPosition"
    >
        <div :class="['context-menu__dropdown', positonClasses]"
            :aria-expanded=" isOpened ? 'true' : 'false'"
            :style="positionStyle"
            v-show="isOpened"
            @click.stop="menuClickHandler"
            ref="dropdown"
        >
            <ul
                v-if="$slots.default"
                class="context-menu__list"
            >
                <slot />
            </ul>
        </div>
    </transition><!-- / dropdown -->
  </div>
</template>

<script>

const IS_TOUCH = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0
const BOUNDARY_ELEMENT_DEFAULT = 'body'
const DEBOUNCE_TIMEOUT = 300

let _uniqId = 0

export default {

    name: 'context-menu',

    props: {
        
        buttonClass: String,

        right: {
            type: Boolean,
            default: false
        },

        top: {
            type: Boolean,
            default: false
        },

        autoPosition: {
            type: Boolean,
            default: true
        },

        boundary: {
            type: String,
            default: BOUNDARY_ELEMENT_DEFAULT
        },

        relocate: {
            type: Boolean,
            default: true
        }
    },

    data() {
        return {
            menuId: 'cm-' + _uniqId++,
            isOpened: false,
            clipRect: {
                bounds: null,
                toggler: {
                    top: 0,
                    bottom: 0
                },
                dropdown: {
                    width: 0,
                    height: 0
                },
            },
            canOpen: {
                left: true,
                top: true,
                right: true,
                bottom: true
            },
            debounce: {
                scroll: null,
                resize: null
            }
        }
    },


    computed: {

        boundaryElement() {
            if ( this._isMounted ) {
                let boundaryElement = this.$el.closest(this.boundary)
                if ( ! boundaryElement ) boundaryElement = document.querySelector(BOUNDARY_ELEMENT_DEFAULT)
                return boundaryElement
            } else {
                return null
            }
        },

        otsideClickEvents() {
            return IS_TOUCH ? ['touchstart', 'click'] : ['click']
        },

        positionEvents() {
            return this.autoPosition ?
                   [
                       { event: 'scroll', handler: 'scrollHandler'},
                       { event: 'resize', handler: 'resizeHandler'}
                   ] :
                   false
        },

        position: {

            get() {
                if ( ! this.autoPosition ) {
                    return {
                        right: this.right,
                        top: this.top
                    }
                }
                return {
                    right: (this.right && this.canOpen.right) || (this.canOpen.right && ! this.canOpen.left),
                    top: (this.top && this.canOpen.top) || (this.canOpen.top && ! this.canOpen.bottom)
                }
            },

            set( pos ) {
                for ( let direction in pos ) {
                    this.$set( this.canOpen, direction, pos[direction] )
                }
            }
        },

        positonClasses() {
            return {
                'is-opened': this.isOpened,
                'is-right-side': this.position.right,
                'is-top-side': this.position.top
            }
        },

        positionStyle() {
            if ( typeof window !== 'undefined' && this.relocate ) {

                let size = this.clipRect

                return {
                    position: 'absolute',
                    top: ( this.position.top ? size.toggler.top - size.dropdown.height : size.toggler.bottom ) + window.pageYOffset + 'px',
                    left: ( this.position.right ? size.toggler.right - size.dropdown.width : size.toggler.left ) + 'px'
                }

            } else {
                return null
            }
        }
    },

    watch: {

        isOpened(isOpened) {
            if (isOpened) {
                this.otsideClickEvents.forEach( event => {
                    window.addEventListener(event, this.clikcOutsideHandler, true)
                })
                if ( this.positionEvents ) {
                    this.positionEvents.forEach( item => {
                        window.addEventListener(item.event, this[item.handler], {
                            passive: true
                        })
                    })
                }
            } else {
                this.otsideClickEvents.forEach( event => {
                    window.removeEventListener(event, this.clikcOutsideHandler, true)
                })
                if ( this.positionEvents ) {
                    this.positionEvents.forEach( item => {
                        window.removeEventListener(item.event, this[item.handler], {
                            passive: true
                        })
                    })
                }
            }
        }
    },

    methods: {

        toggleMenu() {
            this.isOpened = !this.isOpened
        },

        openMenu() {
            this.isOpened = true
        },

        closeMenu() {
            this.isOpened = false
        },

        clikcOutsideHandler($event) {
            let target = $event.target
            if ( ! ( this.$refs.dropdown.contains(target) || this.$refs.dropdown === target ) && 
                 ! ( this.$refs.toggler.contains(target) || this.$refs.toggler === target ) ) {
                this.closeMenu();
            }
        },

        menuClickHandler($event) {
            if (['BUTTON', 'A'].includes($event.target.tagName) ||
                $event.target.closest('button, a')) {
                this.closeMenu();
            }
        },

        setBoundingRect() {
            this.clipRect.bounds = this.boundaryElement.getBoundingClientRect()
        },

        setSelfBounds() {
            this.clipRect.toggler = this.$el.getBoundingClientRect()
        },

        setDropdownBounds() {
            this.clipRect.dropdown = {
                width: this.$refs.dropdown.clientWidth,
                height: this.$refs.dropdown.clientHeight
            }
        },

        prepare() {
            if ( this.relocate) {
                document.body.appendChild(this.$refs.dropdown)
            }
            this.setSelfBounds()
        },

        cleanup() {
            if ( this.relocate) {
                this.$el.appendChild(this.$refs.dropdown)
            }
        },

        checkPosition() {
            this.setBoundingRect()
            this.setSelfBounds()
            this.setDropdownBounds()
            if ( this.autoPosition ) {
                this.checkCanOpenHorizontal()
                this.checkCanOpenVertical()
            }
        },

        checkCanOpenHorizontal() {
            const bound = this.clipRect.bounds
            const el = this.clipRect.toggler
            const dropdown = this.clipRect.dropdown
            this.position = {
                left: bound.width + bound.left > el.left + dropdown.width,
                right: el.left - bound.left > dropdown.width - el.width
            }
        },

        checkCanOpenVertical() {
            const bound = this.clipRect.bounds
            const el = this.clipRect.toggler
            const dropdown = this.clipRect.dropdown
            const boundsPosition = {
                top: el.top - bound.top > dropdown.height,
                bottom: bound.top + bound.height - el.top - el.height > dropdown.height
            }
            const viewportPosition = {
                top: el.top > dropdown.height,
                bottom: el.top + el.height + dropdown.height < window.innerHeight
            }
            this.position = {
                top: boundsPosition.top && viewportPosition.top,
                bottom: boundsPosition.bottom && viewportPosition.bottom
            }
        },

        scrollHandler() {
            clearTimeout( this.debounce.scroll )
            this.debounce.scroll = setTimeout( () => {
                if ( this.isOpened ) {
                    this.setSelfBounds()
                    this.checkCanOpenHorizontal()
                    this.checkCanOpenVertical()
                }
            }, DEBOUNCE_TIMEOUT )
        },

        resizeHandler() {
            clearTimeout( this.debounce.resize )
            this.debounce.resize = setTimeout( () => {
                if ( this.isOpened ) {
                    this.checkPosition()
                }
            }, DEBOUNCE_TIMEOUT )
        }
    }
}
</script>
