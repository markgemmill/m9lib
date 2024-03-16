<template>
    <div class="row mt-5">
        <div class="col-8">
            <p>VueInput Example</p>
            <VueInput
                v-model="text"
                :capitalize="capitalize"
                :numbers-only="numbersOnly"
                :max-length="maxLength"
                :restricted-keys="restrictedKeys"
                :allowable-keys="allowableKeys"
            ></VueInput>
        </div>
    </div>

    <div class="row mt-2 ps-2">
        <div>
            <input id="capitalize" type="checkbox" class="form-check-input me-1" v-model="capitalize">
            <label for="capitalize" class="form-check-label">Capitalize</label>
        </div>
        <div>
            <input id="numbers-only" type="checkbox" class="form-check-input me-1" v-model="numbersOnly">
            <label for="numbers-only" class="form-check-label">Numbers Only</label>
        </div>
        <div>
            <input id="restricted-keys" type="checkbox" class="form-check-input me-1" v-model="restrictedKeys">
            <label for="restricted-keys" class="form-check-label">Use Restricted Keys</label>
        </div>
        <div style="max-width: 200px;">
            <label for="max-length" class="form-check-label">Maximum Length</label>
            <input id="max-length" type="number" class="form-control me-1" v-model="maxLength">
        </div>
        <div><strong>INPUT TEXT:</strong> {{ text }}</div> 
        <div><strong>INPUT LENGTH:</strong> {{ text.length }}</div> 
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue"
import VueInput from "../src/VueInput.vue"

const allowableKeys: string[] = ['A', 'B', 'C']
const text = ref("")
const numbersOnly = ref(false)
const capitalize = ref(false)
const maxLength = ref(0)
const restrictedKeys = ref(false)

</script>