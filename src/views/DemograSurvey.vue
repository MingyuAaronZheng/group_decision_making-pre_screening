<template>
  <div class="centered-survey-wrapper">
    <div class="intro-center-frame">
      <div class="highlighted-lead">
        <div class="intro-title">AI Experience Survey</div>
        This survey is designed to understand your experience with and perception of artificial intelligence.
      </div>
    </div>
    <b-jumbotron header-level="5" class="survey-container questions-area">
      <div class="button-area">
        <b-button variant="outline-secondary" v-if="$store.state.test === 'Y'" @click="skipSurvey" class="mr-2">Skip to PreDSurvey</b-button>
      </div>
      <div class="content-area">
        <div class="page-indicator text-center mb-1">Page: 2 / 3</div>
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
      <div class="button-area">
        <b-button variant="primary" @click="next">Submit</b-button>
      </div>
    </b-jumbotron>
  </div>
</template>

<script>
import axios from 'axios'
import { notifyInactivity } from '@/plugins/notificationService.js'
export default {
  data () {
    const aiMentalCapacityQuestions = [
      { text: 'Capable of comprehending and responding to complex ideas or thoughts in a way similar to humans.' },
      { text: 'Capable of analyzing problems critically and working toward a specific goal effectively.' },
      { text: 'Capable of authentically replicating or simulating human emotions, such as happiness or sadness.' },
      { text: 'Capable of understanding and responding appropriately to the emotions or perspectives of others.' },
      { text: 'Capable of making ethical decisions or evaluating moral dilemmas.' },
      { text: 'Capable of demonstrating self-awareness or recognizing its limitations and environment.' }
    ]
    return {
      // Data for question options
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
      // Variables for storing user responses
      aiToolUsageFrequency: null,
      aiAttitudeSelection: null,
      aiInMusic: null,
      aiInEmail: null,
      aiInHomeDevices: null,
      aiMentalCapacityResponses: Array(aiMentalCapacityQuestions.length).fill(null)
    }
  },
  methods: {
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
      this.$store.dispatch('recordActivity')
    },
    showInactivityWarning () {
      notifyInactivity(this.$bvToast, this.$store.state.test)
    },
    handleInactiveUser () {
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      axios.post(this.$server_url + 'terminate_participation', body)
        .then(() => {
          this.$router.push('/InactivityTerminatedParticipation')
        })
        .catch(error => console.error(error))
    },
    next () {
      if (!this.validateForm()) return

      this.$store.dispatch('recordActivity')

      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('aiToolUsageFrequency', this.aiToolUsageFrequency)
      body.append('aiAttitudeSelection', this.aiAttitudeSelection)
      body.append('aiInMusic', this.aiInMusic)
      body.append('aiInEmail', this.aiInEmail)
      body.append('aiInHomeDevices', this.aiInHomeDevices)
      body.append('aiMentalCapacityResponses', JSON.stringify(this.aiMentalCapacityResponses))

      axios.post(this.$server_url + 'updateAIDemograSurvey', body)
        .then(response => {
          if (!response.data.success) {
            throw new Error(response.data.message || 'Error submitting survey')
          }
          this.$router.push('/DeBriefing')
        })
        .catch(error => {
          console.error('Error:', error)
          this.$alert(error.message || 'An unexpected error occurred. Please try again.')
        })
    },
    skipSurvey () {
      this.$router.push('/DeBriefing')
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.$store.commit('startInactivityCheck')
    window.addEventListener('show-inactivity-warning', this.showInactivityWarning)
    window.addEventListener('remove-inactive-user', this.handleInactiveUser)
  },
  beforeDestroy () {
    window.removeEventListener('show-inactivity-warning', this.showInactivityWarning)
    window.removeEventListener('remove-inactive-user', this.handleInactiveUser)
    this.$store.commit('stopInactivityCheck')
  }
}
</script>

<style scoped>
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

/* Default state: white background, grey border, dark text */
::v-deep .agreement-wrapper .btn-outline-black {
  background: #fff !important;
  color: #495057 !important;
  border: none !important;
  box-shadow: none !important;
}

/* Selected/active/focus state: grey background, white text */
::v-deep .agreement-wrapper .btn-outline-black.active,
::v-deep .agreement-wrapper .btn-outline-black:active,
::v-deep .agreement-wrapper .btn-outline-black:focus,
::v-deep .agreement-wrapper .btn-outline-black:checked {
  background: #888 !important;
  color: #fff !important;
  border: none !important;
  box-shadow: none !important;
}

.btn-outline-black.active,
.btn-outline-black:active,
.btn-outline-black:focus,
.btn-outline-black:checked {
  color: #fff !important;
  background-color: #888 !important;
  border-color: #888 !important;
}

  ::v-deep .demogra-options .btn,
  ::v-deep .demogra-options .btn-primary,
  ::v-deep .demogra-options .btn-outline-primary {
    --bs-btn-bg: #ccc !important;
    --bs-btn-border-color: #ccc !important;
    --bs-btn-hover-bg: #b3b3b3 !important;
    --bs-btn-active-bg: #ccc !important;
    --bs-btn-active-border-color: #ccc !important;
  }

.content-area ol {
  list-style-position: inside;
  padding-left: 0;
}

.content-area ol li {
  border: 1px solid #ccc;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  transition: box-shadow 0.2s, transform 0.2s;
}

.content-area ol li:hover, .content-area ol li:focus-within {
  box-shadow: 0 8px 24px rgba(0,0,0,0.14), 0 1.5px 6px rgba(0,0,0,0.10);
  transform: translateY(-2px) scale(1.02);
  z-index: 1;
}

.intro-center-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 10vh;
  width: 100vw;
}

.highlighted-lead {
  background: #fffbe6;
  border: 2px solid #ffe066;
  border-radius: 12px;
  padding: 1.25rem 2rem;
  margin-top: 4rem;
  margin-bottom: 1rem;
  font-size: 1.15rem;
  color: #7c6700;
  box-shadow: 0 2px 8px rgba(255, 217, 0, 0.08);
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.01em;
  max-width: 900px;
}

.intro-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #7c6700;
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

</style>
