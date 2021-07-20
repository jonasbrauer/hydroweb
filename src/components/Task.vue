<template>
<div>
  <!-- CARD -->
  <div class="card mt-1 mb-1">

    <!-- HEADER -->
    <header class="card-header">
      <p v-on:click="toggleDetail" class="card-header-title">
        <img v-if="task.last_run_success && !task.paused"
             class="icon is-small" src="status_online.png"/>
        <img v-else-if="task.paused" class="icon is-small" src="status_paused.png"/>
        <img v-else class="icon is-small" src="status_offline.ico"/>

        <span class="mx-4">{{ task.name }}</span>

        <span v-if="task.locked" class="icon">
          <i class="fa fa-lock" aria-hidden="true"></i>
        </span>
      </p>

      <!-- PLAY/PAUSE - only for unlocked tasks -->
      <a v-if="!task.locked" v-on:click="postResumeTask" class="card-header-icon">
        <i class="fa fa-play " aria-hidden="true"></i>
      </a>
      <a v-if="!task.locked" v-on:click="postPauseTask" class="card-header-icon">
        <i class="fa fa-pause" aria-hidden="true"></i>
      </a>
    </header>

    <!-- CONTENT -->
    <div class="card-content" v-bind:class="{'is-hidden': !is_detail || is_edit}">
      <div class="content">
        <div class="level mb-2 is-mobile">
          <div class="level-left">Type</div>
          <div class="level-right">
              <strong>{{ task.type }}</strong>
          </div>
        </div>
        <div class="level mb-2 is-mobile">
          <div class="level-left">Schedule</div>
          <div class="level-right">
            <strong>{{ task.cron }}</strong>
          </div>
        </div>
        <div class="level mb-2 is-mobile">
          <div class="level-left">Paused</div>
          <div class="level-right">
            <strong>{{ task.paused }}</strong>
          </div>
        </div>
        <div class="level mb-2  is-mobile">
          <div class="level-left">Control</div>
          <div class="level-right">
              <strong>{{ task.control ? task.control.description : "no control"}}</strong>
          </div>
        </div>
        <div class="level mb-2  is-mobile">
          <div class="level-left">Sensor</div>
          <div class="level-right">
              <strong>{{ task.sensor ? task.sensor.description : "no sensor"}}</strong>
          </div>
        </div>
        <div class="level mb-2  is-mobile">
          <div class="level-left">Last run</div>
          <div class="level-right">
              <strong>{{ task.last_run ? formatTime(task.last_run) : 'not yet'}}</strong>
          </div>
        </div>

        <!-- error -->
        <div v-if="task.last_run_error" class="level mb-2">
          <div class="level-left">Error</div>
          <div class="level-right">
              <strong class="has-text-danger">{{ task.last_run_error }}</strong>
          </div>
        </div>

        <!-- meta -->
        <div v-if="Object.keys(task.meta).length > 0">
          <hr>
          <h6>Meta</h6>
          <div class="columns is-mobile">
            <div class="column">
              <p v-for="(v, k) in task.meta" :key="'metak'+k" >{{k}}</p>
            </div>
            <div class="column is-one-fifth">
              <p v-for="(v, k) in task.meta" :key="'metav'+k">{{v}}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
    <!-- DETAIL FOOTER -->
    <footer v-if="!task.locked" class="card-footer"
      v-bind:class="{'is-hidden': !is_detail || is_edit}">

      <a v-if="!is_delete_modal" v-on:click="toggleEdit()" class="card-footer-item">
        <strong>Edit</strong>
      </a>
      <a v-if="!is_delete_modal" v-on:click="toggleDeleteModal()"
      class="card-footer-item has-text-danger">
        <strong>Delete</strong>
      </a>
      <a v-if="!is_delete_modal" v-on:click="toggleDetail()"
         class="card-footer-item has-text-black">
        <strong>Cancel</strong>
      </a>
      <!-- really delete? -->
      <a v-if="is_delete_modal" v-on:click="deleteTask()"
         class="card-footer-item has-text-danger">
        <strong>You sure? Yes!</strong>
      </a>
      <a v-if="is_delete_modal" v-on:click="toggleDeleteModal()"
         class="card-footer-item has-text-black">
        <strong>Cancel</strong>
      </a>
    </footer>

    <article v-if="edit_error" class="message is-danger">
      <div class="message-body">
        <strong>Add task failed:</strong> {{ edit_error }}
      </div>
    </article>

    <!-- EDIT -->
    <div id="edit-task" v-if="is_edit" class="card-content">
      <div class="content">
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input v-model="editTaskData.name"
            class="input" type="text">
          </div>
        </div>

        <div class="field">
          <label class="label">Schedule (cron)</label>
          <div class="control">
            <input v-model="editTaskData.cron"
            class="input" type="text">
          </div>
        </div>

        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select">
              <select v-model="editTaskData.type">
                <option>status</option>
                <option>toggle</option>
                <option>interval</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="editTaskData.type !== 'status'" class="field">
          <label class="label">Control</label>
          <div class="control">
            <div class="select">
              <select v-model="editTaskData.control">
                <!-- <h1>{{task.control.name}}</h1> -->
                <option v-for="(c, index) in device.controls" :key="'cccon'+index"
                :value="c.name">
                {{ c.description }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="editTaskData.type === 'interval'" class="field">
          <label class="label">Sensor</label>
          <div class="control">
            <div class="select">
              <select v-model="editTaskData.sensor">
                <option v-for="(s, index) in device.sensors" :key="'sssens'+index"
                :value="s.name">{{ s.description }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="editTaskData.type === 'interval'" class="field">
          <label class="label">Interval</label>
          <div class="control">
            <input v-model="editTaskInterval_l"
            class="input" type="number" placeholder="20">
          </div>
          <div class="control">
            <input v-model="editTaskInterval_r"
            class="input" type="number">
          </div>
        </div>

      </div>
    </div>
    <footer v-if="is_edit" class="card-footer" >
      <a v-on:click="postTask()" class="card-footer-item has-text-success">
        <strong>Save</strong>
      </a>
      <a v-on:click="toggleEdit()" class="card-footer-item has-text-danger">
        <strong>Cancel</strong>
      </a>
    </footer>
  </div>
  <!-- <div :id="`task-${task.id}-detail`"></div> -->

</div>
</template>

<script>
import axios from 'axios';
import Constants from './Constants.vue';

export default {
  props: ['task', 'device'],

  data() {
    return {
      is_edit: false,
      is_delete_modal: false,
      is_detail: false,
      delete_error: null,
      edit_error: null,

      options: {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      },

      editTaskInterval_l: 20,
      editTaskInterval_r: 25,
      editTaskData: {
        id: this.task.id,
        name: this.task.name,
        type: this.task.type,
        cron: this.task.cron,
      },
    };
  },

  methods: {
    toggleEdit() {
      this.is_edit = !this.is_edit;
      this.$refs['task-edit'].focus();
    },
    toggleDeleteModal() {
      this.is_delete_modal = !this.is_delete_modal;
    },
    toggleDetail() {
      this.is_detail = !this.is_detail;
      if (this.is_detail) {
        document.getElementById(`task-${this.task.id}-detail`).scrollIntoView();
      }
    },
    formatTime(timeString) {
      const parsedDate = new Date(timeString);
      const date = new Date(parsedDate.getTime() - (new Date().getTimezoneOffset() * 60000));
      return date.toLocaleDateString('cs', this.options);
    },
    postTask() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/tasks`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      if (this.editTaskData.type === 'interval') {
        this.editTaskData.meta.interval = `${this.editTaskInterval_l}-${this.editTaskInterval_r}`;
      } else {
        delete this.editTaskData.meta.interval;
      }
      axios.post(path, this.editTaskData, options)
        .then(() => {
          this.edit_error = null;
        })
        .catch((err) => {
          this.edit_error = err.response.data;
        });
      this.is_edit = false;
      this.is_detail = true;
    },
    postPauseTask() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/tasks/${this.task.id}/pause`;
      axios.post(path);
    },
    postResumeTask() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/tasks/${this.task.id}/resume`;
      axios.post(path);
    },
    deleteTask() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/tasks/${this.task.id}`;
      axios.delete(path)
        .then(() => {
          this.toggleDeleteModal();
          this.delete_error = null;
        })
        .catch((e) => {
          this.delete_error = e.response.data;
        });
    },
  },

  created() {
    if (this.task.control) {
      this.editTaskData.control = this.task.control.name;
    }
    if (this.task.sensor) {
      this.editTaskData.sensor = this.task.sensor.name;
    }
    if (this.task.meta) {
      this.editTaskData.meta = this.task.meta;
    }
  },
};
</script>

<style>

</style>
