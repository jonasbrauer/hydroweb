<template>
<div class="mt-5">

<div class="container px-4">
    <!-- TITLE  + edit name -->
    <div class="level">
      <div v-show="editing_mode" class="control level-item">
        <input v-model="form_name" v-bind:placeholder="device.name"
              class="input is-primary" type="text" ref="form_name">
        <button class="button ml-2">
          <span v-on:click="updateName" class="icon is-medium"><img src="save_ico.png"/></span>
        </button>
        <button v-on:click="toggleEdit" class="button ml-1">
          <span class="icon is-medium"><img src="cancel_ico.png"/></span>
        </button>
      </div>
      <h1 v-if="!editing_mode" class="title">
        {{ device.name }}
        <a v-on:click="toggleEdit" class="icon"><img src="edit_ico.png"/></a>
      </h1>
    </div>
    <!-- last update -->
    <div class="level is-mobile ">
      <div class="level-left">
        <div class="level-item">
          <span v-if="!device.scheduler_running" class="dot has-background-warning"/>
          <span v-else :class="{
              dot: true,
              'has-background-success': device.is_online,
              'has-background-danger': !device.is_online,
            }"/>
        </div>
        <div class="level-item">
          <p v-if="device.is_online" class="subtitle is-5">
            last update: {{ formatTime(device.time_modified) }}
          </p>
          <p v-else class="subtitle is-5">
            last seen online: {{ formatTime(device.last_seen_online) }}
          </p>
        </div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs is-centered mt-5">
    <ul>
      <li v-bind:class="{ 'is-active': tab === 'home' }">
        <a v-on:click="tab = 'home'">
          <span class="icon">
            <i class="fas fa-home" aria-hidden="true"></i>
          </span>
        </a>
      </li>
      <li v-bind:class="{ 'is-active': tab === 'stats' }">
        <a v-on:click="tab = 'stats'">Stats</a>
      </li>
      <li v-bind:class="{ 'is-active': tab === 'settings' }">
        <a v-on:click="tab = 'settings'">Settings</a>
      </li>
    </ul>
    </div>

    <div v-if="tab === 'home'" class="container">

      <!-- plant -->
      <article class="media">
        <figure class="media-left">
          <p class="image is-96x96">
            <img class="is-rounded" src="https://trevisanuttos.com/wp-content/uploads/2020/04/Basil-Sweet-Genovese.jpeg">
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>Basil</strong>
              <br>
              <small>Planted: 15 Aug 2021</small>
            </p>
            <hr>
            <progress class="progress is-large mb-0 is-primary" value="30" max="100"/>
            <div class="level p-0">
              <div class="level-item p-0 m-0">
                <p class="content"><small>12 days out of 45</small></p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <hr>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#70e000')"
      >
        <div class="level-left">
          <div class="level-item">
            <span class="icon">
              <i class="fas fa-temperature-high" aria-hidden="true"></i>
            </span>
            <!-- <small>Temp</small> -->
          </div>
        </div>
        <div class="level-right">
          <div class="level-item"><small>21</small></div>
        </div>
      </div>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#CCCCCC')"
      >
        <div class="level-left">
          <div class="level-item">
            <span class="icon">
              <i class="fas fa-water" aria-hidden="true"></i>
            </span>
            <!-- <small>Temp</small> -->
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <progress class="progress is-dark" value="60" max="100">15%</progress>
          </div>
        </div>
      </div>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#9c6644')"
      >
        <div class="level-left">
          <div class="level-item">
            <p><small>pH</small></p>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <p>5.6</p>
          </div>
        </div>
      </div>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#457b9d')"
      >
        <div class="level-left">
          <div class="level-item">
            <p><small>EC</small></p>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <p>1.3</p>
          </div>
        </div>
      </div>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#ffb703')"
      >
        <div class="level-left">
          <div class="level-item">
            <span class="icon">
              <i class="fas fa-faucet" aria-hidden="true"></i>
            </span>
            <!-- <small>Temp</small> -->
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <p>0.86</p>
          </div>
        </div>
      </div>

      <div
        class="level is-mobile mb-1 notification p-2 is-success"
        :style="getBackgroundStyle('#219ebc')"
      >
        <div class="level-left">
          <div class="level-item">
            <span class="icon">
              <i class="fas fa-lightbulb" aria-hidden="true"></i>
            </span>
            <!-- <small>Temp</small> -->
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <span class="tag">ON</span>
          </div>
          <div class="level-item">
            <span class="tag">07:00 - 22:00</span>
          </div>
        </div>
      </div>

      <hr>
      <!-- chart -->
      <div class="tabs is-toggle is-fullwidth is-small px-5">
        <ul>
          <li
            v-for="(sensor, index) in device.sensors"
            :key="'dev_sensor_graph' + index"
            :class="{ 'is-active': graph_sensor.id === sensor.id}"
          >
            <a v-on:click="graph_sensor=sensor">{{ sensor.name }}</a>
          </li>
        </ul>
      </div>
      <Chart :device_id="device.id" :sensor_id="graph_sensor.id" :title="graph_sensor.description"/>

    </div>
    <!-- STATS -->
    <div v-if="tab === 'stats'" class="container">
      <!-- scheduler -->
      <article v-if="device.scheduler_running" class="message is-success my-1">
        <div class="message-body">
          Scheduler is <strong>running</strong>
        </div>
      </article>
      <article v-else class="message is-warning my-1">
        <div class="message-body">
          Scheduler is <strong>stopped</strong>
          <a v-on:click="postScheduler()" class="ml-5">
            <i class="fas fa-play"/>
          </a>
        </div>
      </article>
      <!-- scheduler error -->
      <article v-if="device.scheduler_error" class="message is-danger is-small my-0">
        <div class="message-body">
          Scheduler error: <b>{{ device.scheduler_error }}</b>
        </div>
      </article>

      <!-- sensors -->
      <h4 v-if="device.sensors.length > 0" class="subtitle mt-5">Sensors</h4>
      <div v-for="(sensor, index) in device.sensors" :key="'dev_sensor' + index">
        <Sensor :sensor="sensor" :device="device"></Sensor>
      </div>

      <!-- controls -->
      <h4 v-if="device.controls.length > 0" class="subtitle mt-5">Controls</h4>
      <div v-for="(control, index) in device.controls" :key="'dev_control' + index">
        <Control :control="control" :device="device"></Control>
      </div>

      <!-- tasks -->
      <h4  class="subtitle mt-5">TASKS</h4>
      <div v-for="(t, index) in device.tasks" :key="'task'+index">
        <Task :task="t" :device_id="device.id" :device="device"></Task>
      </div>
      <article v-if="device.tasks.length == 0" class="message is-warning">
        <div class="message-body">
          <small><strong>No tasks yet</strong></small>
        </div>
      </article>

      <!-- add task -->
      <AddTask :device="device"></AddTask>
    </div>

    <!-- SETTINGS -->
    <div v-if="tab === 'settings'" class="container">
      <div class="level">
        <div class="level-left title is-6">uuid</div>
        <div class="level-right subtitle is-6">{{ device.uuid }}</div>
      </div>
      <div class="level">
          <div class="level-left title is-6">Name</div>
          <div class="level-right subtitle is-6">{{ device.name }}</div>
      </div>
      <div class="level">
          <div class="level-left title is-6">Type</div>
          <div class="level-right subtitle is-6">{{ device.type }}</div>
      </div>
      <div class="level">
          <div class="level-left title is-6">URL</div>
          <div class="level-right subtitle is-6">{{ device.url }}</div>
      </div>
      <hr>
      <!-- unrecognized -->
      <article v-if="Object.keys(device.unrecognized).length > 0" class="message is-warning">
        <div class="message-body">Still some unrecognized sensors on this device.</div>
      </article>
      <div v-for="(v, k) in device.unrecognized" :key="'ukw'+k"
        class="level px-2 is-mobile">
          <div class="level-left">
            <strong>{{ k }}</strong>
            <div class="tags ml-4">
              <a v-on:click="showCategorize(k)" class="tag is-warning">
                <i class="fa fa-hashtag" aria-hidden="true"></i>
                <p class="ml-1">categorize</p>
              </a>
            </div>
          </div>
          <div class="level-right">{{ v }}</div>
      </div>
      <article v-if="Object.keys(device.unrecognized).length < 1" class="message is-success">
        <div class="message-body">No unrecognized sensors on this device.</div>
      </article>
      <!-- categorize form -->
      <div v-if="isCategorize" class="card mt-0">
        <div  class="card-content">
          <div class="content">
            <div class="field">
              <label class="label">Type</label>
              <div class="control">
                <div class="select">
                  <select v-model="categorize.type">
                    <option>sensor</option>
                    <option>control</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="label">Item</label>
              <div class="control">
                <input class="input" type="text" v-model="categorize.name" disabled>
              </div>
            </div>

            <div class="field">
              <label class="label">Description</label>
              <div class="control">
                <input class="input" type="text" v-model="categorize.description">
              </div>
            </div>

            <div v-if="categorize.type === 'sensor'" class="field">
              <label class="label">Unit</label>
              <div class="control">
                <input class="input" type="text" v-model="categorize.unit">
              </div>
            </div>
          </div>
        </div>
        <footer class="card-footer" >
          <a v-on:click="postCategorize()" class="card-footer-item has-text-success">
            <strong>Categorize</strong>
          </a>
          <a v-on:click="isCategorize = false" class="card-footer-item has-text-danger">
            <strong>Cancel</strong>
          </a>
        </footer>
      </div>
      <div id="categorize"></div>

      <!-- refresh -->
      <hr>
      <div class="level">
        <div class="level-left">
          <p>Refresh (try to re-establish connection)</p>
        </div>
        <div class="level-right subtitle is-6">
          <button v-on:click="postRefresh"
            :class="{
              button:true,
              'is-loading': refresh_is_loading,
              'is-success':true,
              'is-outlined':true,
              'is-fullwidth':true
            }" style="min-width: 10em;"
          >
            <span v-if="!refresh_is_loading">Refresh</span>
          </button>
        </div>
      </div>

      <!-- delete -->
      <div class="level">
        <div class="level-left">
          <p>Delete (removes all associated data)</p>
        </div>
        <div class="level-right subtitle is-6">
          <button v-on:click="postDelete()"
            :class="{
              button:true,
              'is-danger':true,
              'is-outlined':true,
              'is-fullwidth':true
            }" style="min-width: 10em;"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- advanced -->
      <div>
        <button class="button is-light is-fullwidth mt-2">
          <i class="fa fa-cogs" aria-hidden="true"></i>
          <p class="ml-3">Advanced options</p>
        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import Constants from './Constants.vue';
