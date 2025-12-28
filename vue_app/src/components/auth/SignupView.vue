<template>
    <form action="" class="mx-auto ma-15 ga-1 d-flex flex-column justify-center w-25">
        <v-text-field
            v-model="firstName"
            :counter="10"
            label="First Name"
            :rules="firstNameRules"
        ></v-text-field>

        <v-text-field
            v-model="lastName"
            :counter="10"
            label="Last Name"
            :rules="lastNameRules"
        ></v-text-field>

        <v-text-field
            v-model="email"
            label="E-mail"
            :rules="emailRules"
        ></v-text-field>

        <v-text-field
            v-model="password"
            label="Password"
            :rules="passwordRules"
            type="password"
            required
        ></v-text-field>

        <v-text-field
            v-model="passwordConfirmation"
            label="Confirm Password"
            :rules="passwordConfirmationRules"
            type="password"
            required
        ></v-text-field>

        <v-btn
            class="me-4"
            @click.prevent="submitData()"
        >
            submit
        </v-btn>
    </form>

    <v-snackbar
        v-model="failedSnackbar"
        multi-line
    >
        {{ failedSnackbarMessage }}

        <template v-slot:actions>
            <v-btn
                color="red"
                variant="text"
                @click="closeFailedSnackbar()"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>

    <v-snackbar
        v-model="successSnackbar"
        multi-line
    >
        User has been created. Try logging in!

        <template v-slot:actions>
            <v-btn
                color="red"
                variant="text"
                @click="successSnackbar = false"
            >
                Close
            </v-btn>
        </template>
    </v-snackbar>
</template>
<script>
    export default {
        data() {
            return {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                passwordConfirmation: '',
                failedSnackbar: false,
                failedSnackbarMessage: '',
                successSnackbar: false,
                firstNameRules: [
                    value => {
                        if (value) return true
                        return 'First name is required.'
                    }
                ],
                lastNameRules: [
                    value => {
                        if (value) return true
                        return 'Last name is required.'
                    },
                ],
                emailRules: [
                    value => {
                        if (value) return true
                        return 'E-mail is required.'
                    },
                    value => {
                        if (/.+@.+\..+/.test(value)) return true
                        return 'E-mail must be valid.'
                    },
                ],
                passwordRules: [
                    value => {
                        if (value) return true
                        return 'Password is required.'
                    }
                ],
                passwordConfirmationRules: [
                    value => {
                        if (value === this.password) return true;
                        return 'Confirmation Password should match.'
                    }
                ]
            }
        },
        methods: {
            async submitData() {
                const url = "/api/signup/";
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Accept":"application/json", 
                            "Content-Type":"application/json"
                        },
                        body: JSON.stringify({ 
                            first_name: this.firstName,
                            last_name: this.lastName,
                            email: this.email,
                            password: this.password
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }

                    this.successSnackbar = true;
                    console.log("user created!");

                    this.firstName = ''
                    this.lastName = ''
                    this.email = ''
                    this.password = ''
                    this.passwordConfirmation = ''

                } catch (error) {
                    this.failedSnackbarMessage = error.message;
                    this.failedSnackbar = true;
                    console.error(error.message);
                }
            },
            closeFailedSnackbar() {
                this.failedSnackbarMessage = '';
                this.failedSnackbar = false;
            }
        }
    }
</script>