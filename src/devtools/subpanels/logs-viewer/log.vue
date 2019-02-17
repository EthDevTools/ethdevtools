<template lang='pug'>
.log.flex
  template(v-if='log.type === "send"')
    .col.name
      | {{ log.method }}
      span.repeat-count(v-if='log.count > 1') {{ log.count }}
    .col.time
      | {{ log.time | logtime }}
      .response-time(v-if='resultDelay') result +{{resultDelay}}ms
    .col.params.m1
      json(v-if='log.annotatedParams' deep :data='log.annotatedParams')
    .col.returns.m1
      json(v-if='log.result' deep :data='log.result')

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
      deep: 0,
      showExtraTimes: false,
    };
  },
  methods: {
  },
  computed: {
    resultDelay() {
      if (!this.log.result) return null;
      return this.log.resultTime - this.log.time;
    },
    repeatTimes() {
      if (!this.nextIsRepeat) return [];
      let repeats = [];
      for (let i = this.i + 1; i < this.logs.length; i++) {
        if (!this.isRepeat(i)) break;
        repeats.push(i);
      }
      repeats = repeats.map((i) => {
        const log = this.logs[i];
        const result = this.results[this.logs[i].id];
        return this.getTime(log, result);
      });
      return repeats;
    },
    params() {
      return this.log.params;
    },
    returns() {
      return this.result && this.result.params;
    },
    name() {
      return this.log.method;
    },
    name2() {
      return this.log.name ? this.log.name : false;
    },
    time() {
      return this.getTime(this.log, this.result);
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
}
</style>
