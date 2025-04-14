<template>
  <b-jumbotron header-level="5">
    <template v-slot:header>
      <h3 style="text-align: center; margin-bottom: 0;">
        Welcome to Participate in Our Study! 👋
      </h3>
    </template>
    <div class="content-area">
      <p>
        In this short study, we will ask you to share your opinions on a few different policy topics.
      </p>
      <p>
        The study should only take about 1 to 3 minutes to complete. Your responses will be kept completely confidential and used only for research purposes.
        Please note that you can only participate in this study once.
      </p>
      <p>
        Ready to get started? Click the button below!
      </p>
    </div>
    <div class="button-area">
      <b-button variant="primary" name="next" v-on:click="next">Begin the Study</b-button>
    </div>
  </b-jumbotron>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      platform: null,
      worker_id: null,
      study_id: null,
      session_id: null
    }
  },
  mounted () { // get the worker id, study id, and session id from the URL
    this.prolific_processor(location.href)
  },
  methods: {
    prolific_processor: function (url) {
      // https://dev.d1uau7ss3lp78y.amplifyapp.com/qualificationentrance/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
      this.platform = 'prolific'
      let prolificArray = url.split('?')[1].split('&')
      this.worker_id = prolificArray[0].split('=')[1]
      this.study_id = prolificArray[1].split('=')[1]
      this.session_id = prolificArray[2].split('=')[1]
    },
    next: function () {
      let body = new FormData()
      if (this.$store.state.subject_id === null) { // If no subject id is stored in state, it means this is a new login
        if (typeof this.worker_id === 'undefined' || this.worker_id === null || this.worker_id === '') {
          this.$alert('We could not get your Prolific ID information, please return the HIT.', '', 'warning')
          return
        }
        body.append('worker_id', this.worker_id)
        body.append('study_id', this.study_id)
        body.append('session_id', this.session_id)

        axios.post(this.$root.server_url + 'create_subject', body)
          .then(response => {
            if (response.data.success === true) {
              this.$store.commit('assign_subject_id', {subject_id: response.data.subject_id})
              this.$router.push('/PreDSurvey')
            } else {
              this.$alert(response.data.message || 'Error creating subject', '', 'warning')
            }
          })
          .catch(e => {
            this.$alert(e.response.data.detail)
          })
      }
    }
  }
}
</script>

<style scoped>
.jumbotron {
  font-family: 'Arial', sans-serif;
  line-height: 1.7; /* Slightly increased line height for better readability */
}

.jumbotron >>> .lead {
  font-size: 1.3rem; /* Slightly reduced font size for lead text to be less dominant */
  margin-bottom: 1.8rem; /* Adjusted margin for better spacing */
  color: #495057; /* Darken lead text color for better contrast and readability */
}

.jumbotron >>> .display-4 {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.5rem; /* Adjusted header size */
  color: #007bff; /* Primary color to highlight the welcome message */
}

.content-area {
  font-size: 1.1rem; /* Slightly reduced font size in content area for better visual hierarchy */
  max-width: 750px; /* Slightly reduced max-width for content to breathe better */
  margin: 0 auto;
  padding: 1.2rem; /* Slightly increased padding in content area */
}

.content-area p {
  margin-bottom: 1.2rem; /* Adjusted paragraph margin */
  padding: 1rem 1.5rem; /* Adjusted padding within paragraphs */
  background: #f8f9fa;
  border-radius: 6px; /* Slightly more rounded corners for paragraph backgrounds */
  border: 1px solid #e0e0e0; /* Added a subtle border to paragraphs for definition */
}

.button-area {
  margin-top: 2.5rem; /* Increased margin above button area */
  text-align: center;
}

.button-area .btn {
  padding: 0.8rem 2.2rem; /* Adjusted button padding */
  font-size: 1.1rem;
  border-radius: 5px; /* Rounded button corners */
}
</style>
