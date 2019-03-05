<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400");

@keyframes main_in {
  from {
    top: -25%;
    opacity: 0;
  }
  to {
    top: 50%;
    opacity: 1;
  }
}

#app {
  font-family: "Source Sans Pro", sans-serif;
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
  top: 50%;
  left: 50%;
  padding: 25px;
  margin-left: -400px;
  text-align: center;
}
</style>
