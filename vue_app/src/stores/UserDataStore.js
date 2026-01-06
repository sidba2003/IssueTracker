import { defineStore } from 'pinia'

const useUserDataStore = defineStore('userData', {
    state: () => ({ userData: null }),
    getters: {
        getUserData() {
            return this.userData;
        },
    },
    actions: {
        setUserData(userData) {
            this.userData = userData;
        },
        setCompanyName(name) {
            this.userData.company.name = name;
        }
    }
})

export {
    useUserDataStore
}