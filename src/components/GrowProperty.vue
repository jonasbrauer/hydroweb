<template>
  <div
    :class="{
      level: true,
      'is-mobile':true,
      'mb-1': true, 'p-2': true,
      notification: true,
      'is-success': property.sensor,
      'is-light': !property.sensor,
  }"
  :style="getBackgroundStyle(property.color)"
  >

    <div class="level-left">
      <div class="level-item has-text-weight-bold has-text-white">
        {{ property.name }}
      </div>
    </div>

    <div class="level-right">
      <div class="level-item">
        <div v-if="!property.sensor">

          <div :class="{dropdown: true, 'is-right': true, 'is-active': assigning}">
            <!-- trigger -->
            <div class="dropdown-trigger">
              <button
                class="button is-small is-rounded"
                v-on:click="assigning = !assigning"
              >
                <span class="icon is-small">
                  <i class="fas fa-hammer"></i>
                </span>
                <span class="mr-2">assign</span>
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </button>
            </div>
            <!-- menu -->
            <div class="dropdown-menu">
              <div class="dropdown-content">
                <a
                  v-for="(sensor, index) in device.sensors"
                  :key="'assign_sensor_' + device.id + index"
                  v-on:click="sensorAssign(sensor.id)"
                  href="#" class="dropdown-item"
                > {{ sensor.description }}</a>
              </div>
            </div>
          </div>

        </div>
        <div v-else>
          {{ property.sensor.last_value }} {{ property.sensor.unit }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Constants from './Constants.vue';

export default {
  props: ['device', 'property'],

  data() {
    return {
      assigning: false,
    };
  },

  methods: {
    sensorAssign(sensorId) {
      const path = `${Constants.HOST_URL}/grow/systems/${this.device.id}/properties/${this.property.id}`;
      const options = {
        headers: { 'Content-Type': 'application/json' },
      };
      const data = {
        sensor_id: sensorId,
      };
      axios.post(path, data, options)
        .then(() => {
          this.assigning = false;
        })
        .catch(() => {
        });
    },
    sensorDelete() {
      // const path = `${Constants.HOST_URL}/devices/${this.device.id}/sensors/${id}`;
      // axios.delete(path);
    },

    getBackgroundStyle(colorHex) {
      return `background-image: -webkit-linear-gradient(0deg, ${colorHex} 65%, #16009500 65%);`;
    },
  },

};
</script>

<style>

</style>
