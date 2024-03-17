import type { App } from "vue"
import VueSelect from "./VueSelect.vue"
import VueInput from "./VueInput.vue"
import VueTextarea from "./VueTextarea.vue"
export type { FormatFunction, FilterFunction } from "./types"


export default {
    install: (app: App) => {
        app.component('VueSelect', VueSelect) 
        app.component('VueInput', VueInput)
        app.component('VueTextarea', VueTextarea)
    }
}

export { VueSelect, VueInput, VueTextarea }
