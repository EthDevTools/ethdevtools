<template lang='pug'>
.log.flex
  .col
    | {{ log.time | logtime }} {{ resultDelay }}
    span(v-if='resultDelay') (result +{{resultDelay}}ms)
  template(v-if='log.type === "send"')
    .col {{ log.method }}
    .col
      json(v-if='log.params' deep :data='log.params')
    .col
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


<style>
.log {
  padding: 5px;
  border-bottom: 1px solid #EEE;
}


.repeat {

}
.wide {
  flex-grow: 1;
}
.params, .returns {
  background-color: #eeeeee;
  border-radius: 5px;
  flex-grow: 1;
   word-wrap: break-word;         /* All browsers since IE 5.5+ */
  overflow-wrap: break-word;
}
</style>
