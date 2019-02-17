<template lang="pug">
.salt-watcher
  .watcher-div

</template>

<script>
import { mapGetters } from 'vuex';
import React from 'react';
import ReactDOM from 'react-dom';
import Watcher from './watcher.jsx';

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters(['contracts', 'accounts']),
  },
  created() { },
  mounted() {
    const watcher = React.createElement(Watcher, { contracts: this.contracts, accounts: this.accounts.accounts || [] }, null);
    const watcherDiv = document.getElementsByClassName('watcher-div')[0];
    ReactDOM.render(watcher, watcherDiv);
  },
  methods: { },
};
</script>

<style lang="less">
.salt-watcher {

}
</style>
