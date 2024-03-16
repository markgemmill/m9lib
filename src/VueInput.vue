<template>
    <div ref="component">
        <input 
          type="text" 
          class="form-control" 
          :id="componentId"
          :tabindex="tabIndex"
          :class="{'is-invalid': props.invalid}"
          :placeholder="props.placeholder" 
          v-model="inputText"
          :readonly="props.readOnly"
        />
        <div :id="validationFeedbackId" class="invalid-feedback">{{ props.errorMsg }}</div>
    </div>
</template>
<script setup lang="ts">
/*
A text input control that can be restricted to:
- a specific set of characters
- a specific length
- to capitalized letters
*/
import { ref, computed, useAttrs, onMounted, withDefaults } from "vue"

const component = ref()
const attrs = useAttrs()
const inputText = defineModel<string>({required: true,
    set: (value: string) => {
        if (props.capitalize) {
            value = value.toUpperCase()
        }
        return value
    }
})
const props = withDefaults(defineProps<{
    invalid?: boolean
    errorMsg?: string
    placeholder?: string
    readOnly?: boolean
    maxLength?: number
    capitalize?: boolean
    numbersOnly?: boolean
    restrictedKeys?: boolean 
    allowableKeys: string[]
}>(), {
    placeholder: "",
    invalid: false,
    errorMsg: "",
    readOnly: false,
    maxLength: 0,
    capitalize: false,
    restrictedKeys: false,
    numbersOnly: false,
})

let tabIndex = 0

const movementKeys = ['Backspace', 'Delete', 'Tab', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight']

const validationFeedbackId = computed(() => {
    return componentId + "Feedback"
})

const componentId = computed(() => {
    return attrs.id ? attrs.id as string : "" 
})

onMounted(() => {
    tabIndex = attrs.tabindex ? parseInt(attrs.tabindex as string) : 0

    console.debug(props.allowableKeys)
    component.value?.addEventListener("keydown", (e: KeyboardEvent) => {
        console.debug(`keydown: ${e.code}`)
        if (movementKeys.includes(e.code)) {
            return
        }
        if (props.numbersOnly && !e.key.match(/[0-9]/)) {
            console.debug(`preventing non-numeric key: ${e.key}`)
            e.preventDefault()
            return
        }
        if (props.restrictedKeys && props.allowableKeys.length > 0 && !props.allowableKeys.includes(e.key)) {
            console.debug(`preventing non-allowable key: ${e.key}`)
            e.preventDefault()
            return
        }
        if (props.maxLength > 0 && inputText.value.length >= props.maxLength) {
            console.debug(`preventing key due to max length: ${e.key}`)
            e.preventDefault()
            return
        }
    })

    component.value?.addEventListener("keyup", (e: KeyboardEvent) => {
        console.debug(`keyup: ${e.code}`)
    })
})

</script>
<style scoped></style>

