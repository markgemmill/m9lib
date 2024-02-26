// import type { App } from "vue"
import SpecialSelect from "./SpecialSelect.vue"
export type { FormatFunction, FilterFunction } from "./@types/types"


export default {
    install: (app: any) => {
        app.component('SpecialSelect', SpecialSelect) 
    }
}

export { SpecialSelect }