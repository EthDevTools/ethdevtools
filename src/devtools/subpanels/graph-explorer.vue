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
    .custom-graph(v-if="graphQLDropdown==='custom'")
      span Enter GraphQL Endpoint URL:
      input(v-model='graphQLCustom')
      button(@click='goCustom') Load!
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
    display: inline-block;
    border-radius: 0;
    overflow: hidden;
    position: relative;
    margin-bottom: -3px;
    width: 250px;
    &:before {
      content: '▾';
      position: absolute;
      padding: 0 10px;
      left: 0;
      top: 50%;
      margin-top: -13px;
      z-index: 0;
    }
}

.select-style select {
    padding: 7px 25px;
    display: inline-block;
    border: none;
    position: relative;
    z-index: 1;
    width: 130%;
    box-shadow: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
}

.select-style select:focus {
    outline: none;
}

.custom-graph {
  display: inline-block;
  overflow: hidden;
  margin-bottom: -3px;
  input {
    margin: 0px 10px;
  }
}
</style>
