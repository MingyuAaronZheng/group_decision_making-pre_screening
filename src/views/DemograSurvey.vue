<template>
  <div class="centered-survey-wrapper">
    <div class="intro-center-frame">
      <div class="highlighted-lead">
        <div class="intro-title">Demographic Survey</div>
        Before proceeding to the group discussion, we would like to gather some information about your background as well as your attitudes and perspectives on specific topics.
      </div>
    </div>
    <b-jumbotron header-level="5" class="survey-container questions-area">
      <div class="content-area">
        <ol>
        <li>
          Please select your age range:
          <b-form-radio-group
            v-model="ageRange"
            name="ageRange"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in age" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          Please indicate your gender:
          <b-form-radio-group
            v-model="genderSelection"
            name="genderSelection"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in gender" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          Please select your annual income range:
          <b-form-radio-group
            v-model="incomeRange"
            name="incomeRange"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in income" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          What is the highest level of education you have completed?
          <b-form-radio-group
            v-model="educationLevel"
            name="educationLevel"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in education" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          How would you describe your ethnicity?
          <b-form-radio-group
            v-model="ethnicitySelection"
            name="ethnicitySelection"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in ethnicity" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          Please indicate your religious affiliation, if any:
          <b-form-radio-group
            v-model="religionAffiliation"
            name="religionAffiliation"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in religion" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          Which of the following best describes your political party affiliation?
          <b-form-radio-group
            v-model="politicalAffiliation"
            name="politicalAffiliation"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in politics" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          Which of the following best describes your current immigration status?
          <b-form-radio-group
            v-model="immigrationStatus"
            name="immigrationStatus"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in immigration" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li>
          How often do you read or watch debates on social media (without posting arguments yourself)?
          <b-form-radio-group
            v-model="socialMediaReadingFrequency"
            name="socialMediaReadingFrequency"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in socialMediaRead" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li v-if="showReadingPlatforms" class="mt-3">
          <p>Which platforms do you use to read or watch debates? (Select all that apply)</p>
          <b-form-checkbox-group
            v-model="socialMediaReadingPlatforms"
            name="socialMediaReadingPlatforms"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in socialMediaPlatforms" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-checkbox :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-checkbox-group>
        </li>
        <li>
          How often do you post and actively partake in debates on social media?
          <b-form-radio-group
            v-model="socialMediaPostingFrequency"
            name="socialMediaPostingFrequency"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in socialMediaPost" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-radio :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-radio-group>
        </li>
        <li v-if="showPostingPlatforms" class="mt-3">
          <p>Which platforms do you use to post and participate in debates? (Select all that apply)</p>
          <b-form-checkbox-group
            v-model="socialMediaPostingPlatforms"
            name="socialMediaPostingPlatforms"
            buttons
            button-variant="outline-black"
            size="md"
            class="agreement-options custom-radio-button"
            @change="onFormInteraction"
          >
            <div class="agreement-wrapper">
              <div v-for="option in socialMediaPlatforms" :key="option.value" class="option-label-wrapper">
                <div class="option-label">{{ option.text }}</div>
                <b-form-checkbox :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-checkbox-group>
        </li>
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
          <b-form-checkbox-group
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
                <b-form-checkbox :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-checkbox-group>
        </li>
        <li>
          When using email, which of the following do you think uses AI?
          <b-form-checkbox-group
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
                <b-form-checkbox :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-checkbox-group>
        </li>
        <li>
          Thinking about devices in the home, which of the following do you think uses AI?
          <b-form-checkbox-group
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
                <b-form-checkbox :value="option.value" class="custom-radio-button" />
              </div>
            </div>
          </b-form-checkbox-group>
        </li>
        <li>
          To what extent do you agree with the following statements regarding the mental capacities of an AI Chatbot?
          <ul>
            <li v-for="(question, index) in aiMentalCapacity" :key="index">
              {{ question.text }}
              <b-form-radio-group
                v-model="aiMentalCapacityResponses[index]"
                :name="'aiMentalCapacity_' + index"
                buttons
                button-variant="outline-black"
                size="md"
                class="agreement-options custom-radio-button"
                @change="onFormInteraction"
              >
                <div class="agreement-wrapper">
                  <div v-for="option in aiAgreement" :key="option.value" class="option-label-wrapper">
                    <div class="option-label">{{ option.text }}</div>
                    <b-form-radio :value="option.value" class="custom-radio-button" />
                  </div>
                </div>
              </b-form-radio-group>
            </li>
          </ul>
        </li>
      </ol>
    </div>
    <div class="button-area">
      <b-button variant="primary" name="next" v-on:click="next">Next</b-button>
    </div>
  </b-jumbotron>
</div>
</template>

