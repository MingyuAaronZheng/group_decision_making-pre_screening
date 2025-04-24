<template>
  <b-jumbotron header-level="5" class="text-center">
    <template v-slot:lead>
      Failed attention checks
    </template>
    <div class="content-area">
      <div class="alert alert-danger" style="text-align: center;">
        <h4>Your participation has been terminated</h4>
        <p>
          Because you did not pass our attention checks, your compensation will be decreased according to the portion of the study you completed.
        </p>
        <p>
          If you believe this is an error, please contact the study administrators with your participant ID: {{ $store.state.subject_id }}
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
  name: 'FailAttention',
  methods: {
    submit: function (event) {
      let body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('status', 'failed_attention')
      axios.post(this.$server_url + 'submit_to_prolific', body)
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
  text-align: center;
}
</style>
