<template lang="pug">
.logs-viewer
  .settings.native-bar
    a.icon.clear-button(href='#' @click.prevent='clearLogs' title='Clear Logs')
      svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-ban fa-w-16 fa-3x")
        path(fill="currentColor" d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z")
  .header.flex.native-bar
    .col.name Name
    .col.time Time
    .col.grow-1.mx2 Params
    .col.grow-1.mx2 Result
  .logs
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
  methods: {
    clearLogs() {
      this.$store.commit('CLEAR_LOGS');
    },
  },
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

  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  top: 27px;
  bottom: 0px;

  .header {
    flex-grow: none;
  }
  .logs {
    flex: 1 0 0;
    width: 100%;
    overflow: auto;
  }

  .clear-button {
    opacity: .8;
    width: 26px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    &:hover {
      opacity: 1;
    }
    svg { fill: #000 };
  }
  .icon {
    width: 14px;
    height: 14px;
  }



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