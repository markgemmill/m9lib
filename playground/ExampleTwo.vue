<template>
    <div class="row mt-5">
        <div class="col-8">
            <p>Select from list of strings. Toggle error status.</p>
            <VueSelect 
                :id="'exampleTwo'"
                :options="stringOptions" 
                v-model="stringModel" 
                @on-text-change="onStringTextChange"
                :filter="stringModelFilter"
                :format="stringModelFormat" 
                :allowable-keys="keys"
                :invalid="exampleTwoInvalid"
                :error-msg="'Required'"
                :placeholder="'Search Here...'"
                :row-height="'30px'"
                :display-line-count="3"
                ></VueSelect>
        </div>
    </div>

    <div class="row mt-2 ps-2">
        <div>
            <input id="toggleError" type="checkbox" class="form-check-input me-1" v-model="exampleTwoInvalid">
            <label for="toggleError" class="form-check-label">Toggle Error</label>
        </div>
        <div><strong>INPUT TEXT:</strong> {{ stringInputText }}</div> 
        <div><strong>SELECTED TEXT:</strong> {{ stringModel }}</div> 
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import VueSelect from "../src/VueSelect.vue"
import type { FilterFunction, FormatFunction } from "../src/types";

const keys: string[] = []
const stringModel = ref("")
const stringInputText = ref("")
const stringOptions = ref<string[]>([
    "Jeffrey Wright",
    "Jeff Goldblum",
    "Leonardo DiCaprio",
    "Olivia Newton-John",
    "Ben Afflect",
    "Matt Daimon",
    "Vincent Deonifero",
    "Megan Kelly",
    "Robin Williams",
    "Ned Stark",
    "Russel Crow",
    "Idris Alba",
    "Natalie Portman",
])

const stringModelFilter: FilterFunction<string> = (option: string, text: string): boolean => {
    return option.indexOf(text) >= 0
}

const stringModelFormat: FormatFunction<string> = (option: string): string => {
    return option 
}

const exampleTwoInvalid = ref(false)

const onStringTextChange = (text: string) => {
    stringInputText.value = text 
}

</script>