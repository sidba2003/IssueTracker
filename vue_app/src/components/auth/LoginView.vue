<template>
  <form action="" class="mx-auto ma-15 ga-1 d-flex flex-column justify-center w-25">
    <v-text-field v-model="email" label="E-mail"></v-text-field>

    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      required
    ></v-text-field>

    <v-btn class="me-4" @click.prevent="submitData()"> submit </v-btn>
  </form>

  <v-snackbar v-model="failedSnackbar" multi-line>
    Please enter the correct credentials!

    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="failedSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { useAuthenticationStore } from "../../stores/AuthenticationStore";

export default {
  data() {
    return {
      email: "",
      password: "",
      failedSnackbar: false,
    };
  },
  computed: {
    authStore() {
      return useAuthenticationStore();
    },
  },
  methods: {
    async submitData() {
      const url = "/auth/token/";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const respData = await response.json();
        console.log("Recieved tokens are >> ", respData);

        this.authStore.setAccessAndRefreshTokens(respData.access, respData.refresh);

        console.log("user logged in!!");

        this.$router.push({ name: "userHome" });
      } catch (error) {
        this.failedSnackbar = true;
        console.error(error.message);
      }
    },
  },
};
</script>
