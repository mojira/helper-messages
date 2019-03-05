<template>
  <div class="selector">
    <h2 class="display-4">Mojira Helper Message Web Application</h2>
    <select class="custom-select mr-sm-2">
      <option value="0" selected>Select a message</option>
    </select>
    <div class="dropdown">
      <b-dd id="projectDropdown" v-bind:text="dropdownText">
        <dropdownItemComponent/>
      </b-dd>
    </div>
  </div>
</template>

<script lang="ts">
let dropdownText = 'Project: MC';
export default {
  data() {
    return {
      dropdownText,
    };
  },
};
export function setDropdownText(newText: string) {
  dropdownText = newText;

  // uhm, not sure if it's appropriate to use querySelector here (but it works!)
  const dropdownButton = document.querySelector('#projectDropdown button');
  if (dropdownButton === null) {
    return;
  }

  dropdownButton.innerHTML = newText;
}
</script>

<style scoped lang="scss">
h2 {
  font-size: 25pt;
  margin-bottom: 15px;
  font-weight: 300;
}
.selector {
  display: inline-block;
  margin-bottom: 15px;
  .dropdown {
    display: inline-block;
    margin: 0;
  }
  select {
    width: 250px;
  }
}
</style>
