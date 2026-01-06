<template>
  <div class="d-flex flex-column justify-center align-center h-screen">
    <div class="text-h5 ga-3 d-flex align-center">
      Edit Company Name: {{ companyName }}
      <svg-icon
        class="align-center"
        @click="editCompanyName"
        type="mdi"
        :path="path"
      ></svg-icon>
    </div>

    <template v-if="showCompanyNameEditCard">
      <v-card>
        <v-text-field
          v-model="newCompanyName"
          label="Company Name"
          required
        ></v-text-field>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close Dialog" @click="showCompanyNameEditCard = false"></v-btn>
          <v-btn v-if="isNewCompanyName" text="Save" @click="saveNewCompanyName"></v-btn>
        </v-card-actions>
      </v-card>
    </template>

    <v-snackbar v-model="successSnackBar" multi-line>
      Company name Changed Successfully!

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="successSnackBar = false"> Close </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="failedSnackbar" multi-line>
      Something went wrong while trying to change the company name!

      <template v-slot:actions>
        <v-btn color="red" variant="text" @click="failedSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import SvgIcon from "@jamescoyle/vue-icon";
import { mapState } from "pinia";
import { mdiPencil } from "@mdi/js";
import { useUserDataStore } from "../stores/UserDataStore";
import { useAuthenticationStore } from "../stores/AuthenticationStore";

export default {
  data() {
    return {
      path: mdiPencil,
      companyName: null,
      showCompanyNameEditCard: false,
      newCompanyName: null,
      failedSnackbar: false,
      successSnackBar: false,
    };
  },
  watch: {
    userData(newVal, oldVal) {
      this.companyName = newVal?.company?.name;
    },
  },
  computed: {
    getUserDataStore() {
      return useUserDataStore();
    },
    getAuthenticationStore() {
      return useAuthenticationStore();
    },
    isNewCompanyName() {
      return this.newCompanyName !== this.companyName;
    },
    ...mapState(useUserDataStore, ["userData"]),
  },
  methods: {
    editCompanyName() {
      this.newCompanyName = this.companyName;
      this.showCompanyNameEditCard = true;
    },
    async saveNewCompanyName() {
      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
      const body = {
        company_name: this.newCompanyName,
      };

      try {
        const response = await this.getAuthenticationStore.makeRequest(
          "PUT",
          headers,
          "/api/update-company-name/",
          body
        );
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        this.getUserDataStore.setCompanyName(this.companyName);
        this.showCompanyNameEditCard = false;
        this.successSnackBar = true;
      } catch (error) {
        this.failedSnackbar = true;
        console.log(error.message);
      }
    },
  },
  components: {
    SvgIcon,
  },
};
</script>
