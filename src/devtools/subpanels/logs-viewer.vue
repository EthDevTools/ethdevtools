<template lang="pug">
.logs-viewer
  h1 Logs Viewer
  ul
    li(v-for='log in logs') {{ log.label }}
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data: () => ({
  }),
  computed: {
    ...mapGetters(['logs']),
  },
  created() { },
  mounted() { },
  methods: { },
};
</script>

<style lang="less">
.logs-viewer {

}
</style>