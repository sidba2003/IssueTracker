<template>
  <v-card class="h-screen">
    <v-layout>
      <v-navigation-drawer expand-on-hover permanent rail>
        <v-list>
          <v-list-item
            :title="userCurrentData?.company?.name"
            v-if="userCurrentData?.company?.name !== null"
          ></v-list-item>
        </v-list>

        <v-divider v-if="userCurrentData?.company?.name !== null"></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            title="Home Page"
            @click="$router.push({ name: 'userHome' })"
            value="home"
          ></v-list-item>
          <v-list-item
            v-if="userCurrentData?.company_admin"
            @click="$router.push({ name: 'companyManagement' })"
            title="Company Management"
            value="companyManagement"
          ></v-list-item>
          <v-list-item
            title="Issues"
            @click="$router.push({ name: 'issues' })"
            value="issues"
          ></v-list-item>
          <v-list-item
            title="Projects"
            @click="$router.push({ name: 'projects' })"
            value="projects"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
import { useAuthenticationStore } from "../stores/AuthenticationStore";
import { useUserDataStore } from "../stores/UserDataStore";
import { mapState } from "pinia";

export default {
  data() {
    return {
      drawer: false,
      userCurrentData: null,
    };
  },
  watch: {
    userData(newVal, oldVal) {
      this.userCurrentData = newVal;
    },
  },
  computed: {
    getUseAuthenticationStore() {
      return useAuthenticationStore();
    },
    getUserDataStore() {
      return useUserDataStore();
    },
    ...mapState(useUserDataStore, ["userData"]),
  },
  async beforeMount() {
    try {
      const response = await this.getUseAuthenticationStore.makeRequest(
        "GET",
        "/api/current-user-information/",
        null
      );

      if (response.ok) {
        const respData = await response.json();

        this.getUserDataStore.setUserData(respData);
        console.log("User Data is >>", this.getUserDataStore.getUserData);
      } else {
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  },
};
</script>
