<template>
  <div id="app">
    <!-- Hidden iframe for termination requests -->
    <iframe id="termination-frame" style="display: none;"></iframe>
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
  data () {
    return {
      showEarlyExitModal: false,
      isNavigating: false,
      shouldTerminate: false,
      terminationSubjectId: null
    }
  },
  methods: {
    confirmEarlyExit () {
      this.showEarlyExitModal = true
    },
    handleEarlyExitConfirm () {
      this.showEarlyExitModal = false
      this.$router.push('/EarlyExit')
    },
    handleBeforeUnload (event) {
      // Only show confirmation if this is a tab close/page refresh
      // and not a normal navigation
      if (!this.isNavigating) {
        // Store the subject ID for the unload handler
        this.terminationSubjectId = this.$store.state.subject_id

        // Set flag to indicate we should terminate if unload happens
        this.shouldTerminate = true

        // Show the browser's native dialog
        const message = 'Are you sure you want to leave? You may lose all records and not be compensated.'

        // Standard for most browsers
        event.returnValue = message

        // For browsers that support the modern approach
        if (event.cancelable) {
          event.preventDefault()
        }

        return message // For older browsers
      }
      // For normal navigation, don't show any dialog
      return undefined
    },

    handleUnload () {
      if (this.shouldTerminate && this.terminationSubjectId) {
        console.log('Page unloading, sending termination request for subject:', this.terminationSubjectId)
        const subjectId = this.terminationSubjectId
        const serverUrl = this.$server_url

        // Try multiple methods to ensure the termination request gets through

        // 1. First try: sendBeacon (most reliable for page unload)
        try {
          const url = new URL('terminate_participation', serverUrl).toString()
          const formData = new FormData()
          formData.append('subject_id', subjectId)
          const beaconSent = navigator.sendBeacon(url, formData)
          console.log('Termination request sent via sendBeacon, success:', beaconSent)
        } catch (e) {
          console.error('Error with sendBeacon:', e)
        }

        // 2. Second try: iframe form submission (works when sendBeacon is blocked)
        try {
          const iframe = document.getElementById('termination-frame')
          if (iframe && iframe.contentWindow) {
            const form = document.createElement('form')
            form.method = 'POST'
            form.action = new URL('terminate_participation', serverUrl).toString()

            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = 'subject_id'
            input.value = subjectId

            form.appendChild(input)
            iframe.contentDocument.body.appendChild(form)
            form.submit()
            console.log('Termination request sent via iframe form')
          }
        } catch (e) {
          console.error('Error with iframe form method:', e)
        }

        // 3. Third try: Image beacon (works in most browsers)
        try {
          const img = new Image()
          const url = new URL('terminate_participation', serverUrl)
          url.searchParams.append('subject_id', subjectId)
          url.searchParams.append('_', Date.now())
          img.src = url.toString()
          console.log('Termination request sent via image beacon')
        } catch (e) {
          console.error('Error with image beacon:', e)
        }

        // 4. Last resort: sync XHR (might be blocked by some browsers)
        try {
          const xhr = new XMLHttpRequest()
          const url = new URL('terminate_participation', serverUrl).toString()
          const formData = new FormData()
          formData.append('subject_id', subjectId)
          xhr.open('POST', url, false) // Synchronous
          xhr.send(formData)
          console.log('Sync XHR termination request sent with status:', xhr.status)
        } catch (e) {
          console.error('Error with sync XHR:', e)
        }
      }
    },

    handlePageHide (event) {
      // Handle pagehide event (for mobile browsers)
      if (this.shouldTerminate && this.terminationSubjectId) {
        this.handleUnload()
      }
    },
    setupNavigationGuards () {
      // Set flag when navigation starts
      this.$router.beforeEach((to, from, next) => {
        this.isNavigating = true
        next()
      })

      // Reset flag after navigation is complete
      this.$router.afterEach(() => {
        // Use nextTick to ensure the navigation is complete
        // before resetting the flag
        this.$nextTick(() => {
          this.isNavigating = false
        })
      })
    }
  },
  mounted () {
    this.setupNavigationGuards()
    window.addEventListener('beforeunload', this.handleBeforeUnload)
    window.addEventListener('unload', this.handleUnload)
    // Add pagehide event for mobile browsers
    window.addEventListener('pagehide', this.handlePageHide)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
    window.removeEventListener('unload', this.handleUnload)
    window.removeEventListener('pagehide', this.handlePageHide)
  }
}
</script>

<style>
/* Add global styles if needed */
</style>
