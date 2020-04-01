<template lang="pug">
  div
    h2 Dev tools tab 2

</template>
<script>

import { broadcastMessage } from '@/lib/message-passing';

export default {
  metaInfo: {
    title: 'Devtools tab 2', // page title - will be visible on tab!
  },
  data: () => ({
  }),
  computed: { },
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
