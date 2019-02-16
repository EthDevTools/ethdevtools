<template lang="pug">
  .devtools-panel
    nav.devtools-nav
      router-link(:to='{name: "logs"}') Logs
      router-link(:to='{name: "abi-playground"}') ABI Explorer
      router-link(:to='{name: "graph-explorer"}') GraphQL Explorers
      router-link(:to='{name: "salt-explorer"}') Address Events
    router-view

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
body {
  margin: 0;
  padding: 0;
  color: #5A5A5A;
  font-family: Arial, Helvetica, sans-serif;
}

.devtools-panel {
  padding: 0;
  margin: 0;
  .devtools-nav {
    width: 100%;
    background: #F3F3F3;
    border-bottom: 1px solid #D0D0D0;
    a {
      display: inline-block;
      color: #5A5A5A;
      text-decoration: none;
      font-size: 12px;
      line-height: 26px;
      height: 26px;
      padding: 0 14px;
      position: relative;
      &:hover {
        background: #EAEAEA;
      }
      &.router-link-active {
        &:after {
          content: '';
          display: block;
          height: 1px;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: -1px;
          background: #08A9F4;
        }
      }
    }
  }

}

.pointer {
  cursor: pointer;
}
.red {
  color: red;
}
#app {
  font-family: Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.col {
  width:25%;
}
.flex {
   display: flex;
 }
 .mx2 {
   margin-left: 2em;
   margin-right: 2em;
 }
 .m1 {
   margin:0em 1em 1em 0em;
 }
</style>
