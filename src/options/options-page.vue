<template lang="pug">
#options-page
  h2 My Extension Options Page

  label
    span.input-label Setting #1
    input(type='text' v-model='setting1')
  label
    span.input-label Setting #2
    input(type='text' v-model='setting2')
  button(@click='saveButtonHandler') Save settings


</template>
<script>

import { broadcastMessage } from '@/lib/message-passing';
import { getSettings, setSettings } from '@/lib/storage-helpers';

export default {
  metaInfo: {
    title: 'My extension - options', // page title - will be visible on tab!
  },
  data() {
    return {
      setting1: null,
      setting2: null,
    };
  },
  computed: { },
  created() { },
  async beforeMount() {
    broadcastMessage('hello from options page');

    try {
      const loadedSettings = await getSettings(['setting1', 'setting2']);
      this.setting1 = loadedSettings.setting1;
      this.setting2 = loadedSettings.setting2;
    } catch (err) {
      alert('Problem fetching your extension settings'); // eslint-disable-line no-alert
      console.log(err);
    }
  },
  methods: {
    async saveButtonHandler() {
      try {
        const saved = await setSettings({
          setting1: this.setting1,
          setting2: this.setting2,
        });
      } catch (err) {
        alert('Problem saving your settings'); // eslint-disable-line no-alert
        console.log(err);
      }
    },
  },
};
</script>

<style lang="less">
#options-page {
  label {
    display: block;
    margin-bottom: 5px;
  }
  .input-label {
    display: inline-block;
    width: 100px;
  }
}
</style>
