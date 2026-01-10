import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './components/HomeView.vue'
import AuthView from './components/AuthView.vue'
import { useAuthenticationStore } from './stores/AuthenticationStore'
import UserHomeView from './components/UserHomeView.vue'
import CompanyManagementView from './components/CompanyManagementView.vue'
import IssuesView from './components/IssuesView.vue'
import ProjectsView from './components/ProjectsView.vue'

const routes = [
    { path: '/', component: HomeView, name: 'home', children: [
        { path: '', component: UserHomeView, name: 'userHome' },
        { path: 'company-management', component: CompanyManagementView, name: 'companyManagement' },
        { path: 'issues', component: IssuesView, name: 'issues' },
        { path: 'projects', component: ProjectsView, name: 'projects' }
    ]},
    { path: '/authentication', component: AuthView, name: 'authentication' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})

async function checkUserIsAuthenticated(authenticationStore){
    const url = "/api/is-authenticated/";
    try {
        const response = await authenticationStore.makeRequest('GET', url, null);
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