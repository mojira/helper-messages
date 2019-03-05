<template>
  <router-view/>
</template>

<script lang="ts">
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400");

* {
  font-family: "Source Sans Pro", sans-serif;
}

@keyframes main_in {
  from {
    top: -25%;
    opacity: 0;
  }
  to {
    top: 15%;
    opacity: 1;
  }
}

.application-panel {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  animation-name: main_in;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier();

  background-color: #e9ecef;
  border-radius: 0.3rem;
  width: 800px;
  position: absolute;
  top: 15%;
  left: 50%;
  padding: 25px;
  margin-left: -400px;
  text-align: center;
}
</style>