import Task from './Task.vue';
import Control from './Control.vue';
import Sensor from './Sensor.vue';
import AddTask from './AddTask.vue';
import Chart from './Chart.vue';

export default {
  props: ['device'],

  components: {
    Task, Control, Sensor, AddTask, Chart,
  },

  data() {
    return {
      // home / stats / settings
      tab: 'home',

      editing_mode: false,

      refresh_is_loading: false,

      options: {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },
      // edit dev name
      form_name: this.device.name,

      // edit
      isCategorize: false,
      categorize: {},

      // home
      graph_sensor: this.device.sensors[0],
    };
  },

  methods: {
    // server communication
    updateName() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      const data = { name: this.form_name };
      axios.post(path, data, options)
        .then(() => {
          this.device.name = this.form_name;
        });
      this.editing_mode = false;
    },
    postDelete() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}`;
      axios.delete(path);
    },
    postScheduler() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/scheduler`;
      axios.post(path);
    },
    postRefresh() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/refresh`;
      this.refresh_is_loading = true;
      axios.post(path)
        .finally(() => {
          this.refresh_is_loading = false;
        });
    },
    postCategorize() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/categorize`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      axios.post(path, this.categorize, options)
        .then(() => {
          this.isCategorize = false;
          this.addTaskError = null;
        })
        .catch((err) => {
          this.addTaskError = err.response.data;
        });
      this.editing_mode = false;
    },
    toggleEdit() {
      this.editing_mode = !this.editing_mode;
    },

    // settings
    showCategorize(name) {
      this.isCategorize = true;
      this.categorize.name = name;
      this.categorize.type = 'control';
      document.getElementById('categorize').scrollIntoView();
    },

    // misc tools
    formatTime(timeString) {
      const parsedDate = new Date(timeString);
      const date = new Date(parsedDate.getTime() - (new Date().getTimezoneOffset() * 60000));
      return date.toLocaleDateString('cs', this.options);
    },

    getBackgroundStyle(colorHex) {
      return `background-image: -webkit-linear-gradient(-15deg, ${colorHex} 80%, #16009500 50%);`;
    },
  },
};
</script>
