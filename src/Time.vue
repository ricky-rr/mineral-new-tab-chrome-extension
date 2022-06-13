<template>
  <div id="time">
    <div class="time">{{ hours }}:{{ minutes }}</div>
  </div>
</template>

<script>
export default {
  name: "DigitalClock",
  data() {
    return {
      is24hours: true,
      hours: 0,
      minutes: 0,
    };
  },
  methods: {
    setTime(is24hours) {
      setInterval(() => {
        if (is24hours == true) {
          const date = new Date();
          this.hours = date.getHours();
          this.minutes = this.checkSingleDigit(date.getMinutes());
        } else {
          const date = new Date();
          this.hours = (date.getHours() + 24) % 12 || 12;
          this.minutes = this.checkSingleDigit(date.getMinutes());
        }
      }, 1000);
    },
    checkSingleDigit(digit) {
      return ("0" + digit).slice(-2);
    },
  },
  mounted() {
    if (this.is24hours == true) {
      const date = new Date();
      this.hours = date.getHours();
      this.minutes = this.checkSingleDigit(date.getMinutes());
    } else {
      const date = new Date();
      this.hours = (date.getHours() + 24) % 12 || 12;
      this.minutes = this.checkSingleDigit(date.getMinutes());
    }
    this.setTime(this.is24hours);
  },
};
</script>

<style></style>
