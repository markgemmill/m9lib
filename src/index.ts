import type { App } from "vue"
import VueSelect from "./VueSelect.vue"
export type { FormatFunction, FilterFunction } from "./types"


export default {
    install: (app: App) => {
        app.component('VueSelect', VueSelect) 
    }
}

export { VueSelect }
