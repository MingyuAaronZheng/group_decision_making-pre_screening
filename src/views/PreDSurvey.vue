<template>
  <b-jumbotron header-level="5">
    <template v-slot:lead>
      Please indicate your level of agreement with each policy statement below.
    </template>
    <div class="content-area">
      <div v-for="(statement, index) in selectedStatements" :key="index" class="policy-statement">
        <!-- Display the policy statement -->
        <p><strong>Statement {{ index + 1 }}:</strong> {{ statement }}</p>

        <!-- Question 1: Extent of agreement -->
        <b-form-radio-group
          v-model="responses[index].agreement"
          :name="'agreement_' + index"
          :options="agreementScale"
          stacked
          @change="onFormInteraction"
        />
      </div>
      <!-- Final submit button -->
      <div class="button-area">
          <b-button variant="success" @click="finalSubmit">Submit and complete</b-button>
        </div>
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
        {text: 'Strongly disagree', value: -3},
        {text: 'Disagree', value: -2},
        {text: 'Somewhat disagree', value: -1},
        {text: 'Somewhat agree', value: 1},
        {text: 'Agree', value: 2},
        {text: 'Strongly agree', value: 3}
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
  methods: {
    // Move to the next statement (optional functionality)
    moveToNext (index) {
      if (!this.responses[index].agreement) {
        alert('Please complete the question before proceeding.')
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
        alert('Please complete all questions before submitting.')
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
.jumbotron {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
}

.jumbotron >>> .lead {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-area {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.policy-statement {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.b-form-radio-group {
  margin-top: 1rem;
}

.button-area {
  margin-top: 2rem;
  text-align: center;
}
</style>
