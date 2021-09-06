<template>
  <div>
    <div class="title">
      {{ title ? title : '???' }}
    </div>
    <div>
      <div v-if="loading" class="loader"></div>
      <canvas id="planet-chart"></canvas>
    </div>
    <div class="tabs is-toggle is-fullwidth is-small px-5">
      <ul>
        <li :class="{'is-active': tab == 'all'}" v-on:click="clickAll">
          <a><span>All</span></a>
        </li>
        <li :class="{'is-active': tab == 'month'}" v-on:click="clickMonth">
          <a><span>Month</span></a>
        </li>
        <li :class="{'is-active': tab == 'week'}" v-on:click="clickWeek">
          <a><span>Week</span></a>
        </li>
        <li :class="{'is-active': tab == 'day'}" v-on:click="clickDay">
          <a><span>Day</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';
import axios from 'axios';
import Constants from './Constants.vue';
// import { planetChartData as chartData } from '../assets/test-data';

export default {

  props: ['device_id', 'sensor_id', 'title'],

  data() {
    return {
      tab: 'day',
      daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

      chart: null,
      fullSize: true,
      loading: false,

      // use this in updated hook, to decide whether to reload the chart
      sensor_id_last: null,

      chartData: {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: '#8fbc8b90',
              borderColor: '#1E5631',
              borderWidth: 3,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          responsive: true,
          lineTension: 1,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25,
                },
              },
            ],
          },
        },
      },

    };
  },

  methods: {

    clickDay() {
      this.tab = 'day';
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 1);
      sinceDate.setHours(sinceDate.getHours(), 0, 0, 0);
      const sinceTimestamp = sinceDate.getTime();

      this.fetchChart((isoTimestamp) => {
        const date = new Date(isoTimestamp);
        const adjustedDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );
        return `${adjustedDate.getHours()}:${adjustedDate.getMinutes()}`;
      }, sinceTimestamp, 20);
    },

    clickWeek() {
      this.tab = 'week';
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 7);
      sinceDate.setHours(0, 0, 0, 0);
      const sinceTimestamp = sinceDate.getTime();

      this.fetchChart((isoTimestamp) => {
        const date = new Date(isoTimestamp);
        const adjustedDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );
        return `${adjustedDate.getDate()}.${adjustedDate.getMonth()}.${adjustedDate.getFullYear()}`;
      }, sinceTimestamp, 7);
    },

    clickMonth() {
      this.tab = 'month';
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - 30);
      sinceDate.setHours(0, 0, 0, 0);
      const sinceTimestamp = sinceDate.getTime();

      this.fetchChart((isoTimestamp) => {
        const date = new Date(isoTimestamp);
        const adjustedDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );
        return `${adjustedDate.getDate()}.${adjustedDate.getMonth()}.${adjustedDate.getFullYear()}`;
      }, sinceTimestamp, 12);
    },

    clickAll() {
      this.tab = 'all';
      this.fetchChart((isoTimestamp) => {
        const date = new Date(isoTimestamp);
        const adjustedDate = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
          ),
        );
        return `${adjustedDate.getDate()}.${adjustedDate.getMonth()}.${adjustedDate.getFullYear()}`;
      }, 12);
    },

    createChart(labels, values) {
      // Spawn the chart with supplied x's and y's
      this.chartData.data.labels = labels;
      this.chartData.data.datasets[0].data = values;
      const ctx = document.getElementById('planet-chart');
      this.chart = new Chart(ctx, this.chartData);
    },

    fetchChart(labelMapper, since = '', itemCount = 10) {
      const path = `${Constants.HOST_URL}/devices/${this.device_id}/sensors/${this.sensor_id}/history?count=${itemCount}&since=${since}`;
      this.loading = true;
      axios.get(path)
        .then((res) => {
          this.error = null;
          const labels = res.data
            .map((x) => x.timestamp)
            .map(labelMapper);
          const values = res.data.map((x) => x.value);
          this.createChart(labels, values);
        })
        .catch((err) => {
          this.error = err;
          console.log(err.response.data);
          setTimeout(() => { this.error = null; }, 5000);
        })
        .finally(() => {
          this.loading = false;
        });
    },

  },

  mounted() {
    console.log('mounted');
    this.clickDay();
    this.sensor_id_last = this.sensor_id;
  },

  updated() {
    if (this.sensor_id_last !== this.sensor_id) {
      this.sensor_id_last = this.sensor_id;
      this.clickDay();
    }
  },

};
</script>
<style>
.loader {
  border: 2vh solid #8fbc8b90; /* Light grey */
  border-top: 2vh solid #1E5631; /* Blue */
  /* border-radius: 50%; */
  width: 10vh;
  height: 10vh;
  animation: spin 1.5s linear infinite;

  position: absolute;
  left: calc(50% - 4vh);
  bottom: calc(10% + 4vh);

}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
