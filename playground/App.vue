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

        </div>
    </div>
</template>
<script setup lang="ts">
import ExampleOne from "./ExampleOne.vue"
import ExampleTwo from "./ExampleTwo.vue"
import ExampleThree from "./ExampleThree.vue"
</script>
<style scoped></style>