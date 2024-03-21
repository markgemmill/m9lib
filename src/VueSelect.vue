<template>
    <div class="special-select" ref="component" :style="cssProperties">
        <div style="position:relative;">
            <input 
            type="text" 
            class="form-control" 
            ref="searchInput"
            v-model="searchValue" 
            v-bind="attrs"
            :class="{'is-invalid': props.invalid}"
            :readonly="props.readonly"
            @focus="onFocus"
            @blur="onBlur"
            > 
            <div 
              class="drop-down-icon"
              @click="displayUnfilteredDropdown"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="currentColor" 
                    class="bi bi-caret-down-fill" 
                    viewBox="0 0 16 16"
                    >
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
            </div>
            <div :id="validationFeedbackId" class="invalid-feedback">{{ props.errorMsg }}</div>
        </div>
        <div v-if="showDropdownList" 
          class="drop-down"
          :class="dropDownClasses"
          @mouseenter="dropDownElementHasMountFocus = true"
          @mouseleave="dropDownElementHasMountFocus = false"
          >
            <div ref="dropDownElement" class="drop-down-list" tabindex="-1">
                <div v-for="opt, index in dropdownList" 
                    class="drop-down-row"
                    ref="optionElements"
                    :key="index" 
                    :class="{'drop-down-selection': isSelected(index)}"
                    @click="mouseClickSelect(index)"
                    >
                    <slot :option="opt">
                        <div class="flex-grow-1" >{{ props.format(opt) }}</div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T">
import { ref, toValue, shallowRef, watch, onMounted, computed, withDefaults, useAttrs, defineOptions, nextTick } from "vue"
import type { Ref } from "vue"
import type { FilterFunction, FormatFunction } from "./types"

defineOptions({
    inheritAttrs: false
})

const component = ref<HTMLDivElement>()
const searchInput = ref<HTMLInputElement>()
const optionElements = ref<HTMLDialogElement[]>()

const searchValue = ref("")
const dropdownList = shallowRef<Array<T>>([]) as Ref<T[]>
const dropDownClasses = ref({})
const dropDownElementHasMountFocus = ref(false)
const showDropdownList = ref(false)
const selectedIndex = ref(0)

const attrs = useAttrs()

let selectionStarted = false 
let typingInput = false

const modelValue = defineModel<T | undefined>({default: undefined})

interface SpecialSelectProps<T> {
    id: string
    options: Array<T> 
    filter: FilterFunction<T>
    format: FormatFunction<T>
    rowHeight: string 
    allowableKeys: Array<string>
    invalid?: boolean
    errorMsg?: string
    readonly?: boolean
    displayLineCount?: number
}

const props = withDefaults(defineProps<SpecialSelectProps<T>>(), { 
    isValid: true,
    errorMsg: "",
    readonly: false,  
    displayLineCount: 5,
})


const emit = defineEmits<{
    "blur": []
    "onTextChange": [string]
}>()


const cssProperties = computed(() => {
    return {
        '--row-height': props.rowHeight,
        '--row-count': props.displayLineCount,
    } 
})


const validationFeedbackId = computed(() => {
    return attrs.id + "Feedback"
})


const debounceInputValue = (cb: (nv: string) => void, delay: number) => {
   let timeoutInstance: number | undefined = undefined 

   const delayedHandler = (nv: string): number => {
        return window.setTimeout(() => {
            console.debug(`handling input: ${nv}`)
            cb(nv) 
        }, delay) 
   }

   const debounceHandler = (nv: string) => {
        clearTimeout(timeoutInstance)
        timeoutInstance = delayedHandler(nv)
   }
   return debounceHandler
}

