<template>
    <div id="app" class="container p-5">
        <div class="col">

            <div class="row mb-2">
                <h3>Vue Select Control</h3>
                <p>Select control accepts any text and provides a lookup
                    on the supplied properties.
                </p>
            </div>

            <ExampleOne :tabindex="1"></ExampleOne>
            <ExampleTwo :tabindex="2"></ExampleTwo>
            <ExampleThree :tabindex="3"></ExampleThree>

            <div class="row mb-2 mt-5">
                <h3>Vue Input Control</h3>
                <p>Input control that can restrict input to numbers, capitalize, and restrict keys.</p>
            </div>
            <InputExampleOne :tabindex="4"></InputExampleOne>

            <div class="row mb-2 mt-5">
                <h3>Vue Textarea Control</h3>
                <p>Textarea control that can capitalize, and restrict keys.</p>
            </div>
            <TextareaExampleOne :tabindex="4"></TextareaExampleOne>
        </div>
    </div>
</template>
<script setup lang="ts">
import ExampleOne from "./ExampleOne.vue"
import ExampleTwo from "./ExampleTwo.vue"
import ExampleThree from "./ExampleThree.vue"
import InputExampleOne from "./InputExampleOne.vue";
import TextareaExampleOne from "./TextareaExampleOne.vue";
</script>
<style scoped></style>