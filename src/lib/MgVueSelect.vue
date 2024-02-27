<template>
    <div class="special-select" ref="component" :style="cssProperties">
        <input 
          type="text" 
          class="form-control" 
          ref="searchInput"
          v-model="searchValue" 
          :id="componentId"
          :class="{'is-invalid': props.invalid}"
          :placeholder="props.placeholder" 
          :readonly="props.readonly"
          @focus="onFocus"
          @blur="onBlur"
          > 
        <div :id="validationFeedbackId" class="invalid-feedback">{{ props.errorMsg }}</div>
        <div v-if="showDropdownList" class="drop-down">
            <div class="drop-down-list" tabindex="0">
                <div v-for="opt, index in dropdownList" 
                  class="drop-down-row"
                  ref="optionElements"
                  :key="index" 
                  :class="{'drop-down-selection': isSelected(index)}"
                  @click="mouseClickFocus(index)"
                  @dblclick="mouseClickSelect(index)"
                  :tabindex="index"
                  > 
                  <!-- style="scroll-snap-align:start;scroll-snap-stop:always;" -->
                    <slot :option="opt">
                        <div class="flex-grow-1" >{{ props.format(opt) }}</div>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts" generic="T">
import { ref, shallowRef, watch, onMounted, computed, withDefaults, useAttrs } from "vue"
import type { Ref } from "vue"
import type { FilterFunction, FormatFunction } from "./@types/types"

const component = ref<HTMLDivElement>()
const searchInput = ref<HTMLInputElement>()
const optionElements = ref<HTMLDialogElement[]>()

const searchValue = ref("")
const dropdownList = shallowRef<Array<T>>([]) as Ref<T[]>
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
    placeholder: string
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

const componentId = computed(() => {
    return props.id
})

const validationFeedbackId = computed(() => {
    return props.id + "Feedback"
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


watch(searchValue, debounceInputValue(onInputChange, 200))

const isSelected = (index: number) => {
    if (index === selectedIndex.value) {
        return true
    }
    return false
}


const onBlur = () => {
    if (showDropdownList.value === false) {
        emit('blur') 
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
        return
    }
    const nextIndex = selectedIndex.value + 1
    if (nextIndex + 1 <= dropdownList.value.length) {
        selectedIndex.value = nextIndex
        if (optionElements.value) optionElements.value[nextIndex].focus()
    }
}

const arrowUpHandler = () => {
    if (showDropdownList.value === false) {
        return
    }
    const nextIndex = selectedIndex.value - 1
    if (nextIndex >= 0) {
        selectedIndex.value = nextIndex
        if (optionElements.value) optionElements.value[nextIndex].focus()
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


const mouseClickFocus = (index: number) => {
    selectedIndex.value = index 
}

const mouseClickSelect = (index: number) => {
    selectedIndex.value = index 
    setSelectedOption(selectedIndex.value)
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
    height: calc((var(--row-height) * var(--row-count)) + (2 * 0.5em));
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
</style>
./@types/types