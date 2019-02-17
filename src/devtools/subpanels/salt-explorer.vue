<template lang="pug">
.salt-explorer
  .explorer-div

</template>

<script>
import { mapGetters } from 'vuex';
import React from 'react';
import ReactDOM from 'react-dom';
import Explorer from './explorer.jsx';

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters(['contracts']),
  },
  created() { },
  mounted() {
    const explorer = React.createElement(Explorer, { contracts: this.contracts }, null);
    const explorerDiv = document.getElementsByClassName('explorer-div')[0];
    ReactDOM.render(explorer, explorerDiv);
  },
  methods: { },
};
</script>

<style lang="less">
.salt-explorer {

}
</style>
