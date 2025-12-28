import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import AuthView from './components/AuthView.vue'
import { useAuthenticationStore } from './stores/AuthenticationStore'

const routes = [
    { path: '/', component: HomeView, name: 'home' },
    { path: '/authentication', component: AuthView, name: 'authentication' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

async function checkUserIsAuthenticated(authenticationStore){
    const headers =  {
                    "Accept":"application/json", 
                    "Content-Type":"application/json"
                }
    
    const url = "/api/is-authenticated/";
    try {
        const response = await authenticationStore.makeRequest('POST', headers, url, {});
        if (response?.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.message);
        return false;
    }
}

router.beforeEach(async (to, from) => {
    const authenticationStore = useAuthenticationStore();

    const isAuthenticated = await checkUserIsAuthenticated(authenticationStore);

    console.log(isAuthenticated, to.name)
    if (!isAuthenticated && to.name !== 'authentication') {
        return { name: 'authentication' }
    }

    console.log("Auth check executed before going to new route successfuly!")
})