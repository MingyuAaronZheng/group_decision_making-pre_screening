<template>
  <b-jumbotron header-level='5'>
    <template v-slot:header>
      Failed attention checks
    </template>
    <template v-slot:lead>
      You did not pass the attention check. We will redirect the page to Prolific in 5 seconds.
    </template>
  </b-jumbotron>
</template>
<script>
export default {
  data: function () {
    return {
      total_bonus: 0.0,
      detail: [],
      fields: [
        {key: 'task', label: 'Task No.'},
        {key: 'user_prediction', label: 'Your prediction'},
        {key: 'ground_truth', label: 'Whether reoffend laws?'},
        {key: 'bonus', label: 'Bonus'}
      ]
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>
