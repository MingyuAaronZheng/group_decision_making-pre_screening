<template>
  <b-jumbotron header-level="5">
    <template v-slot:header>
      Fail to find group members for you.
    </template>
    <template v-slot:lead>
      Sorry, we could not find enough people to form a group for the discussion.
      You will be compensated based on your previous tasks' time and waiting time.
    </template>
    <div class="button-area">
      <p>Please push the button below to redirect to prolific.</p>
      <b-button variant="primary" name="next" v-on:click="submit">Submit</b-button>
    </div>
  </b-jumbotron>
</template>
<script>
import axios from 'axios'
export default {
  methods: {
    submit (event) {
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('status', 'failed_pairing')
      axios.post(this.$server_url + 'submit_to_prolific', body)
        .then(response => {
          if (response.data.success === true) {
            window.location.href = response.data.prolific_url
          } else {
            alert('Some error happened! Please submit the HIT on Prolific manually.')
          }
        })
        .catch(e => { alert('Some error happened! Please submit the HIT on Prolific manually.' + e) })
    }
  }
}
</script>
