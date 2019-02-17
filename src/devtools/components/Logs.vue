<template>
  <div >
      <div class="flex">
        <div class="col name">Name3</div>
        <div class="col time">Time</div>
        <div class="col grow-1 mx2">Parameters</div>
        <div class="col grow-1 mx2">Returns</div>
      </div>
      <template v-for="(log, i) in sends">
        <!-- <div :key="i">{{i}} - {{log}}</div> -->
        <log
        :i="i"
        :logs="sends"
        :results="results"
        :isRepeat="repeat"
        :key="log.id"
        :log="log"
        :result="results[log.id]"
        :nextIsRepeat="repeat(i + 1)"
        v-if="!repeat(i) && hasResult(i)" />
      </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
import Log from './Log';

  export default {
    name: 'Logs',
    computed: {
      ...mapState(['sends', 'results']),
    },
    methods: {
      hasResult(i) {
        const send = this.sends[i];
        console.log({ send });
        const result = this.results[send.id];
        console.log({ result });
        return !!result;
      },
      repeat(i) {
        const curr = this.sends[i];
        if (!curr) return false;
        const prev = this.sends.length >= i ? this.sends[i - 1] : null;

        if (!prev) return false;
        return prev.method === curr.method
          && JSON.stringify(prev.params) === JSON.stringify(curr.params)
          && this.results[curr.id]
          && this.results[prev.id]
          && JSON.stringify(this.results[curr.id].params) === JSON.stringify(this.results[prev.id].params);
      },
    },
    components: {
      Log,
    },
  };
</script>

<style >
.col {
  padding:10px;
  font-size: 14px;
}
.name, .time {
  flex-grow: 0;
}
.name {
  width: 200px;
}
.time {
    width: 200px;
}
 .grow-1 {
   flex-grow: 1;
 }
</style>