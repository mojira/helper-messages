<template>
  <div id="dropdownComponent">
    <b-dd-item
      v-for="project of projects"
      :key="project.name"
      class="dropdown-item"
      @click="dropdownItemClicked($event)"
      href="#"
    >{{ project.displayName }}</b-dd-item>
  </div>
</template>

<script lang="ts">
import {setDropdownText} from './Header.vue';
export default {
  data() {
    return {
      projects: [
        {
          name: 'mc',
          displayName: 'Project: MC',
        },
        {
          name: 'mcl',
          displayName: 'Project: MCL',
        },
        {
          name: 'mcpe',
          displayName: 'Project: MCPE',
        },
        {
          name: 'mcapi',
          displayName: 'Project: MCAPI',
        },
      ],
    };
  },
  methods: {
    dropdownItemClicked(event: Event) {
        if (event === null) {
          return;
        }
        setDropdownText((event.target as HTMLAnchorElement).innerHTML);
    },
  },
};
</script>

