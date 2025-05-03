<template>
  <b-jumbotron header-level="5">
    <div class="content-area"><div class="page-indicator text-center mb-1">Page: 6 / 10</div></div>
    <template v-slot:header>
      Pairing You with Other Participants
    </template>

    <div class="content-area">
      <p>
        We are pairing you with other participants to start the discussion task.
        <strong style="color: blue;">Please turn on audio on your device.</strong>
        Once all of the group members arrive, we will notify you with a sound and redirect you to the next page.
      </p>
      <p>
        If no other group member is paired in 5 minutes, we will redirect you back to Prolific. <br>
        <strong style="color: blue;">But don't worry, you will still be paid for your time.</strong>
      </p>
      <p>
        We will bonus you <b>15 cents per minute</b> for your waiting time.<br>
        The average waiting time is <b>{{ displayWaitingTime }}</b> seconds.
      </p>

      <CountdownTimer :remain_time="remainingTime" /> <!-- ⏳ Countdown Timer -->
    </div>

    <div class="pairing-info">
      <p v-if="isPairing"><b>Finding a suitable group...</b></p>
      <p v-else-if="pairingFailed" class="text-danger"><b>Pairing failed. Redirecting...</b></p>
      <p v-else-if="!has_capacity" class="text-success"><b>Pairing successful! Redirecting...</b></p>
    </div>

    <b-spinner v-if="isPairing" label="Loading..."></b-spinner>

    <b-alert v-if="pairingFailed" variant="danger" dismissible>
      We couldn't find a suitable group. You will be redirected shortly.
    </b-alert>

    <div v-if="!isPairing && !isTimedOut" class="text-center mt-4">
    </div>

  </b-jumbotron>
</template>

<script>
import axios from 'axios'
import CountdownTimer from '@/components/CountdownTimer.vue'

export default {
  components: {
    CountdownTimer
  },
  data () {
    return {
      isPairing: true,
      pairingFailed: false,
      pollInterval: null,
      timeout: null,
      remainingTime: 300, // 5 minutes countdown
      average_waiting_time: 10,
      has_capacity: false
    }
  },
  computed: {
    displayWaitingTime () {
      // Ensure we're displaying a valid number
      const waitTime = this.average_waiting_time - 5
      return typeof waitTime === 'number' && !isNaN(waitTime) && waitTime > 0 ? waitTime : 5
    }
  },
  methods: {
    startPairing () {
      this.startCountdown()
      this.setReadyToPair()
      this.checkPairingStatus()
      this.pollInterval = setInterval(this.checkPairingStatus, 5000) // Poll every 5s
      this.timeout = setTimeout(this.failPairing, 300000) // Redirect after 5 minutes
    },
    updateAverageWaitingTime (averageWaitingTime) {
      // Ensure we have a valid number
      this.average_waiting_time = typeof averageWaitingTime === 'number' && !isNaN(averageWaitingTime) ? averageWaitingTime : 10
    },
    checkPairingStatus () {
      const subjectId = this.$store.state.subject_id
      if (!subjectId || subjectId === -1) {
        console.error('No subject ID found')
        this.failPairing()
        return
      }
      let body = new FormData()
      body.append('subject_id', subjectId)
      axios.post(this.$server_url + 'pairing', body)
        .then(response => {
          console.log('Pairing response:', response.data)
          this.updateAverageWaitingTime(response.data.average_waiting_time)
          if (response.data.success) {
            clearInterval(this.pollInterval) // Stop polling on success
            this.$store.commit('assign_group_id', { group_id: response.data.group_id })
            this.$root.initWebSocket()
          }
        })
        .catch(error => {
          console.error('Error during pairing:', error)
        })
    },

    failPairing () {
      clearInterval(this.pollInterval)
      clearTimeout(this.timeout)
      this.isPairing = false
      this.pairingFailed = true
      this.setNotReadyToPair()
      this.$root.alarm_sound.play() // 🔊 Play failure sound
      setTimeout(() => {
        this.$router.push('/FailPairing') // ❌ Redirect to fail page
      }, 3000)
    },

    startCountdown () {
      const countdownInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          clearInterval(countdownInterval)
        }
      }, 1000) // Decrease timer every second
    },

    setReadyToPair () {
      const subjectId = this.$store.state.subject_id
      if (!subjectId || subjectId === -1) {
        console.error('No subject ID found for setting ready_to_pair')
        return
      }
      let body = new FormData()
      body.append('subject_id', subjectId)
      axios.post(this.$server_url + 'set_ready_to_pair', body)
        .then(response => {
          // console.log('Set ready to pair response:', response.data)
        })
        .catch(error => {
          console.error('Error setting ready to pair:', error)
        })
    },
    setNotReadyToPair () {
      const subjectId = this.$store.state.subject_id
      if (!subjectId || subjectId === -1) {
        console.error('No subject ID found for setting not ready_to_pair')
        return
      }
      let body = new FormData()
      body.append('subject_id', subjectId)
      axios.post(this.$server_url + 'set_not_ready_to_pair', body)
        .then(response => {
          // console.log('Set not ready to pair response:', response.data)
        })
        .catch(error => {
          console.error('Error setting not ready to pair:', error)
        })
    }
  },

  mounted () {
    this.startPairing()
    // Add event listeners to detect when user leaves the page
    window.addEventListener('beforeunload', this.setNotReadyToPair)
    // Add navigation guard for back button
    this.$router.beforeEach((to, from, next) => {
      if (from.path === this.$route.path && to.path !== this.$route.path) {
        this.setNotReadyToPair()
      }
      next()
    })
  },

  beforeDestroy () {
    this.setNotReadyToPair()
    clearInterval(this.pollInterval)
    clearTimeout(this.timeout)
    // Remove event listeners
    window.removeEventListener('beforeunload', this.setNotReadyToPair)
  }
}
</script>

<style scoped>
.content-area {
  font-size: 1rem;
  line-height: 1.5;
}

.highlight {
  color: red;
  font-weight: bold;
}

.pairing-info {
  margin-top: 20px;
}

.text-danger {
  color: red;
}

.text-success {
  color: green;
}
</style>
