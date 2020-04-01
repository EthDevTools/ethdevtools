<template lang="pug">
#action-popup-pane
  //- TODO: display message if web3 has been detected or not
  div ETHDevTools
  button(@click='buttonClickHandler') Send test message
</template>

<script>


import { broadcastMessage } from '@/lib/message-passing';
import { openExtensionOptionsPage } from '@/lib/chrome-helpers';

export default {
  data: () => ({
    message: '',
  }),
  computed: { },
  created() { },
  mounted() {
  },
  methods: {
    async buttonClickHandler() {
      this.message = await broadcastMessage({ ping: true });
    },
  },
};
</script>

<style lang="less">
#action-popup-pane {
  min-width: 200px;
  padding: 5px;
}
</style>
