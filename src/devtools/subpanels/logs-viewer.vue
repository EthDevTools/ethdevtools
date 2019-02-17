<template lang="pug">
.logs-viewer
  .flex.fixed
    .col.name Name
    .col.time Time
    .col.grow-1.mx2 Params
    .col.grow-1.mx2 Result

  log(v-for='log in condensedLogs' :log='log')
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
    ...mapGetters(['logs', 'condensedLogs']),
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
  font-size: 11px;
  line-height: 16px;
  .fixed {
    position: sticky;
    top:27px;
    background-color: white;
    z-index:1;
    border-bottom: 1px solid black;
    margin-bottom: 2em;
  }
  .col {
    padding:10px;
    font-size: 14px;
  }
  .name, .time {
    flex-grow: 0;
  }
  .name {
    width: 200px;
  }
  .time {
    width: 200px;
  }
  .grow-1 {
    flex-grow: 1;
  }


}
</style>