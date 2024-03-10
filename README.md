# m9lib 

### A collection of Vue components 

This collection... well, there's only one component so far.

#### Overview

* It's all **Vue 3** and **TypeScript**. 
* Components are styled using **Bootstrap 5**.
* **More to come!** Maybe. Most definitely. Yeah. 


#### Getting Started

##### Install

```bash
pnpm install m9lib
pnpm install bootstrap

```

##### Usage

```vue
<template>
    <VueSelect
        :id="'exampleOne'"
        :options="options" 
        v-model="model" 
        @on-text-change="onTextChange"
        :filter="modelFilter"
        :format="modelFormat" 
        :allowable-keys="keys"
        :is-valid="false"
        :placeholder="'Search Here...'"
        :row-height="'30px'"
        :display-line-count="3"
        ></VueSelect>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import { VueSelect } from "mg9lib"
import type { FilterFunction, FormatFunction } from "mg9lib";

// our demo model type
type TestModel = {
    name: string
    key: string
}

// our array of demo options
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

// If we want to restrict what keyboard input we'd
// include this here. Any empty array allows all input.
const keys: string[] = []

// The function that filters the drop down list based on
// keyed input.
const modelFilter: FilterFunction<TestModel> = (option: TestModel, text: string): boolean => {
    return option.name.includes(text) || option.key.includes(text) 
}

// The function that formats the model type in the drop down display,
// as well as what is populated in the input box upon selection.
const modelFormat: FormatFunction<TestModel> = (option: TestModel): string => {
    return `${option.key}: ${option.name}` 
}


// Let's watch what happens when the model is updated
watch(model, (newValue) => {
    console.debug("selected option changed:")
    console.debug(newValue) 
})

// Oh yeah, and let's also capture changes in the keyed input.
const onTextChange = (text: string) => {
    console.debug(`keyed input: ${text}`)
}
</script>
```
