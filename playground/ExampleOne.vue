<template>
    <div class="row mt-5">
        <div class="col-8">
            <p>Select from list of object options.</p>
            <VueSelect
                id="'exampleOne'"
                placeholder="'Search Here...'"
                class="form-control form-control-lg"
                :options="options" 
                v-model="model" 
                @on-text-change="onTextChange"
                :filter="modelFilter"
                :format="modelFormat" 
                :allowable-keys="keys"
                :is-valid="false"
                :row-height="'30px'"
                :display-line-count="3"
                ></VueSelect>
        </div>
    </div>

    <div class="row mt-2 ps-2">
        <div><strong>INPUT TEXT:</strong> {{ inputText }}</div> 
        <div><strong>SELECTED MODEL:</strong> {{ model }}</div> 
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import VueSelect from "../src/VueSelect.vue"
import type { FilterFunction, FormatFunction } from "../src/types";

type TestModel = {
    name: string
    key: string
}

const options = ref<TestModel[]>([
    { key: "ABC", name: "The Kids"},
    { key: "DEF", name: "Loss of Hearing"},
    { key: "GHI", name: "Do It Like Ghengis"},
    { key: "JKL", name: "Wasn't Assassinated"},
    { key: "MNO", name: "Smallish Fish"},
    { key: "PQR", name: "French Stowaways"},
    { key: "STU", name: "Mr. Little"},
    { key: "VWX", name: "Zombie Apocalpyse"},
    { key: "YZ0", name: "End of Times"},
    { key: "BCD", name: "All The Dope"},
    { key: "EFG", name: "French Towers"},
    { key: "HIJ", name: "Ossama Bin Ladin"},
    { key: "KLM", name: "Secret Service"},
    { key: "NOP", name: "That's Right, I Ain't"},
    { key: "QRS", name: "Gay Republican Army"},
    { key: "TUV", name: "Recreational Tank Car"},
    { key: "WXY", name: "I Asked the Same Question"},
    { key: "Z00", name: "Future Animal Farm"},
])
const model = ref<TestModel>()
const inputText = ref("")
const keys: string[] = []

const modelFilter: FilterFunction<TestModel> = (option: TestModel, text: string): boolean => {
    return option.name.includes(text) || option.key.includes(text) 
}

const modelFormat: FormatFunction<TestModel> = (option: TestModel): string => {
    return `${option.key}: ${option.name}` 
}


watch(model, (newValue) => {
    console.debug("selected option changed:")
    console.debug(newValue) 
})

const onTextChange = (text: string) => {
    inputText.value = text 
}
</script>../lib/@types/types../src/types../src/VueSelect.vue