<template>
  <div id="footer">
    <button
      type="button"
      class="btn btn-outline-secondary"
      id="copybutton"
      data-toggle="tooltip"
      data-placement="top"
      title
      disabled="disabled"
      data-original-title="Copied!"
    >Copy</button>
    <div class="footerLine">
      <small class="text-muted">
        Made by
        <a
          href="https://bugs.mojang.com/secure/ViewProfile.jspa?name=Bemoty"
          target="_blank"
        >Bemoty</a> &amp;
        <a
          href="https://bugs.mojang.com/secure/ViewProfile.jspa?name=Urielsalis"
          target="_blank"
        >Urielsalis</a>
      </small>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: Write copy button logic
export default {
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="scss">
#copybutton {
  width: 200px;
  margin-bottom: 10px;
}
</style>
