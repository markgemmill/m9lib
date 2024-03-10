<template>
    <div class="row mt-5">
        <div class="col-8">
            <p>Restrict input to numbers. </p>
            <VueSelect 
                :id="'exampleThree'"
                :options="options" 
                v-model="model" 
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
        <div><strong>SELECTED TEXT:</strong> {{ model }}</div> 
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import VueSelect from "../src/VueSelect.vue"
import type { FilterFunction, FormatFunction } from "../src/types";

type OptionType = {
    id: number
    name: string
}

const keys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const model = ref<OptionType>()
const stringInputText = ref("")

const options = ref<OptionType[]>([
    {id: 9823568, name: "Jeffrey Wright"},
    {id: 9827345, name: "Jeff Goldblum"},
    {id: 8733562, name: "Leonardo DiCaprio"},
    {id: 7623564, name: "Olivia Newton-John"},
    {id: 1742958, name: "Ben Afflect"},
    {id: 2938474, name: "Matt Daimon"},
    {id: 4912309, name: "Vincent Deonifero"},
    {id: 5983420, name: "Megan Kelly"},
    {id: 8729284, name: "Robin Williams"},
    {id: 8734632, name: "Ned Stark"},
    {id: 4298874, name: "Russel Crow"},
    {id: 1092834, name: "Idris Alba"},
    {id: 2948573, name: "Natalie Portman"},
])

const stringModelFilter: FilterFunction<OptionType> = (option: OptionType, text: string): boolean => {
    return option.id.toString().indexOf(text) >= 0
}

const stringModelFormat: FormatFunction<OptionType> = (option: OptionType): string => {
    return `${option.id}: ${option.name}` 
}

const exampleTwoInvalid = ref(false)

const onStringTextChange = (text: string) => {
    stringInputText.value = text 
}

</script>