<template>
  <div class="debriefing">
    <div class="page-indicator text-center mb-1">Page: 10 / 10</div>
    <h1>Debriefing</h1>
    <p>Thank you for participating in the earlier group discussion. We understand that some topics may feel sensitive or polarizing.</p>
    <p>If you ever need support, please explore these mental health resources:</p>
    <ul>
      <li><strong>CDC Mental Health Resources</strong> – Access <a href="https://www.cdc.gov/mental-health/caring/index.html#:~:text=Treatment%20and%20support&text=Visit%20findtreatment.gov%20%E2%80%93%20a%20confidential,Code%20to%20435748%20(HELP4U)" target="_blank" rel="noopener">cdc.gov/mental-health</a> for more information.</li>
      <li><strong>Local Services</strong> – Contact your primary care physician or local health department for referrals in your area.</li>
    </ul>
    <p>Your well-being matters to us. Don’t hesitate to reach out if you need assistance.</p>
    <div class="button-area">
      <h5>Please push the button below to submit the study!</h5>
      <b-button variant="primary" name="next" v-on:click="submit">Submit Study</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'DeBriefing',
  methods: {
    submit (event) {
      const body = new FormData()
      body.append('subject_id', this.$store.state.subject_id)
      body.append('status', 'success')
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
.debriefing {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
}
.debriefing h1 {
  text-align: center;
  margin-bottom: 20px;
}
.debriefing p {
  margin-bottom: 16px;
}
.debriefing ul {
  padding-left: 1.2em;
  margin-bottom: 20px;
}
.debriefing li {
  margin-bottom: 8px;
}
.debriefing a {
  color: #1a0dab;
  text-decoration: none;
}
.debriefing a:hover {
  text-decoration: underline;
}
</style>
