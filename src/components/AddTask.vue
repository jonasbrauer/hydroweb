<template>
<div>
  <!-- add task -->
  <button v-on:click="toggleEdit()" class="button is-success is-fullwidth mt-2"
  v-bind:disabled="isEdit">
  <i class="fa fa-plus"></i></button>

  <!-- MODAL add task -->
  <div v-if="isEdit" class="card mt-1 mt-4">
    <header class="card-header">
      <p class="card-header-title is-1">Add task</p>
    </header>
    <div class="card-content">

      <div class="field">
        <label class="label">Description</label>
        <div class="control">
          <input v-model="addTaskData.name"
          class="input" type="text" placeholder="describe the task">
        </div>
      </div>

      <div class="field">
        <label class="label">Schedule (cron)</label>
        <div class="control">
          <input v-model="addTaskData.cron"
          class="input" type="text" placeholder="schedule in cron format">
        </div>
      </div>

      <div class="field">
        <label class="label">Type</label>
        <div class="control">
          <div class="select">
            <select v-model="addTaskData.type">
              <option selected>status</option>
              <option>toggle</option>
              <option>interval</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="addTaskData.type !== 'status'" class="field">
        <label class="label">Control</label>
        <div class="control">
          <div class="select">
            <select v-model="addTaskData.control">
              <option v-for="(c, index) in device.controls" :key="'ccon'+index"
              :value="c.name">{{ c.description }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="addTaskData.type === 'interval'" class="field">
        <label class="label">Sensor</label>
        <div class="control">
          <div class="select">
            <select v-model="addTaskData.sensor">
              <option v-for="(s, index) in device.sensors" :key="'ssens'+index"
              :value="s.name">{{ s.description }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="addTaskData.type === 'interval'" class="field">
        <label class="label">Interval</label>
        <div class="control">
          <input v-model="addTaskInterval_l"
          class="input" type="number" placeholder="20">
        </div>
        <div class="control">
          <input v-model="addTaskInterval_r"
          class="input" type="number">
        </div>
      </div>

      <article v-if="addTaskError" class="message is-danger">
        <div class="message-body">
          <strong>Add task failed:</strong> {{ addTaskError }}
        </div>
      </article>
    </div>
    <footer class="card-footer">
      <a v-on:click="postTask()" class="is-success card-footer-item">Add</a>
      <a v-on:click="toggleEdit()" class="card-footer-item">Cancel</a>
    </footer>
  </div>
  <div id="add-task"></div>
</div>
</template>

<script>
import axios from 'axios';
import Constants from './Constants.vue';

export default {
  props: ['device'],

  data() {
    return {
      isEdit: false,

      addTaskInterval_l: 20,
      addTaskInterval_r: 25,
      addTaskData: {
        meta: {
        },
      },
      addTaskError: null,
    };
  },

  methods: {
    toggleEdit() {
      this.isEdit = !this.isEdit;
      if (this.isEdit) {
        document.getElementById('add-task').scrollIntoView();
      }
    },
    postTask() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/tasks`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      if (this.addTaskData.type === 'interval') {
        this.addTaskData.meta.interval = `${this.addTaskInterval_l}-${this.addTaskInterval_r}`;
      } else {
        delete this.addTaskData.meta.interval;
      }
      axios.post(path, this.addTaskData, options)
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
};
</script>

<style>

</style>
