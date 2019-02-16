<template lang="pug">
.graph-explorer
  test
</template>

<script>
import { mapGetters } from 'vuex';
import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import '../../../node_modules/graphiql/graphiql.css';

function graphQLFetcher(graphQLParams) {
  return fetch(`${window.location.origin}/graphql`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then((response) => response.json());
}

export default {
  data: () => ({
  }),
  computed: {
  },
  created() { },
  mounted() {
    const explorerDiv = document.getElementsByClassName('graph-explorer')[0];
    const graphIQL = React.createElement(GraphiQL, { fetcher: graphQLFetcher }, null);
    ReactDOM.render(graphIQL, explorerDiv);
  },
  methods: { },
};
</script>

<style lang="less">
.graph-explorer {
  height: calc(100% - 27px);
}
html, body, .devtools-panel {
  height: 100%;
}
</style>
