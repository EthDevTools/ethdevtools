<template lang='pug'>
.log.flex
  template(v-if='log.type === "send"')
    .col.name
      | {{ log.method }}
      span.repeat-count(v-if='log.count > 1') {{ log.count }}
      div(v-if='log.callName') {{ log.callName }}
    .col.time
      | {{ log.time | logtime }}
      .response-time(v-if='resultDelay') result +{{resultDelay}}ms
    .col.params.m1
      json(v-if='paramsData' :deep="deep" :data='paramsData')
    .col.returns.m1
      json(v-if='resultData' :deep="deep" :data='resultData')
  template(v-else-if='log.type === "message"')
    .col.name MESSAGE
    .col.time {{ log.time | logtime }}
    .col.m1.details {{ log.message }}
  template(v-else-if='log.type === "contract"')
    .col.name CONTRACT LOADED
    .col.time {{ log.time | logtime }}
    .col.m1.details Address:&nbsp;{{ log.address }}

</template>

<script>
import { format, differenceInMilliseconds } from 'date-fns';
import VueJsonPretty from 'vue-json-pretty';

export default {
  props: {
    log: {},
  },
  data() {
    return {
      showExtraTimes: false,
      deep: 1,

    };
  },
  methods: {
  },
  computed: {
    resultDelay() {
      if (!this.log.result) return null;
      return this.log.resultTime - this.log.time;
    },

    paramsData() {
      if (['eth_call', 'eth_sendTransaction'].includes(this.log.method)) {
        return { to: this.log.contractAddress, params: this.log.annotatedParams };
      }
      if (this.log.method === 'eth_getTransactionReceipt') {
        return { tx: this.log.params[0] };
      }
      return null;
    },
    resultData() {
      return this.log.annotatedResult;
    },
  },
  components: {
    json: VueJsonPretty,
  },
};
</script>


<style lang='less'>
.log {
  padding: 5px;
  border-bottom: 1px solid #EEE;
  .params, .returns {
    background-color: #eeeeee;
    border-radius: 5px;
    flex-grow: 1;
    word-wrap: break-word;         /* All browsers since IE 5.5+ */
    overflow-wrap: break-word;
  }
  .details {
    flex-grow: 1;
  }
  .response-time {
    color: #AAA;
    font-style: italic;
  }
  .repeat-count {
    font-size: 10px;
    display: inline-block;
    margin-left: 8px;
    height: 18px;
    width: 18px;
    line-height: 18px;
    text-align: center;
    vertical-align: middle;
    border-radius: 50%;
    color: white;
    background: #AAA;
  }
  .vjs__tree {
    font-size: 9px;
    line-height: 1.2em;
    padding: 3px;
    .vjs__tree {
      padding: 0;
    }
  }
}
</style>
