<template lang="pug">
.logs-viewer
  h1 test
  logs
</template>

<script>
// import { mapGetters } from 'vuex';
import Logs from '../components/Logs';

export default {
  data: () => ({
  }),
  computed: {
    // ...mapGetters(['logs']),
  },
  created() { },
  mounted() { },
  methods: { },
  components: {
    Logs,
  },
};
</script>

<style lang="less">
.logs-viewer {

}
</style>