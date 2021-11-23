<template>
<div>
  <!-- FORM ONLY -->
  <div class="field">
    <label class="label">Description</label>
    <div class="control">
      <input v-model="task.name"
      class="input" type="text" placeholder="describe the task">
    </div>
  </div>
  <div class="field">
    <label class="label">Schedule (cron)</label>
    <div class="control">
      <input v-model="task.cron"
      class="input" type="text" placeholder="schedule in cron format">
    </div>
  </div>

  <div class="field">
    <label class="label">Type</label>
    <div class="control">
      <div class="select">
        <select v-model="task.type">
          <option v-for="(taskType, i) in available_tasks" :key="i + 'asd'">
            {{ taskType }}
          </option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Control</label>
    <div class="control">
      <div class="select">
        <select v-model="task.control">
          <option v-for="(c, index) in device.controls" :key="'ccon'+index"
          :value="c.name">{{ c.description }}</option>
        </select>
      </div>
    </div>
  </div>

  <div class="field">
    <label class="label">Sensor</label>
    <div class="control">
      <div class="select">
        <select v-model="task.sensor">
          <option v-for="(s, index) in device.sensors" :key="'ssens'+index"
          :value="s.name">{{ s.description }}</option>
        </select>
      </div>
    </div>
  </div>

  <!-- META -->
  <label class="label">Metadata</label>
  <div v-for="(meta, i) in Object.entries(task.meta)" :key="i + 'meta'" class="field">
    <div class="control has-icons-left">
      <input class="input" :placeholder="i + 1 + '. key'"
             v-model="tmpMetaKeys[i]" v-on:input="modifyMetaKey($event, meta[0], i)">
      <span class="icon is-left">
        <i class="fas fa-key"></i>
      </span>
    </div>
    <div class="control has-icons-left mt-1">
      <input class="input" placeholder="value" v-model="task.meta[meta[0]]">
      <span class="icon is-left">
        <i class="fas fa-font"></i>
      </span>
    </div>
    <hr>
  </div>

  <button class="button is-fullwidth"
  v-on:click="task.meta.newKey = ''; tmpMetaKeys.push['xx']">
    <i class="fa fa-plus"></i>
  </button>
</div>
</template>

<script>
import axios from 'axios';
import { HOST_URL } from './Constants.vue';

export default {
  props: ['device', 'task'],

  data() {
    return {
      // isEdit: false,

      tmpMetaKeys: [],
      available_tasks: [],
      addTaskError: null,
    };
  },

  methods: {

    modifyMetaKey(event, oldKey, index) {
      // on key input change, update the actual task's meta
      const newKey = this.tmpMetaKeys[index];
      this.task.meta[newKey] = this.task.meta[oldKey];
      delete this.task.meta[oldKey];
    },

    postTask() {
      const path = `${HOST_URL}/devices/${this.device.id}/tasks`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      axios.post(path, this.task, options)
        .then(() => {
          this.toggleEdit();
          this.addTaskError = null;
        })
        .catch((err) => {
          this.addTaskError = err.response.data;
        });
      this.editing_mode = false;
    },
  },

  created() {
    this.tmpMetaKeys = Object.keys(this.task.meta);
    // fetch availavle task types
    const rootPath = `${HOST_URL}/`;
    axios.get(rootPath)
      .then((res) => {
        this.available_tasks = res.data.tasks;
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

</script>

<style>

</style>
