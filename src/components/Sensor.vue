<template>
<div>
  <div class="level box mb-2 is-mobile">
    <div v-if="!is_edit" class="level-left">
      <p class="mr-2">{{ sensor.description }}</p>
      <a v-on:click="toggleEdit" class="icon">
        <i class="fas fa-edit"></i>
      </a>
      <a v-on:click="sensorDelete(sensor.id)" class="icon">
        <i class="fa fa-times" aria-hidden="true"></i>
      </a>
    </div>
    <!-- edit -->
    <div v-else class="level-left">
      <div class="field is-grouped">
        <div class="control">
          <input v-model="edit_name" class="input" type="text">
        </div>
        <div class="control">
          <a v-on:click="sensorEdit" class="button is-success is-outlined">save</a>
        </div>
        <div class="control">
          <a v-on:click="toggleEdit" class="button is-danger is-outlined">cancel</a>
        </div>
      </div>
    </div>
  <div class="level-right">
    <p><strong>{{ sensor.last_value }}</strong> {{ sensor.unit }}</p>
  </div>

  </div>
</div>
</template>

<script>
import axios from 'axios';
import Constants from './Constants.vue';

export default {
  props: ['sensor', 'device'],

  data() {
    return {
      is_edit: false,
      edit_name: this.sensor.description,
      edit_error: null,
    };
  },

  methods: {
    sensorEdit() {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/sensors/${this.sensor.id}`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      const data = {
        description: this.edit_name,
      };
      axios.post(path, data, options)
        .then(() => {
          this.edit_error = null;
          this.sensor.description = this.edit_name;
          this.is_edit = false;
        })
        .catch((err) => {
          // todo: show error
          this.edit_error = err.response.data;
        });
    },
    sensorDelete(id) {
      const path = `${Constants.HOST_URL}/devices/${this.device.id}/sensors/${id}`;
      axios.delete(path);
    },
    toggleEdit() {
      this.is_edit = !this.is_edit;
    },
  },
  created() {
  },
};
</script>

<style>

</style>
