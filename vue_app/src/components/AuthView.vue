<template>
    <v-card>
        <v-tabs
            align-tabs="center"
            color="deep-purple-accent-4"
            v-model="tab"
        >
            <v-tab value="login">Login</v-tab>
            <v-tab value="signup">Signup</v-tab>
        </v-tabs>

        <v-divider />

        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                value="login"
            >
                <LoginView />
            </v-tabs-window-item>
            <v-tabs-window-item
                value="signup"
            >
                <SignupView />
            </v-tabs-window-item>
        </v-tabs-window>
    </v-card>
</template>
<script>
    import LoginView from './auth/LoginView.vue';
    import SignupView from './auth/SignupView.vue';

    export default {
        data() {
            return {
                tab: null
            }
        },
        components: {
            LoginView,
            SignupView
        }
    }
</script>