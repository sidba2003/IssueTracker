<template>
  <admin-home-view v-if="isCurrentUserAdmin" />
  <employee-home-view v-else />
</template>

<script>
import AdminHomeView from "./home/AdminHomeView.vue";
import EmployeeHomeView from "./home/EmployeeHomeView.vue";
import { useUserDataStore } from "../stores/UserDataStore";

export default {
  computed: {
    getUserDataStore() {
      return useUserDataStore();
    },
    isCurrentUserAdmin() {
      return this.getUserDataStore.userData.company_admin;
    },
  },
  components: {
    AdminHomeView,
    EmployeeHomeView,
  },
};
</script>