const onInputChange = (newValue: string) => {
    if (selectionStarted) {
        selectionStarted = false
        if (searchInput.value) {
            searchInput.value.select()
        }
        return
    }

    if (newValue.length > 0) {
        dropdownList.value = props.options.filter((option)=> {
            return props.filter(option, newValue)
        })
        showDropdownList.value = dropdownList.value.length > 0
        selectedIndex.value = 0
        typingInput = true
        modelValue.value = undefined 
    } else {
        showDropdownList.value = false
        selectedIndex.value = 0
        modelValue.value = undefined 
    }

    emit("onTextChange", newValue)
}

const getDropDownIndex = (list: Array<T>) => {
    if (modelValue.value === undefined) {
        return -1
    }
    return list.findIndex((option, i) => {
        return modelValue.value == option
    })
}

// Set focus to the element in the dropdown list
// and scroll the element into view
const focusOptionElement = (index: number) => {
    const elements = toValue(optionElements)
    if (elements && index >= 0 && index < elements.length) {
        console.debug(elements)
        console.debug(`focusing on element: ${index}`)
        elements[index].focus({preventScroll: false})
        elements[index].scrollIntoView({block: "center"})
    }
}

// Manually trigger the select dropdown.
// This is useful when the user clicks on the dropdown icon,
// or when the user presses the down arrow key.
const displayUnfilteredDropdown = () => {
    // make sure the input has focus, which
    // controls the keyboard events
    searchInput.value?.focus()
    // unfiltered means the entire list of options
    dropdownList.value = props.options
    // toggle the display
    showDropdownList.value = !showDropdownList.value
    if (showDropdownList.value === true) {
        nextTick(() => {
            selectedIndex.value = getDropDownIndex(dropdownList.value) 
            focusOptionElement(selectedIndex.value)
        })
    }
}

watch(searchValue, debounceInputValue(onInputChange, 200))

const isSelected = (index: number) => {
    if (index === selectedIndex.value) {
        return true
    }
    return false
}

const onBlur = () => {
    if (dropDownElementHasMountFocus.value === true) {
        return
    }
    if (showDropdownList.value === false) {
        emit('blur') 
    } else {
        showDropdownList.value = false
    }
}

const onFocus = () => {
    searchInput.value?.select()
}

const setSelectedOption = (index: number) => {
    typingInput = false
    modelValue.value = dropdownList.value[index] 
    selectionStarted = true
    showDropdownList.value = false
}

// Keyboard Event Handlers
const keyOverrides = ["ArrowDown", "ArrowUp", "Enter", "Escape"]
const keyDownHandler = (e: KeyboardEvent) => {
    if (keyOverrides.includes(e.code)) {
        e.preventDefault()
        e.stopPropagation()
    } 
}

const arrowDownHandler = () => {
    console.debug("Arrow Down keyed...")
    if (showDropdownList.value === false) {
        displayUnfilteredDropdown()
        return
    }
    const nextIndex = selectedIndex.value + 1
    if (nextIndex + 1 <= dropdownList.value.length) {
        selectedIndex.value = nextIndex
        focusOptionElement(nextIndex)
    }
}

const arrowUpHandler = () => {
    if (showDropdownList.value === false) {
        return
    }
    const nextIndex = selectedIndex.value - 1
    if (nextIndex >= 0) {
        selectedIndex.value = nextIndex
        focusOptionElement(nextIndex)
    }
}

const enterHandler = () => {
    if (showDropdownList.value === false) {
        return
    }
    setSelectedOption(selectedIndex.value)
}

const escapeHandler = () => {
    if (showDropdownList.value === false) {
        return
    }
    showDropdownList.value = false
}

const mouseClickSelect = (index: number) => {
    selectedIndex.value = index 
    console.debug(`mouse click: ${index}`)
    console.debug(`mouse click: ${selectedIndex.value}`)
    setSelectedOption(selectedIndex.value)
    showDropdownList.value = false
}

//
// this is essentially acting as a reset
//
watch(modelValue, (newValue) => {
    if (typingInput) {
        typingInput = false
        return
    }
    if (newValue === null || newValue === undefined) {
        reset()
    } else {
        searchValue.value = props.format(newValue)
    } 
})

