<template>
  <router-view/>
</template>

<script lang="ts">
import {setMessages} from './components/Header.vue';
export default {
  data() {
    return {};
  },
};
// Wait for DOM and retrieve helper messages
(() => {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      setMessages(JSON.parse(xhr.responseText));
    }
  };
  xhr.open('GET', 'messages.json');
  xhr.send();
})();
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400");

* {
  font-family: "Source Sans Pro", sans-serif;
}
</style>
