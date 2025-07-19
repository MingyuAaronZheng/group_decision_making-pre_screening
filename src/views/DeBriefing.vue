<template>
  <div class="debriefing">
    <div class="page-indicator text-center mb-1">Page: 3 / 3</div>
    <h1>Survey Completion</h1>
    <div class="completion-message">
      <p>Thank you for completing the survey!</p>
      <p>We look forward to your participation in the main study at <strong>2:00 PM ESTtoday</strong>.</p>
      <p class="important-note">
        <strong>Seats are limited!</strong> Please arrive on time to secure your spot. <strong>Late arrivals may miss the chance to earn the <span style="color:#007bff;">$3.50 payment</span>.</strong>
      </p>
    </div>

    <div class="feedback-area">
      <h5>Optional: Share any feedback about your experience (optional)</h5>
      <b-form-textarea
        v-model="feedback"
        placeholder="Your feedback (optional)"
        rows="4"
        max-rows="8"
        class="mb-3"
      />
    </div>

    <div class="button-area">
      <h5>Please click the button below to complete the survey!</h5>
      <b-button variant="primary" name="next" v-on:click="submit" :disabled="submitting">
        {{ submitting ? 'Submitting...' : 'Complete Survey' }}
      </b-button>
    </div>
    <b-alert v-if="feedbackSubmitted" variant="success" class="mt-3">Thank you for your feedback!</b-alert>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DeBriefing',
  data () {
    return {
      feedback: '',
      feedbackSubmitted: false,
      submitting: false
    }
  },
  methods: {
    async submit (event) {
      this.submitting = true
      // Submit feedback if provided
      if (this.feedback && this.feedback.trim().length > 0) {
        try {
          const feedbackBody = new FormData()
          feedbackBody.append('subject_id', this.$store.state.subject_id)
          feedbackBody.append('feedback_text', this.feedback)
          await axios.post(this.$server_url + 'submit_feedback', feedbackBody)
          this.feedbackSubmitted = true
        } catch (e) {
          // Feedback is optional, so just log error
          console.error('Feedback submission failed', e)
        }
      }
      // Continue with Prolific submission
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('status', 'success')
      axios.post(this.$server_url + 'submit_to_prolific', body)
        .then(response => {
          if (response.data.success === true) {
            window.location.href = response.data.prolific_url
          } else {
            alert('Some error happened! Please submit the HIT on Prolific manually.')
          }
        })
        .catch(e => { alert('Some error happened! Please submit the HIT on Prolific manually.' + e) })
        .finally(() => { this.submitting = false })
    }
  }
}
</script>

<style scoped>
.debriefing {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}
.debriefing h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}
.completion-message {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.completion-message p {
  margin-bottom: 12px;
  font-size: 1.1em;
}
.completion-message p:last-child {
  margin-bottom: 0;
}
.important-note {
  color: #e65100;
  font-weight: 500;
}
.feedback-area {
  margin: 32px 0 16px 0;
}
.button-area {
  text-align: center;
  margin-top: 24px;
}
.button-area h5 {
  margin-bottom: 16px;
}
</style>
