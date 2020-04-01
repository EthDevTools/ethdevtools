<template lang="pug">
.logs-viewer
  .settings.native-bar
    span.no-move
      a.icon.clear-button(href='#' @click.prevent='clearLogs' title='Clear Logs')
        svg(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-ban fa-w-16 fa-3x")
          path(fill="currentColor" d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z")
    span
      label
        input(type='checkbox' v-model='groupSimilar')
        span Group similar
    span
      b.mr1 Hide:
      label
        input(type='checkbox' v-model='hideEthAccounts')
        span eth_accounts
      label
        input(type='checkbox' v-model='hideNetVersion')
        span net_version
      label
        input(type='checkbox' v-model='hideEthGetBalance')
        span eth_getBalance
  .header.flex.native-bar
    .col.name Name
    .col.time Time
    .col.grow-1.mx2 Params
    .col.grow-1.mx2 Result
  .logs
    single-log(v-for='log in condensedLogs' :log='log' :key="`${log.requestId}+${log.time}`")
  //- logs
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import { broadcastMessage } from '@/lib/message-passing';

export default {
  components: {
    'single-log': require('./single-log').default,
  },
  metaInfo: {
    title: 'Web3 Logs', // page title - will be visible on tab!
  },
  data: () => ({
    groupSimilar: true,
    hideEthAccounts: false,
    hideNetVersion: true,
    hideEthGetBalance: false,
  }),
  computed: {
    ...mapGetters(['logs']),
    condensedLogs() {
      const clogs = [];
      let lastLog;
      _.each(this.logs, (log) => {
        if (this.hideNetVersion && log.method === 'net_version') return;
        if (this.hideEthAccounts && log.method === 'eth_accounts') return;
        if (this.hideEthGetBalance && log.method === 'eth_getBalance') return;

        if (
          this.groupSimilar
          && lastLog
          && log.type === 'send'
          && log.method === lastLog.method
          && JSON.stringify(log.params) === JSON.stringify(lastLog.params)
          && (!log.result || JSON.stringify(log.result) === JSON.stringify(lastLog.result))
        ) {
          lastLog.count++;
        } else {
          const newLog = _.cloneDeep(log);
          newLog.count = 1;
          clogs.push(newLog);
          lastLog = newLog;
        }
      });
      return clogs.reverse();
    },
  },
  created() { },
  mounted() { },
  methods: {
    clearLogs() {
      this.$store.commit('CLEAR_LOGS');
    },
  },
};
</script>

<style lang="less">
.mr1 {
  margin-right:5px;
}
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
    padding:0px 5px;
  }
  .logs {
    flex: 1 0 0;
    width: 100%;
    overflow: auto;
  }

  .clear-button {
    display: inline-block;
    opacity: .5;
    width: 26px;
    line-height: 26px;
    text-align: center;
    cursor: pointer;
    color: #000;
    padding: 3px 5px;
    &:hover {
      opacity: 1;
    }
  }
  .icon {
    width: 14px;
    height: 14px;
  }
  .settings {
    > span {
      height:29px;
      overflow: hidden;
      margin-right: 5px;
      display: inline-block;
    }
    label {
      margin-right: 5px;
    }
  }

  .fixed {
    position: sticky;
    top:27px;
    background-color: white;
    z-index:1;
    border-bottom: 1px solid black;
    margin-bottom: 2em;
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