<script>
import axios from 'axios'
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
      age: [
        { text: '18–29', value: '1' },
        { text: '30–39', value: '2' },
        { text: '40–49', value: '3' },
        { text: '50–59', value: '4' },
        { text: '60+', value: '5' },
        { text: 'Prefer not to answer', value: '6' }
      ],
      gender: [
        { text: 'Female', value: '1' },
        { text: 'Male', value: '2' },
        { text: 'Non-binary', value: '3' },
        { text: 'Other', value: '4' },
        { text: 'Prefer not to answer', value: '5' }
      ],
      income: [
        { text: 'Less than $10,000', value: '1' },
        { text: '$10,000–$20,000', value: '2' },
        { text: '$20,000–$40,000', value: '3' },
        { text: '$40,000–$100,000', value: '4' },
        { text: 'More than $100,000', value: '5' },
        { text: 'Prefer not to answer', value: '6' }
      ],
      education: [
        { text: 'Primary school', value: '1' },
        { text: 'Secondary school', value: '2' },
        { text: 'Undergraduate degree', value: '3' },
        { text: 'Graduate degree', value: '4' },
        { text: 'Higher education (e.g., PhD, postdoctoral)', value: '5' },
        { text: 'Prefer not to answer', value: '6' }
      ],
      ethnicity: [
        { text: 'Black', value: '1' },
        { text: 'White', value: '2' },
        { text: 'Asian', value: '3' },
        { text: 'Mixed', value: '4' },
        { text: 'Other', value: '5' },
        { text: 'Prefer not to answer', value: '6' }
      ],
      religion: [
        { text: 'Christian', value: '1' },
        { text: 'Muslim', value: '2' },
        { text: 'Hindu', value: '3' },
        { text: 'Sikh', value: '4' },
        { text: 'Jewish', value: '5' },
        { text: 'Buddhist', value: '6' },
        { text: 'No religion', value: '7' },
        { text: 'Other', value: '8' },
        { text: 'Prefer not to answer', value: '9' }
      ],
      politics: [
        { text: 'Democrat', value: '1' },
        { text: 'Republican', value: '2' },
        { text: 'Independent', value: '3' },
        { text: 'Libertarian', value: '4' },
        { text: 'Green Party', value: '5' },
        { text: 'Other', value: '6' },
        { text: 'None', value: '7' },
        { text: 'Prefer not to answer', value: '8' }
      ],
      immigration: [
        { text: 'U.S. Citizen by birth', value: '1' },
        { text: 'Naturalized U.S. Citizen', value: '2' },
        { text: 'Permanent Resident (Green Card holder)', value: '3' },
        { text: 'Temporary Visa holder (e.g., student, work)', value: '4' },
        { text: 'Other', value: '5' },
        { text: 'Prefer not to answer', value: '6' }
      ],
      socialMediaRead: [
        { text: 'Never', value: '1' },
        { text: 'Rarely (once in the past six months)', value: '2' },
        { text: 'Occasionally (a few times in the past six months)', value: '3' },
        { text: 'Sometimes (a few times in the past month)', value: '4' },
        { text: 'Regularly (about once a week)', value: '5' },
        { text: 'Often (a few times a week)', value: '6' },
        { text: 'Daily', value: '7' }
      ],
      socialMediaPost: [
        { text: 'Never', value: '1' },
        { text: 'Rarely (once in the past six months)', value: '2' },
        { text: 'Occasionally (a few times in the past six months)', value: '3' },
        { text: 'Sometimes (a few times in the past month)', value: '4' },
        { text: 'Regularly (about once a week)', value: '5' },
        { text: 'Often (a few times a week)', value: '6' },
        { text: 'Daily', value: '7' }
      ],
      socialMediaPlatforms: [
        { text: 'Facebook', value: 'facebook' },
        { text: 'Twitter/X', value: 'twitter' },
        { text: 'Reddit', value: 'reddit' },
        { text: 'LinkedIn', value: 'linkedin' },
        { text: 'Instagram', value: 'instagram' },
        { text: 'TikTok', value: 'tiktok' },
        { text: 'YouTube', value: 'youtube' },
        { text: 'Other', value: 'other' }
      ],
      aiUsage: [
        { text: 'Never', value: '1' },
        { text: 'Rarely (once in the past six months)', value: '2' },
        { text: 'Occasionally (a few times in the past six months)', value: '3' },
        { text: 'Sometimes (a few times in the past month)', value: '4' },
        { text: 'Regularly (about once a week)', value: '5' },
        { text: 'Often (a few times a week)', value: '6' },
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
        { text: 'Using Bluetooth to connect to wireless speakers', value: '1' },
        { text: 'A playlist recommendation', value: '2' },
        { text: 'A wireless internet connection to stream the music', value: '3' },
        { text: 'Shuffle play from a chosen playlist', value: '4' },
        { text: 'Not sure', value: '5' }
      ],
      aiEmail: [
        { text: 'The email service marking an email as read after the user opens it', value: '1' },
        { text: 'The email service allowing the user to schedule an email to send at a specific time in the future', value: '2' },
        { text: 'The email service categorizing an email as spam', value: '3' },
        { text: 'The email service sorting emails by time and date', value: '4' },
        { text: 'Not sure', value: '5' }
      ],
      aiHome: [
        { text: 'Programming a home thermostat to change temperatures at certain times', value: '1' },
        { text: 'A security camera that sends an alert when there is an unrecognized person at the door', value: '2' },
        { text: 'Programming a timer to control when lights in a home turn on and off', value: '3' },
        { text: 'An indicator light that turns red when a water filter needs to be replaced', value: '4' },
        { text: 'Not sure', value: '5' }
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
      ageRange: null,
      genderSelection: null,
      incomeRange: null,
      educationLevel: null,
      ethnicitySelection: null,
      religionAffiliation: null,
      politicalAffiliation: null,
      immigrationStatus: null,
      socialMediaReadingFrequency: null,
      socialMediaPostingFrequency: null,
      aiToolUsageFrequency: null,
      aiAttitudeSelection: null,
      aiInMusic: [],
      aiInEmail: [],
      aiInHomeDevices: [],
      aiMentalCapacityResponses: Array(aiMentalCapacityQuestions.length).fill(null),
      socialMediaReadingPlatforms: [],
      socialMediaPostingPlatforms: []
    }
  },
  computed: {
    showReadingPlatforms () {
      return this.socialMediaReadingFrequency && parseInt(this.socialMediaReadingFrequency) > 1
    },
    showPostingPlatforms () {
      return this.socialMediaPostingFrequency && parseInt(this.socialMediaPostingFrequency) > 1
    }
  },
  methods: {
    validateForm () {
      if (
        !this.ageRange ||
        !this.genderSelection ||
        !this.incomeRange ||
        !this.educationLevel ||
        !this.ethnicitySelection ||
        !this.religionAffiliation ||
        !this.politicalAffiliation ||
        !this.immigrationStatus ||
        !this.socialMediaReadingFrequency ||
        !this.socialMediaPostingFrequency ||
        (this.showReadingPlatforms && this.socialMediaReadingPlatforms.length === 0) ||
        (this.showPostingPlatforms && this.socialMediaPostingPlatforms.length === 0) ||
        !this.aiToolUsageFrequency ||
        !this.aiAttitudeSelection ||
        !this.aiInMusic ||
        !this.aiInEmail ||
        !this.aiInHomeDevices ||
        Object.keys(this.aiMentalCapacityResponses).length !== this.aiMentalCapacity.length // Ensure all dynamic AI mental capacity responses are filled
      ) {
        this.$alert('Please complete all required fields before proceeding.')
        return false
      }
      return true
    },
    onFormInteraction () {
      this.$store.dispatch('recordActivity')
    },
    showInactivityWarning () {
      this.$bvToast.toast('Warning: You appear to be inactive. Please continue with the survey within 30 seconds or you may be removed.', {
        title: 'Inactivity Warning',
        variant: 'warning',
        solid: true,
        autoHideDelay: 30000
      })
    },
    handleInactiveUser () {
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      axios.post(this.$root.server_url + 'terminate_participation', body)
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
      body.append('ageRange', this.ageRange)
      body.append('genderSelection', this.genderSelection)
      body.append('incomeRange', this.incomeRange)
      body.append('educationLevel', this.educationLevel)
      body.append('ethnicitySelection', this.ethnicitySelection)
      body.append('religionAffiliation', this.religionAffiliation)
      body.append('politicalAffiliation', this.politicalAffiliation)
      body.append('immigrationStatus', this.immigrationStatus)
      body.append('socialMediaReadingFrequency', this.socialMediaReadingFrequency)
      body.append('socialMediaPostingFrequency', this.socialMediaPostingFrequency)
      body.append('socialMediaReadingPlatforms', JSON.stringify(this.socialMediaReadingPlatforms))
      body.append('socialMediaPostingPlatforms', JSON.stringify(this.socialMediaPostingPlatforms))
      body.append('aiToolUsageFrequency', this.aiToolUsageFrequency)
      body.append('aiAttitudeSelection', this.aiAttitudeSelection)
      body.append('aiInMusic', this.aiInMusic)
      body.append('aiInEmail', this.aiInEmail)
      body.append('aiInHomeDevices', this.aiInHomeDevices)
      body.append('aiMentalCapacityResponses', JSON.stringify(this.aiMentalCapacityResponses))

      axios.post(this.$root.server_url + 'updateDemograSurvey', body)
        .then(response => {
          if (!response.data.success) {
            throw new Error(response.data.message || 'Error submitting demographic survey')
          }
          this.$router.push('/PreDSurvey')
        })
        .catch(error => {
          console.error('Error:', error)
          this.$alert(error.message || 'An unexpected error occurred. Please try again.')
        })
    }

  },
  mounted () {
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
</style>
