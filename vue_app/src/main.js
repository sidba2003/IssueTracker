import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./routes.js"
import { createPinia } from 'pinia';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pinia = createPinia();

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App)
    .use(pinia)
    .use(vuetify)
    .use(router)
    .mount("#app");
