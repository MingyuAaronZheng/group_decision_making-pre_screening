<template>
  <b-jumbotron header-level="5">
    <template v-slot:lead>
      Early Exit Feedback
    </template>
    <div class="content-area">
      <div class="alert alert-info">
        <h4>Thank you for your participation in our study.</h4>
        <p>Since you have chosen to exit early, we would greatly appreciate your feedback to help us improve future studies.</p>
        <h5><strong>Why did you choose to exit the study early?</strong></h5>
        <p><em>(Please select all that apply or provide additional comments.)</em></p>
        <b-form-group>
          <b-form-checkbox-group v-model="reasons" stacked>
            <b-form-checkbox value="rude_participants">The other participants are too rude.</b-form-checkbox>
            <b-form-checkbox value="difficult_tasks">The tasks were too difficult or time-consuming.</b-form-checkbox>
            <b-form-checkbox value="not_expected">The study was not what I expected.</b-form-checkbox>
            <b-form-checkbox value="technical_issues">Technical issues prevented me from continuing.</b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-group label="Other (please specify):">
            <b-form-input v-model="otherReason" placeholder="Your comments..."></b-form-input>
          </b-form-group>
        </b-form-group>
        <p>Your feedback is entirely optional and will remain confidential. Thank you for helping us improve!</p>
        <div class="button-area">
          <b-button variant="primary" name="next" @click="submit">Submit Feedback</b-button>
        </div>
      </div>
    </div>
  </b-jumbotron>
</template>

<script>
import axios from 'axios'
export default {
  name: 'EarlyExit',
  data () {
    return {
      reasons: [],
      otherReason: '',
      isSubmitting: false
    }
  },
  methods: {
    async submit (event) {
      if (event) {
        event.preventDefault()
        event.stopPropagation()
      }

      if (this.isSubmitting) return

      this.isSubmitting = true

      try {
        // First terminate the participation
        const terminateBody = new FormData()
        terminateBody.append('subject_id', this.$store.state.subject_id)
        await axios.post(this.$server_url + 'terminate_participation', terminateBody)

        // Then submit to Prolific
        const body = new FormData()
        body.append('subject_id', this.$store.state.subject_id)
        body.append('status', 'early_exit')
        body.append('reasons', JSON.stringify(this.reasons))
        body.append('other_reason', this.otherReason)

        const response = await axios.post(this.$server_url + 'submit_to_prolific', body)

        if (response.data.success === true) {
          // Use window.open to open in a new tab and prevent unload events
          window.open(response.data.prolific_url, '_blank')
          // Small delay to ensure the new tab opens before we potentially close this one
          setTimeout(() => {
            // This will close the tab if it was opened by JavaScript
            window.close()
          }, 1000)
        } else {
          throw new Error('Failed to submit to Prolific')
        }
      } catch (error) {
        console.error('Error in submit:', error)
        this.isSubmitting = false
        alert('An error occurred. Please submit the HIT on Prolific manually.')
      }
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
.button-area {
  margin-top: 24px;
  text-align: center;
}
</style>
