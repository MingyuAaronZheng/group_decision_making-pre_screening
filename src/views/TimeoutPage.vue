<template>
  <div class="timeout-page">
    <h1>Session Expired</h1>
    <p>Due to inactivity, you have been removed from the study.</p>
    <p>Thank you for your participation.</p>
  </div>
</template>

<script>
export default {
  name: 'TimeoutPage'
}
</script>

<style scoped>
.timeout-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
</style>
