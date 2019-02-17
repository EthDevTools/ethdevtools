<template lang="pug">
.logs-viewer
  log(v-for='log in logs' :log='log')
  //- logs
</template>

<script>
import { mapGetters } from 'vuex';
import log from './logs-viewer/log.vue';
import Logs from '../components/Logs.vue';

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters(['logs']),
  },
  created() { },
  mounted() { },
  methods: { },
  components: {
    log,
    Logs,

  },
};
</script>

<style lang="less">
.logs-viewer {

}
</style>