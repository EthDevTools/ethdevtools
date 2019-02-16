<template lang="pug">
  .devtools-panel
    h1 ETHDevTools
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
  .devtools-panel {

  }
</style>