<template>
  <div class="star-entrance-bg">
    <b-jumbotron header="Welcome to a brief background survey!" header-level="4" class="mb-4 shadow-lg entrance-jumbotron">
      <div class="content-area bg-white p-4 rounded-lg entrance-content">
        <p class="entrance-section-title">
          This short survey is designed to understand your experience with and perception of artificial intelligence. It will take a few minutes to complete.
          <br>
          <span class="text-info entrance-section-subline">You may take part in this study only once.</span>
        </p>

        <!-- Survey Questions -->
        <div class="survey-section mt-4">
          <ol>
            <li>
              How often, if at all, have you used a generative AI tool (e.g., ChatGPT, Gemini, Claude) to create text?
              <b-form-radio-group
                v-model="aiToolUsageFrequency"
                name="aiToolUsageFrequency"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiUsage" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
            <li>
              What is your general attitude towards generative AI tools (e.g., ChatGPT, Gemini, Claude)?
              <b-form-radio-group
                v-model="aiAttitudeSelection"
                name="aiAttitudeSelection"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiAttitude" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
            <li>
              When playing music, which of the following do you think uses AI?
              <b-form-radio-group
                v-model="aiInMusic"
                name="aiInMusic"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiMusic" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
            <li>
              When using email, which of the following do you think uses AI?
              <b-form-radio-group
                v-model="aiInEmail"
                name="aiInEmail"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiEmail" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
            <li>
              Thinking about devices in the home, which of the following do you think uses AI?
              <b-form-radio-group
                v-model="aiInHomeDevices"
                name="aiInHomeDevices"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiHome" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
            <li>
              To what extent do you agree with the following statements regarding the mental capacities of an AI Chatbot?
              <table class="table agreement-table">
                <thead>
                  <tr>
                    <th>Statement</th>
                    <th v-for="option in aiAgreement" :key="option.value" class="text-center align-middle">{{ option.text }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(question, index) in aiMentalCapacity" :key="index">
                    <td>{{ question.text }}</td>
                    <td v-for="option in aiAgreement" :key="option.value" class="text-center align-middle">
                      <b-form-radio
                        v-model="aiMentalCapacityResponses[index]"
                        :name="'aiMentalCapacity_' + index"
                        :value="option.value"
                        class="custom-radio-button"
                        @change="onFormInteraction"
                        button
                        button-variant="outline-black"
                        size="md"
                      >
                        <span class="square-dot"></span>
                      </b-form-radio>
                    </td>
                  </tr>
                </tbody>
              </table>
            </li>
          </ol>
        </div>

        <div class="button-area text-center mt-4">
          <b-button variant="primary" name="next" v-on:click="next" class="entrance-btn shadow-sm">Submit Survey</b-button>
        </div>
      </div>
    </b-jumbotron>

    <!-- Debriefing Modal -->
    <b-modal
      v-model="showDebriefingModal"
      title="Survey Completion"
      size="lg"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      centered
    >
      <div class="completion-message">
        <p>Thank you for completing the survey!</p>
        <p>We look forward to your participation in the main study at <strong>2:00 PM EST today</strong>.</p>
        <p class="important-note">
          Please arrive on time —- <strong>Seats are limited!</strong>  <strong>Late arrivals may miss the chance to earn the <span style="color:#007bff;">$3.50 payment</span>.</strong>
        </p>
      </div>

      <div class="feedback-area">
        <h5>Optional: Share any feedback about your experience</h5>
        <b-form-textarea
          v-model="feedback"
          placeholder="Your feedback (optional)"
          rows="4"
          max-rows="8"
          class="mb-3"
        />
      </div>

      <template #modal-footer>
        <div class="w-100 text-center">
          <b-button
            variant="primary"
            @click="submitFinalFeedback"
            :disabled="submitting"
            class="px-4"
          >
            {{ submitting ? 'Submitting...' : 'Complete Survey' }}
          </b-button>
        </div>
      </template>

      <b-alert
        v-if="feedbackSubmitted"
        variant="success"
        class="mt-3"
        show
      >
        Thank you for your feedback!
      </b-alert>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: function () {
    const aiMentalCapacityQuestions = [
      { text: 'Capable of comprehending and responding to complex ideas or thoughts in a way similar to humans.' },
      { text: 'Capable of analyzing problems critically and working toward a specific goal effectively.' },
      { text: 'Capable of authentically replicating or simulating human emotions, such as happiness or sadness.' },
      { text: 'Capable of understanding and responding appropriately to the emotions or perspectives of others.' },
      { text: 'Capable of making ethical decisions or evaluating moral dilemmas.' },
      { text: 'Capable of demonstrating self-awareness or recognizing its limitations and environment.' }
    ]
    return {
      platform: null,
      worker_id: null,
      study_id: null,
      session_id: null,
      test_moderator_code: null,
      test_participant_code: null,
      test_policy_number: null,
      test_turn_number: null,
      // Survey data
      aiUsage: [
        { text: 'Never', value: '1' },
        { text: 'Rarely (less than once per month)', value: '2' },
        { text: 'Occasionally (about once per month)', value: '3' },
        { text: 'Sometimes (2-3 times per month)', value: '4' },
        { text: 'Regularly (about once per week)', value: '5' },
        { text: 'Often (several times per week)', value: '6' },
        { text: 'Daily', value: '7' }
      ],
      aiAttitude: [
        { text: 'Very negative', value: '1' },
        { text: 'Negative', value: '2' },
        { text: 'Somewhat negative', value: '3' },
        { text: 'Neutral', value: '4' },
        { text: 'Somewhat positive', value: '5' },
        { text: 'Positive', value: '6' },
        { text: 'Very positive', value: '7' }
      ],
      aiMusic: [
        { text: 'Connecting to wireless speakers via Bluetooth', value: '1' },
        { text: 'A playlist recommendation', value: '2' },
        { text: 'Streaming the music over a wireless internet connection', value: '3' },
        { text: 'Shuffle play from a chosen playlist', value: '4' }
      ],
      aiEmail: [
        { text: 'The email service marking an email as read after the user opens it', value: '1' },
        { text: 'The email service allowing the user to schedule an email to send at a specific time in the future', value: '2' },
        { text: 'The email service categorizing an email as spam', value: '3' },
        { text: 'The email service sorting emails by time and date', value: '4' }
      ],
      aiHome: [
        { text: 'Programming a home thermostat to change temperatures at certain times', value: '1' },
        { text: 'A security camera that sends an alert when there is an unrecognized person at the door', value: '2' },
        { text: 'Programming a timer to control when lights in a home turn on and off', value: '3' },
        { text: 'An indicator light that turns red when a water filter needs to be replaced', value: '4' }
      ],
      aiMentalCapacity: aiMentalCapacityQuestions,
      aiAgreement: [
        { text: 'Strongly disagree', value: '1' },
        { text: 'Disagree', value: '2' },
        { text: 'Somewhat disagree', value: '3' },
        { text: 'Neutral', value: '4' },
        { text: 'Somewhat agree', value: '5' },
        { text: 'Agree', value: '6' },
        { text: 'Strongly agree', value: '7' }
      ],
      // Response variables
      aiToolUsageFrequency: null,
      aiAttitudeSelection: null,
      aiInMusic: null,
      aiInEmail: null,
      aiInHomeDevices: null,
      aiMentalCapacityResponses: Array(aiMentalCapacityQuestions.length).fill(null),

      // New properties for debriefing modal
      showDebriefingModal: false,
      feedback: '',
      feedbackSubmitted: false,
      submitting: false
    }
  },
  mounted () {
    this.prolific_processor(location.href)
    window.scrollTo(0, 0)
  },
  methods: {
    prolific_processor: function (url) {
      if (url.includes('localhost')) {
        this.platform = 'localhost'
      } else {
        this.platform = 'aws'
      }

      this.$store.commit('assign_platform', {platform: this.platform})
      let prolificArray = url.split('?')[1].split('&')
      this.worker_id = prolificArray[0].split('=')[1]
      this.study_id = prolificArray[1].split('=')[1]
      this.session_id = prolificArray[2].split('=')[1]
      this.test = prolificArray[3] ? prolificArray[3].split('=')[1] : 'N'
      console.log('Test:', this.test)
      if (this.test === 'Y') {
        this.test_moderator_code = prolificArray[4] ? prolificArray[4].split('=')[1] : 0
        this.test_participant_code = prolificArray[5] ? prolificArray[5].split('=')[1] : 1
        this.test_policy_number = prolificArray[6] ? prolificArray[6].split('=')[1] : 1
        this.test_turn_number = prolificArray[7] ? prolificArray[7].split('=')[1] : 1
      }
    },
    validateForm () {
      if (
        !this.aiToolUsageFrequency ||
        !this.aiAttitudeSelection ||
        !this.aiInMusic ||
        !this.aiInEmail ||
        !this.aiInHomeDevices ||
        this.aiMentalCapacityResponses.some(r => r == null)
      ) {
        this.$alert('Please complete all required fields before submitting.')
        return false
      }
      return true
    },
    onFormInteraction () {
      // Removed activity recording
    },
    next: async function () {
      if (!this.validateForm()) return

      try {
        // First create subject
        let body = new FormData()
        if (typeof this.worker_id === 'undefined' || this.worker_id === null || this.worker_id === '') {
          this.$alert('We could not get your Prolific ID information, please return the HIT.', '', 'warning')
          return
        }
        body.append('worker_id', this.worker_id)
        body.append('study_id', this.study_id)
        body.append('session_id', this.session_id)
        body.append('test', this.test)
        if (this.test === 'Y') {
          body.append('test_moderator_code', this.test_moderator_code)
          body.append('test_participant_code', this.test_participant_code)
          body.append('test_policy_number', this.test_policy_number)
          body.append('test_turn_number', this.test_turn_number)
        }

        const response = await axios.post(this.$server_url + 'create_subject', body)
        if (response.data.success !== true) {
          throw new Error(response.data.message || 'Error creating subject')
        }
        this.$store.commit('assign_subject_id', {subject_id: response.data.subject_id})

        // Then submit survey
        body = new FormData()
        body.append('subject_id', response.data.subject_id)
        body.append('aiToolUsageFrequency', this.aiToolUsageFrequency)
        body.append('aiAttitudeSelection', this.aiAttitudeSelection)
        body.append('aiInMusic', this.aiInMusic)
        body.append('aiInEmail', this.aiInEmail)
        body.append('aiInHomeDevices', this.aiInHomeDevices)
        body.append('aiMentalCapacityResponses', JSON.stringify(this.aiMentalCapacityResponses))

        const surveyResponse = await axios.post(this.$server_url + 'updateAIDemograSurvey', body)
        if (!surveyResponse.data.success) {
          throw new Error(surveyResponse.data.message || 'Error submitting survey')
        }

        // Show debriefing modal instead of navigating
        this.showDebriefingModal = true
      } catch (error) {
        console.error('Error:', error)
        this.$alert(error.message || 'An unexpected error occurred. Please try again.')
      }
    },

    // New method for final feedback submission
    async submitFinalFeedback () {
      this.submitting = true

      try {
        // Submit feedback if provided
        if (this.feedback && this.feedback.trim().length > 0) {
          const feedbackBody = new FormData()
          feedbackBody.append('subject_id', this.$store.state.subject_id)
          feedbackBody.append('feedback_text', this.feedback)
          await axios.post(this.$server_url + 'submit_feedback', feedbackBody)
          this.feedbackSubmitted = true
        }

        // Submit to Prolific
        const body = new FormData()
        body.append('subject_id', this.$store.state.subject_id)
        body.append('status', 'success')
        const response = await axios.post(this.$server_url + 'submit_to_prolific', body)
        if (response.data.success === true) {
          window.location.href = response.data.prolific_url
        } else {
          throw new Error('Failed to submit to Prolific')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$alert('Some error happened! Please submit the HIT on Prolific manually.')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>

<style scoped>
.star-entrance-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f0ff 0%, #f9f9f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.entrance-jumbotron {
  background: rgba(255,255,255,0.92);
  border-radius: 1.5rem;
  box-shadow: 0 4px 32px rgba(80,120,200,0.08);
  padding: 2.5rem 1.5rem;
  max-width: 1100px;
  margin: 2rem auto;
}
.entrance-content {
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 2px 16px rgba(80,120,200,0.08);
}
.entrance-welcome {
  font-size: 1.25rem;
  font-weight: 600;
  color: #3b3b6d;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}
.entrance-icon {
  color: #4f8cff;
  font-size: 2rem;
}
.entrance-section-title {
  font-size: 1.08rem;
  color: #3b3b6d;
  font-weight: 500;
  margin-bottom: 0.75rem;
  margin-top: 0.7rem;
  line-height: 1.8;
}
.entrance-step-list .entrance-step:last-child {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
.entrance-step-list {
  margin-bottom: 0 !important;
}
.entrance-step-list .entrance-step:last-child {
  margin-bottom: 0 !important;
}
.entrance-step-list {
  margin-bottom: 0.3rem;
}
.entrance-section-subline {
  display: inline-block;
  margin-top: 0.6em;
  margin-bottom: 0.1em;
  font-size: 1.02rem;
  letter-spacing: 0.01em;
}
.entrance-step-list {
  margin-bottom: 0.8rem;
}
.entrance-step {
  background: #f7faff !important;
  border: none !important;
  box-shadow: 0 1px 6px rgba(80,120,200,0.04);
  font-size: 1.07rem;
  transition: box-shadow 0.2s;
}
.entrance-step:hover {
  box-shadow: 0 4px 16px rgba(80,120,200,0.11);
  background: #e9f3ff !important;
}
.entrance-step-icon {
  font-size: 1.6rem;
  min-width: 2.2rem;
}
.entrance-alert {
  background: #fffbe6 !important;
  border: 1.5px solid #ffe066 !important;
  color: #8a6d3b !important;
  border-radius: 1rem !important;
  box-shadow: 0 2px 12px rgba(255,224,102,0.12);
  font-size: 1.08rem;
}
.entrance-alert-text {
  line-height: 2.05;
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}
.entrance-alert-title {
  background: #ffe066;
  color: #a35b00;
  padding: 0.22em 0.85em 0.22em 0.85em;
  border-radius: 0.7em;
  font-weight: 700;
  font-size: 1.13em;
  box-shadow: 0 1px 6px rgba(255,224,102,0.07);
  display: inline-block;
  letter-spacing: 0.01em;
}
.entrance-btn {
  font-size: 1.15rem;
  padding: 0.85rem 2.5rem;
  border-radius: 2rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 0.18s, box-shadow 0.18s, transform 0.12s;
}
.entrance-btn:hover {
  background: #1b6be0 !important;
  box-shadow: 0 4px 18px rgba(27,107,224,0.13);
  transform: translateY(-1px) scale(1.03);
}
@media (max-width: 768px) {
  .entrance-jumbotron {
    padding: 1.2rem 0.2rem;
    max-width: 98vw;
  }
  .entrance-content {
    padding: 1.1rem 0.3rem;
  }
  .entrance-welcome {
    font-size: 1.09rem;
  }
  .entrance-step {
    font-size: 1rem;
  }
  .entrance-btn {
    font-size: 1rem;
    padding: 0.7rem 1.5rem;
  }
}
.page-indicator {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  background: #f2f2f2;
  border-radius: 6px;
  padding: 6px 18px;
  display: inline-block;
  margin-bottom: 12px;
}

/* Adding new styles from DemograSurvey.vue */
.agreement-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 0.5rem;
}

.agreement-options {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 0.5rem;
}

.option-label-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 90px;
  text-align: center;
}

.option-label {
  font-size: 1rem;
  color: #495057;
  margin-bottom: 4px;
  min-height: 2.5em;
  display: block;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  line-height: 1.3;
}

::v-deep .agreement-wrapper .btn-outline-black {
  background: #fff !important;
  color: #495057 !important;
  border: none !important;
  box-shadow: none !important;
}

::v-deep .agreement-wrapper .btn-outline-black.active,
::v-deep .agreement-wrapper .btn-outline-black:active,
::v-deep .agreement-wrapper .btn-outline-black:focus,
::v-deep .agreement-wrapper .btn-outline-black:checked {
  background: #888 !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

.survey-section {
  margin-top: 2rem;
}

.survey-section ol {
  list-style-position: inside;
  padding-left: 0;
}

.survey-section ol li {
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.survey-section ol li:hover,
.survey-section ol li:focus-within {
  box-shadow: 0 8px 24px rgba(0,0,0,0.14), 0 1.5px 6px rgba(0,0,0,0.10);
  transform: translateY(-2px) scale(1.02);
  z-index: 1;
}

.square-dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 2px solid #444;
  border-radius: 50%;
  margin: 2px auto;
  transition: background 0.2s;
}

.custom-radio-button .btn {
  background: #fff !important;
  box-shadow: none;
}

.custom-radio-button .btn.active,
.custom-radio-button .btn:active,
.custom-radio-button .btn:focus {
  background: #fff !important;
  box-shadow: none;
}

.custom-radio-button .btn.active .square-dot {
  background: #444;
  border-color: #444;
}

.agreement-table {
  margin-top: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.agreement-table th,
.agreement-table td {
  vertical-align: middle;
  padding: 1rem;
  border: 1px solid #dee2e6;
}

.agreement-table th {
  background: #f8f9fa;
  font-weight: 600;
  text-align: center;
}

.agreement-table td:first-child {
  width: 40%;
  text-align: left;
}

/* Styles for debriefing modal */
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

::v-deep .modal-content {
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

::v-deep .modal-header {
  border-bottom: none;
  padding-bottom: 0;
}

::v-deep .modal-footer {
  border-top: none;
  padding-top: 0;
}
</style>
