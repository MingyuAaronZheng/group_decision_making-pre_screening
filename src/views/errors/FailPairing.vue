<template>
  <b-jumbotron header-level="5">
    <template v-slot:header>
      <div class="center-lead-text">
        Fail to find group members for you.
      </div>
    </template>
    <template v-slot:lead>
      <div class="lead-boundary">
        <div class="center-lead-text">
          <p>Sorry, we could not find enough people to form a group for the discussion.</p>
          <p>You will be compensated based on your previous tasks' time and waiting time.</p>
          <p>We will bonus you <b>15 cents per minute</b> for your waiting time.</p>
        </div>
      </div>
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

<style scoped>
.lead-boundary {
  border: 2px solid #138496;
  border-radius: 10px;
  padding: 16px 12px;
  margin: 0 auto 10px auto;
  background: #f8f9fa;
  display: block;
  max-width: 800px;
  width: 100%;
  text-align: center;
}
.center-lead-text {
  text-align: center;
}
</style>
