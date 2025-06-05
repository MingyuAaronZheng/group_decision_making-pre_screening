<template>
  <div id="app">
    <div v-if="!isErrorPage" class="early-exit-btn" style="position:absolute; top:1rem; right:1rem; background-color:white; color:black;">
      <b-button size="sm" style="background-color: white; color: black; border: 1px solid #ccc;" @click="confirmEarlyExit">Early Exit</b-button>
    </div>
    <b-modal
      id="early-exit-modal"
      v-model="showEarlyExitModal"
      title="Confirm Early Exit"
      hide-footer
      centered
    >
      <div class="my-3">
        <p>Are you sure you want to exit early? <br>This will terminate your participation in the study.</p>
      </div>
      <div class="d-flex justify-content-end">
        <b-button variant="secondary" class="mr-2" @click="showEarlyExitModal = false">Cancel</b-button>
        <b-button variant="danger" @click="handleEarlyExitConfirm">Yes, Exit</b-button>
      </div>
    </b-modal>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    isErrorPage () {
      return ['FailPairing', 'FailAttention', 'GoBackTerminatedParticipation', 'InactivityTerminatedParticipation', 'EarlyExit', 'DeBriefing', 'StarEntrance'].includes(this.$route.name)
    }
  },
  watch: {
    '$store.state.subject_id' (newSubjectId) {
      if (newSubjectId && this.$store.state.group_id !== -1) {
        this.$store.dispatch('initializeHeartbeat') // Start heartbeat when both subject_id and group_id are assigned
      }
    }
  },
  data () {
    return {
      showEarlyExitModal: false
    }
  },
  methods: {
    confirmEarlyExit () {
      this.showEarlyExitModal = true
    },
    handleEarlyExitConfirm () {
      this.showEarlyExitModal = false
      this.$router.push('/EarlyExit')
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
