<template>
    <div ref="component">
        <textarea
          class="form-control" 
          v-bind="attrs"
          v-model="inputText"
          :class="{'is-invalid': props.invalid}"
          :readonly="props.readOnly"
        ></textarea>
        <div :id="validationFeedbackId" class="invalid-feedback">{{ props.errorMsg }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, useAttrs, defineOptions, onMounted, withDefaults } from "vue"

defineOptions({
    inheritAttrs: false
})

const component = ref()
const attrs = useAttrs()
const inputText = defineModel<string>({
    required: true, 

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
    readOnly?: boolean
    maxLength?: number
    capitalize?: boolean
    restrictedKeys?: boolean 
    allowableKeys: string[]
}>(), {
    invalid: false,
    errorMsg: "",
    readOnly: false,
    maxLength: 0,
    capitalize: false,
    restrictedKeys: false,
    numbersOnly: false,
})

const movementKeys = ['Backspace', 'Delete', 'Tab', 'ArrowDown', 'ArrowUp', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight']

const validationFeedbackId = computed(() => {
    return attrs.id + "Feedback"
})


onMounted(() => {

    component.value?.addEventListener("keydown", (e: KeyboardEvent) => {
        if (movementKeys.includes(e.code)) {
            return
        }
        if (props.restrictedKeys && props.allowableKeys.length > 0 && !props.allowableKeys.includes(e.key)) {
            console.debug(`preventing non-allowable key: ${e.key}`)
            e.preventDefault()
            return
        }
        if (props.maxLength > 0 && inputText.value.length >= props.maxLength) {
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

