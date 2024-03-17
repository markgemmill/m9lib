<template>
    <div class="row mt-5">
        <div class="col-8">
            <p>VueInput Example</p>
            <VueTextarea
                id="textarea-example-one"
                tabindex="6"
                :rows="rows"
                class="form-control form-control-sm"
                v-model="text"
                :invalid="exampleTwoInvalid"
                :error-msg="'Required'"
                :capitalize="capitalize"
                :numbers-only="numbersOnly"
                :max-length="maxLength"
                :restricted-keys="restrictedKeys"
                :allowable-keys="allowableKeys"
            ></VueTextarea>
        </div>
    </div>

    <div class="row mt-2 ps-2">
        <div>
            <input id="capitalize" type="checkbox" class="form-check-input me-1" v-model="capitalize">
            <label for="capitalize" class="form-check-label">Capitalize</label>
        </div>
        <div>
            <input id="restricted-keys" type="checkbox" class="form-check-input me-1" v-model="restrictedKeys">
            <label for="restricted-keys" class="form-check-label">Use Restricted Keys</label>
        </div>
        <div style="max-width: 200px;">
            <label for="max-length" class="form-check-label">Maximum Length</label>
            <input id="max-length" type="number" class="form-control me-1" v-model="maxLength">
        </div>
        <div style="max-width: 200px;">
            <label for="max-length" class="form-check-label">Rows</label>
            <input id="max-length" type="number" class="form-control me-1" v-model="rows">
        </div>
        <div>
            <input id="toggleError" type="checkbox" class="form-check-input me-1" v-model="exampleTwoInvalid">
            <label for="toggleError" class="form-check-label">Toggle Error</label>
        </div>
        <div><strong>INPUT TEXT:</strong> {{ text }}</div> 
        <div><strong>INPUT LENGTH:</strong> {{ text.length }}</div> 
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import VueTextarea from "../src/VueTextarea.vue"

const allowableKeys: string[] = ['A', 'B', 'C']
const text = ref("")
const numbersOnly = ref(false)
const capitalize = ref(false)
const maxLength = ref(0)
const rows = ref(5)
const restrictedKeys = ref(false)
const exampleTwoInvalid = ref(false)

</script>