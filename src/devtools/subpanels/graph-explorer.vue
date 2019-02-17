<template lang="pug">
.graph-explorer
  .config-selection.native-bar
    .select-style
      select(v-model='graphQLDropdown')
        option(disabled=true value='select') Select a GraphQL Endpoint/Example
        optgroup(label='Infura EthQL')
          option(value='block') Block
          option(value='account') Account
          option(value='transaction') Transaction
          option(value='log') Log
          option(value='decodedtransaction') Decoded Transaction
        optgroup(label='The Graph Subgraphs')
          option(value='dharma') Dharma
          option(value='compound') Compound
          option(value='uniswap') Uniswap
          option(value='ens') ENS
          option(value='origin') Origin
          option(value='decentraland') Decentraland
          option(value='livepeer') Livepeer
        optgroup(label='Custom')
          option(value='custom') Use Custom URL
    span(v-if='graphQLDropdown==="custom"') Enter GraphQL Endpoint URL:
    input(v-if='graphQLDropdown==="custom"' v-model='graphQLCustom')
    button(v-if='graphQLDropdown==="custom"' @click='goCustom') Load!
  .graphIQL
</template>

<script>
import { mapGetters } from 'vuex';

import React from 'react';
import ReactDOM from 'react-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import '../../../node_modules/graphiql/graphiql.css';

const graphConfigs = require('./graphql-examples.json');


export default {
  data: () => ({
    graphQLDropdown: 'select',
    graphQLCustom: null,
  }),
  computed: {
  },
  created() { },
  mounted() {
  },
  watch: {
    graphQLDropdown(newValue) {
      console.log('graphQLDropdown changed');
      console.log({ newValue });
      console.log(graphConfigs);
      if (newValue !== 'custom') {
        const { url } = graphConfigs[newValue];
        const defaultQuery = unescape(graphConfigs[newValue].defaultQuery);
        const explorerDiv = document.getElementsByClassName('graphIQL')[0];
        const fetcher = this.makeFetcher(url);
        const graphIQL = React.createElement(GraphiQL, { fetcher, query: defaultQuery }, null);
        ReactDOM.render(graphIQL, explorerDiv);
      } else {
        const explorerDiv = document.getElementsByClassName('graphIQL')[0];
        ReactDOM.render('Enter a graphQL endpoint to load.', explorerDiv);
      }
    },
  },
  methods: {
    goCustom() {
      const explorerDiv = document.getElementsByClassName('graphIQL')[0];
      const fetcher = this.makeFetcher(this.graphQLCustom);
      const graphIQL = React.createElement(GraphiQL, { fetcher, query: '' }, null);
      ReactDOM.render(graphIQL, explorerDiv);
    },
    makeFetcher(url) {
      function graphQLFetcher(graphQLParams) {
        return fetch(url, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(graphQLParams),
        }).then((response) => response.json());
      }
      return graphQLFetcher;
    },
  },
};
</script>

<style lang="less">
.graph-explorer {
  height: calc(100% - 27px);
}
.graphIQL {
  height: calc(100% - 18px);
}
html, body, .devtools-panel {
  height: 100%;
}

.select-style {
     border: 1px solid #ccc;
    display: inline-block;
    border-radius: 0;
    overflow: hidden;
    position: relative;
    height: 38px;
    margin-bottom: -3px;
    width: 250px;
    &:after {
      content: '▾';
      position: absolute;
      padding: 0 10px;
      right: 0px;
      top: 50%;
      margin-top: -7px;
      z-index: -1;
    }
}

.select-style select {
    padding: 10px 12px;
    display: inline-block;
    border: none;
    width: 130%;
    box-shadow: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
}

.select-style select:focus {
    outline: none;
}
</style>
