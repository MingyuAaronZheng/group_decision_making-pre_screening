<template>
  <b-jumbotron header-level="5" class="survey-container">
    <template v-slot:header>
      <h2 class="survey-title">Policy Statement Survey</h2>
    </template>
    <template v-slot:lead>
      Please indicate your level of agreement with each policy statement below.
    </template>

    <div class="content-area">
      <div v-for="(statement, index) in selectedStatements" :key="index" class="policy-statement">
        <!-- Display the policy statement -->
        <div class="statement-header">
          <h3 class="statement-number">Statement {{ index + 1 }}</h3>
          <div class="statement-text">{{ statement }}</div>
        </div>
        <!-- Question 1: Extent of agreement -->
        <b-form-radio-group
          v-model="responses[index].agreement"
          :name="'agreement_' + index"
          buttons
          button-variant="outline-primary"
          size="md"
          class="agreement-options"
          @change="onFormInteraction"
        >
          <div class="agreement-wrapper">
            <div
              v-for="(option, optIndex) in agreementScale"
              :key="optIndex"
              class="option-label-wrapper"
            >
              <div class="option-label">
                {{ getAgreementLabel(option.value) }}
              </div>
              <b-form-radio :value="option.value" class="custom-radio-button">
                {{ option.text }}
              </b-form-radio>
            </div>
          </div>
        </b-form-radio-group>
      </div>
    </div>

    <!-- Final submit button -->
    <div class="button-area">
      <b-button variant="primary" size="lg" @click="finalSubmit" :disabled="!isFormComplete">
        <font-awesome-icon :icon="['fas', 'circle-check']" class="mr-2" />
        Submit and complete
      </b-button>
    </div>
  </b-jumbotron>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    const initialResponses = this.$store.state.masterStatements.map(() => ({
      agreement: null
    }))
    return {
      // selected statements = master statements NOW
      selectedStatements: this.$store.state.masterStatements,

      // Response data for each statement
      responses: initialResponses,

      // Agreement scale options
      agreementScale: [
        {text: '-3', value: -3},
        {text: '-2', value: -2},
        {text: '-1', value: -1},
        {text: '+1', value: 1},
        {text: '+2', value: 2},
        {text: '+3', value: 3}
      ],

      // Importance scale options
      importanceScale: [
        {text: 'Not at all important to me', value: 1},
        {text: 'Slightly important to me', value: 2},
        {text: 'Somewhat important to me', value: 3},
        {text: 'Moderately important to me', value: 4},
        {text: 'Important to me', value: 5},
        {text: 'Very important to me', value: 6},
        {text: 'Extremely important to me', value: 7}
      ]
    }
  },
  mounted () {
    // Initialize responses array with empty objects for each statement
    this.responses = this.selectedStatements.map(() => ({
      agreement: null
    }))
    this.$store.commit('startInactivityCheck')
    window.addEventListener('show-inactivity-warning', this.showInactivityWarning)
    window.addEventListener('remove-inactive-user', this.handleInactiveUser)
  },
  computed: {
    // Calculate progress value based on completed responses
    progressValue () {
      return this.responses.filter(response => response.agreement !== null).length
    },

    // Check if all questions are answered
    isFormComplete () {
      return !this.responses.some(response => response.agreement === null)
    }
  },
  methods: {
    getAgreementLabel (value) {
      switch (value) {
        case -3: return 'Strongly Disagree'
        case -2: return 'Disagree'
        case -1: return 'Somewhat Disagree'
        case 1: return 'Somewhat Agree'
        case 2: return 'Agree'
        case 3: return 'Strongly Agree'
        default: return ''
      }
    },
    // Move to the next statement (optional functionality)
    moveToNext (index) {
      if (!this.responses[index].agreement) {
        this.$bvToast.toast('Please complete the current question before proceeding.', {
          title: 'Required Field',
          variant: 'warning',
          solid: true
        })
        return
      }
      // Scroll to the next statement or focus
      const nextElement = document.querySelector(`[name='agreement_${index + 1}']`)
      if (nextElement) {
        nextElement.scrollIntoView({behavior: 'smooth'})
      }
    },

    // Final submit logic
    finalSubmit () {
      const incomplete = this.responses.some(
        (response) => !response.agreement
      )
      if (incomplete) {
        this.$bvToast.toast('Please answer all questions before submitting.', {
          title: 'Incomplete Survey',
          variant: 'warning',
          solid: true
        })
        return
      }

      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('responses', JSON.stringify(this.responses))
      // Store the responses in frontend for later comparison with post-discussion survey
      this.$store.commit('setPreDiscussionResponses', this.responses)
      // Submit the data to the server
      axios
        .post(this.$root.server_url + 'Update_pre_discussion_survey', body)
        .then((response) => {
          if (response.data.success) {
            this.$router.push('/PreDSurveySuccess')
          } else {
            alert(response.data.message)
          }
        })
        .catch(() => {
          alert('An error occurred while submitting. Please try again.')
        })
    },

    // Track activity on form interactions
    onFormInteraction () {
      this.$store.dispatch('recordActivity')
    },
    showInactivityWarning () {
      this.$bvToast.toast('Warning: You appear to be inactive. Please continue with the survey within 15 seconds or you may be removed.', {
        title: 'Inactivity Warning',
        variant: 'warning',
        solid: true,
        autoHideDelay: 10000
      })
    },
    handleInactiveUser () {
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      axios.post(this.$root.server_url + 'terminate_participation', body)
        .then(response => {
          this.$router.push('/timeout')
        })
        .catch(error => {
          console.error(error)
        })
    }
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
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 12px;
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
  font-size: 0.8rem;
  color: #495057;
  margin-bottom: 4px;
  height: 2.5em; /* 🔥 this keeps all labels same height */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.custom-radio-button >>> .btn {
  width: 100%;
  padding: 0.6rem 1rem;
}

.survey-container {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.survey-title {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.jumbotron >>> .lead {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #495057;
}

.content-area {
  font-size: 1.2rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

.policy-statement {
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.policy-statement:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.statement-header {
  margin-bottom: 1.5rem;
}

.statement-number {
  font-size: 1.3rem;
  color: #007bff;
  margin-bottom: 0.5rem;
}

.statement-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #343a40;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.flex-grow {
  flex-grow: 1;
}

.agreement-options {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.5rem;
}

.agreement-options >>> .btn-group {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.agreement-options >>> .btn {
  flex: 1;
  margin: 0 4px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.agreement-options >>> .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.agreement-options >>> .active {
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.button-area {
  margin-top: 3rem;
  text-align: center;
}

.button-area .btn {
  padding: 0.75rem 2rem;
  font-weight: bold;
  transition: all 0.3s;
  border-radius: 30px;
}

.button-area .btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.progress-label {
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}
</style>