const reset = () => {
    searchValue.value = ""
}

defineExpose({
    reset
})

const setDropDownClass = () => {
    const classes = attrs.class as string
    if (classes && classes.indexOf("form-control-lg") > -1 ) {
        dropDownClasses.value = {"drop-down-lg": true}
    } else if (classes && classes.indexOf("form-control-sm") > -1 ) {
        dropDownClasses.value = {"drop-down-sm": true}
    }
}

onMounted(() => {
    searchValue.value = modelValue.value ? props.format(modelValue.value) : ""

    component.value?.addEventListener("keydown", keyDownHandler)

    component.value?.addEventListener("keyup", (e: KeyboardEvent) => {
        console.debug(`keyup: ${e.code}`)
        if (e.code === "ArrowDown") {
            console.debug(`handling: ${e.code}`)
            arrowDownHandler()
            e.preventDefault()
            e.stopPropagation()
        } else if (e.code === "ArrowUp") {
            console.debug(`handling: ${e.code}`)
            arrowUpHandler()
            e.preventDefault()
            e.stopPropagation()
        } else if (e.code === "Enter") {
            console.debug(`handling: ${e.code}`)
            enterHandler()
            e.preventDefault()
            e.stopPropagation()
        } else if (e.code === "Escape") {
            console.debug(`handling: ${e.code}`)
            escapeHandler()
            e.preventDefault()
            e.stopPropagation()
        }
    })

    searchInput.value?.addEventListener("keypress", (e: KeyboardEvent) => {
        console.debug(`KeyStroke: ${e.key}`)
        if ( props.allowableKeys.length > 0 && !props.allowableKeys.includes(e.key)) {
            e.preventDefault() 
        }
    })

    setDropDownClass()
})

</script>
<style scoped>
.special-select {
    position: relative;
}
.drop-down {
    position: absolute;     
    border: 1px solid #CCC;
    z-index: 1000;
    top: 38px;
    left: 10px;
    width: 95%;
    max-width: 100%;
    background-color: white !important;
    padding: 2px;

}
.drop-down-list {
    box-sizing: border-box;
    position: relative;
    overflow-y: scroll;
    /* scroll-behavior: smooth; */
    scroll-snap-type: y mandatory;
    scroll-snap-points-y: repeat(var(--row-height));
    padding: 0.5em;
    width: 100%;
    min-width: 200px;
    /* min-height: calc((var(--row-height) * var(--row-count)) + (2 * 0.5em)); */
    /* height: calc((var(--row-height) * var(--row-count)) + (2 * 0.5em)); */
    height: calc((var(--row-height) * var(--row-count)));
    /* max-height: calc((var(--row-height) * var(--row-count)) + (2 * 0.5em)); */
    background-color: white !important;

} 

.drop-down-row {
    box-sizing: border-box;
    position: relative;
    scroll-snap-stop: always;
    scroll-snap-align: start;
    height: var(--row-height);
    padding-left: 0.4em;
    cursor: pointer;
}

.drop-down-row:focus {
    border: 0;
    outline: 0;
}

.drop-down-row:hover {
    background-color: #EEE;
}

.drop-down-selection {
    background-color: #D9D9D9;
    
}
.form-control.is-invalid {
    background-image: none;
}
.drop-down-icon {   
    padding:0;
    margin:0;
    position:absolute;
    right:10px;
    top:6px;
    cursor:pointer;
    z-index:1000;
}
.form-control-lg + .drop-down-icon{
    padding:0;
    margin:0;
    position:absolute;
    right:15px;
    top:11px;
    cursor:pointer;
    z-index:1000;
}
.form-control-sm + .drop-down-icon {
    padding:0;
    margin:0;
    position:absolute;
    right:10px;
    top:3px;
    cursor:pointer;
    z-index:1000;
}

.drop-down-lg {
    top: 48px;
}

.drop-down-sm {
    top: 33px;
}
</style>