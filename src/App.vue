<template>
  <div id="app">
    <div v-if="!isErrorPage" class="early-exit-btn" style="position:absolute; top:1rem; right:1rem; background-color:white; color:black;">
      <b-button size="sm" style="background-color: white; color: black; border: 1px solid #ccc;" @click="$router.push('/EarlyExit')">Early Exit</b-button>
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isErrorPage () {
      return ['FailPairing', 'FailAttention', 'GoBackTerminatedParticipation', 'InactivityTerminatedParticipation', 'EarlyExit', 'DeBriefing'].includes(this.$route.name)
    }
  },
  watch: {
    '$store.state.subject_id' (newSubjectId) {
      if (newSubjectId) {
        this.$store.dispatch('initializeHeartbeat') // Start heartbeat when subject_id is assigned
      }
    }
  },
  beforeDestroy () {
    this.$store.dispatch('terminateHeartbeat') // Stop heartbeat when app is closed
  }
}
</script>

<style>
/* Add global styles if needed */
</style>
