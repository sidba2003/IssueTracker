<template>
  <v-btn @click="toggleUserAddPopup">+ Add User</v-btn>

  <v-sheet :elevation="8" v-if="showAddUserPopup" class="mx-auto w-25 pa-2" border>
    <v-form
      validate-on="submit lazy"
      class="d-flex flex-column justify-center align-center ga-3"
      @submit.prevent="submitNewUserData"
    >
      <v-text-field v-model="email" class="w-50" label="Email"></v-text-field>
      <v-text-field v-model="first_name" class="w-50" label="First name"></v-text-field>
      <v-text-field v-model="last_name" class="w-50" label="Last name"></v-text-field>
      <v-text-field v-model="password" class="w-50" label="password"></v-text-field>

      <v-btn @click="toggleUserAddPopup">Cancel</v-btn>
      <v-btn text="Submit" type="submit">Submit</v-btn>
    </v-form>
  </v-sheet>

  <v-snackbar v-if="snackBarMessage !== null" multi-line>
    {{ snackBarMessage }}
    <template v-slot:actions>
      <v-btn color="red" variant="text" @click="snackBarMessage = null"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { useUserDataStore } from "../../stores/UserDataStore";
import { useAuthenticationStore } from "../../stores/AuthenticationStore";

export default {
  data() {
    return {
      showAddUserPopup: false,
      email: null,
      first_name: null,
      last_name: null,
      password: null,
      snackBarMessage: null,
    };
  },
  computed: {
    getUserDataStore() {
      return useUserDataStore();
    },
    getAuthenticationStore() {
      return useAuthenticationStore();
    },
  },
  methods: {
    toggleUserAddPopup() {
      this.setUserCreateFieldToNull();
      this.showAddUserPopup = !this.showAddUserPopup;
    },
    setUserCreateFieldToNull() {
      (this.email = null),
        (this.first_name = null),
        (this.last_name = null),
        (this.password = null);
    },
    async submitNewUserData() {
      const body = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password,
        company: this.getUserDataStore.userData.company.id,
      };

      try {
        const response = await this.getAuthenticationStore.makeRequest(
          "POST",
          "/api/company-user-management/",
          body
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        this.snackBarMessage = "New user created successfuly.";
      } catch (error) {
        this.snackBarMessage = "Something went wrong while trying to create a new user.";
      }
    },
  },
};
</script>
