<template>
  <div class="flex " :class="nextIsRepeat ? 'nextIsRepeat' : ''">
    <div class="col name">
      <div>{{name}}</div>
      <div v-if="name2">{{name2}}</div>
    </div>
    <div class="col time">
      <template  v-if="!nextIsRepeat">
        {{time}}
      </template>
      <template v-else >
        {{repeatTimes[0]}}
        <template v-if="showExtraTimes">
          <div :key="repeatTime" v-for="repeatTime in repeatTimes.slice(1)">
            {{repeatTime}}
          </div>
        </template>

        <div class="red pointer" @click="showExtraTimes = !showExtraTimes">
          +{{repeatTimes.length - 1}} retries
        </div>
      </template>
    </div>
    <div class="col params m1" >
      <vue-json-pretty
        v-if="params"
        :deep="deep"
        :data="params"
        @click="handleClick"
        />
    </div>
    <div class="col returns m1" >
      <vue-json-pretty
        v-if="returns"
        :deep="deep"
        :data="returns"
        @click="handleClick"
       />
    </div>
  </div>
</template>

<script>
import { format, differenceInMilliseconds } from 'date-fns';
import VueJsonPretty from 'vue-json-pretty';

export default {
  name: 'Log',
  props: {
    i: {
      type: Number,
      default: 0,
    },
    results: {
      type: Object,
      default: {},
    },
    logs: {
      type: Array,
      default: [],
    },
    log: {
      type: Object,
      default: null,
    },
    result: {
      type: Object,
      default: null,
    },
    nextIsRepeat: {
      type: Boolean,
      default: false,
    },
    isRepeat: {
      type: Function,
      default: () => null,
    },
  },
  data() {
    return {
      deep: 0,
      showExtraTimes: false,
    };
  },
  methods: {
    handleClick(e) {
      console.log('handleClick');
      console.log(e);
    },
    getTime(log, result) {
      let time = format(log.time, 'HH:mm:ss.SSS');
      if (result) {
        const difference = differenceInMilliseconds(
          result.time,
          log.time,
        );
        time += ` (+${difference}ms)`;
      }
      return time;
    },
  },
  computed: {
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
    VueJsonPretty,
  },
};
</script>


<style>
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
