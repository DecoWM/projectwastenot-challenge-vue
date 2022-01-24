<template>
  <div id="app">
    <CustomTable />
  </div>
</template>

<script>
import CustomTable from "./components/CustomTable.vue";

export default {
  name: "App",
  components: {
    CustomTable,
  },
};
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 40px;
}
</style>
