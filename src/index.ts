// import type { App } from "vue"
import MgVueSelect from "./MgVueSelect.vue"
export type { FormatFunction, FilterFunction } from "./types"


export default {
    install: (app: any) => {
        app.component('MgVueSelect', MgVueSelect) 
    }
}

export { MgVueSelect }
