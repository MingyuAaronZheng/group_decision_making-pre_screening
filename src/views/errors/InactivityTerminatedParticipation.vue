<template>
  <b-jumbotron header-level="5">
    <template v-slot:lead>
      Study Terminated
    </template>
    <div class="content-area">
      <div class="alert alert-danger">
        <h4>Your participation has been terminated</h4>
        <p>
          Due to inactivity, your participation has been terminated. As mentioned in the consent form,
          the compensation will be decreased for participants who do not complete the entire study.
        </p>
        <p>
          If you believe this is an error, please contact the study administrators with your
          participant ID: {{ $store.state.subject_id }}
        </p>
        <p>Please push the button below to redirect to prolific.</p>
        <b-button
          variant="primary"
          @click="submit"
        >
          Redirect to Prolific
        </b-button>
      </div>
    </div>
  </b-jumbotron>
</template>

<script>
import axios from 'axios'

export default {
  name: 'InactivityTerminatedParticipation',
  methods: {
    submit: function (event) {
      let body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('status', 'inactive_terminate')
      axios.post(this.$root.server_url + 'submit_to_prolific', body)
        .then(response => {
          if (response.data.success === true) {
            window.location.href = response.data.prolific_url
          } else {
            alert('Some error happened!! Please leave comments and submit the HIT on Prolific.')
          }
        })
        .catch(e => {
          alert('Some error happened!! Please leave comments and submit the HIT on Prolific.' + e)
        })
    }
  },
  created () {
    // Optionally notify server about termination
    if (this.$store.state.subject_id) {
      axios.post(this.$root.server_url + 'terminate_participation', {
        subject_id: this.$store.state.subject_id
      }).catch(error => {
        console.error('Error notifying termination:', error)
      })
    }
  }
}
</script>

<style scoped>
.content-area {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}
.alert {
  text-align: left;
}
</style>
