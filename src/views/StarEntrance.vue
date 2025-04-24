<template>
  <b-jumbotron header="Welcome to our group discussion study!" header-level="4" class="mb-4">
    <div class="content-area bg-light p-4 rounded">
      <p>
        Welcome to our group discussion study and get ready for an exciting communication adventure!
      </p>
      <p>
        In this study, you will be asked to complete a series of tasks, including:
      </p>
      <b-list-group class="mb-3">
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded">Sharing your attitudes and perspectives on specific topics.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded">Participating in a discussion task using a customized chat interface.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded">Reflecting on your experience and providing feedback in a post-discussion survey.</b-list-group-item>
      </b-list-group>
      <p>
        The entire process is expected to take approximately 20–25 minutes. Your responses will remain confidential and will be used exclusively for research purposes to ensure the integrity and impact of the findings.
        You may take part in this study only once.
      </p>
      <p>
        Sounds interesting? Click the button below to start the study!
      </p>
    </div>
    <div class="button-area text-center mt-4">
      <b-button variant="primary" name="next" v-on:click="next">Start the Study</b-button>
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
      session_id: null,
      test_moderator_code: null,
      test_participant_code: null,
      test_policy_number: null,
      test_turn_number: null
    }
  },
  mounted () { // get the worker id, study id, and session id from the URL
    this.prolific_processor(location.href)
  },
  methods: {
    prolific_processor: function (url) {
      // https://dev.d1uau7ss3lp78y.amplifyapp.com/qualificationentrance/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}&TEST={{%TEST%}}&TEST_MODERATOR_CODE={{%TEST_MODERATOR%}}&TEST_PARTICIPANT_CODE={{%TEST_PARTICIPANT%}}&TEST_POLICY_NUMBER={{%TEST_POLICY%}}&TEST_TURN_NUMBER={{%TEST_TURN%}}
      this.platform = 'prolific'
      let prolificArray = url.split('?')[1].split('&')
      this.worker_id = prolificArray[0].split('=')[1]
      this.study_id = prolificArray[1].split('=')[1]
      this.session_id = prolificArray[2].split('=')[1]
      this.test = prolificArray[3] ? prolificArray[3].split('=')[1] : 'N'
      if (this.test === 'Y') {
        this.test_moderator_code = prolificArray[4] ? prolificArray[4].split('=')[1] : 0
        this.test_participant_code = prolificArray[5] ? prolificArray[5].split('=')[1] : 1
        this.test_policy_number = prolificArray[6] ? prolificArray[6].split('=')[1] : 1
        this.test_turn_number = prolificArray[7] ? prolificArray[7].split('=')[1] : 1
      }
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
        body.append('test', this.test)
        if (this.test === 'Y') {
          body.append('test_moderator_code', this.test_moderator_code)
          body.append('test_participant_code', this.test_participant_code)
          body.append('test_policy_number', this.test_policy_number)
          body.append('test_turn_number', this.test_turn_number)
        }
        axios.post(this.$root.server_url + 'create_subject', body)
          .then(response => {
            if (response.data.success === true) {
              this.$store.commit('assign_subject_id', {subject_id: response.data.subject_id})
              this.$router.push('/DemograSurvey')
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
.warning-box {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>

<style scoped>
.button-area {
  text-align: center;
  margin-top: 20px;
}
</style>
