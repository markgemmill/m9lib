import type { App } from "vue"
import VueSelect from "./VueSelect.vue"
import VueInput from "./VueInput.vue"
export type { FormatFunction, FilterFunction } from "./types"


export default {
    install: (app: App) => {
        app.component('VueSelect', VueSelect) 
        app.component('VueInput', VueInput)
    }
}

export { VueSelect, VueInput }
