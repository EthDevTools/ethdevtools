<template lang="pug">
  div
    h2 Dev tools tab 2
    div(v-for='(contract, index) in contracts' :key="`contract-${index}`")
</template>
<script>

import { broadcastMessage } from '@/lib/message-passing';
import { mapGetters } from 'vuex';

export default {
  metaInfo: {
    title: 'Devtools tab 2', // page title - will be visible on tab!
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters(['contracts']),
  },
  created() { },
  mounted() {
    broadcastMessage('dev tools tab 2 initialized');
  },
  methods: {
  },
};
</script>
<style lang="less">
</style>
