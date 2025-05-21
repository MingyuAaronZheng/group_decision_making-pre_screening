<template>
  <b-jumbotron header="Discussion Instructions" header-level="4" class="mb-4">
    <!-- Tutorial video (local .mp4) -->
    <div class="content-area mb-4">
      <video
        ref="tutorialVideo"
        controls
        class="w-100 rounded"
        @ended="onVideoEnded"
      >
        <source src="@/assets/tutorial.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div v-if="!videoEnded" class="text-center mt-2 text-muted">
        Please watch the full tutorial to unlock the Next button.
      </div>
    </div>

    <div class="content-area"><div class="page-indicator text-center mb-1">Page: 5 / 10</div></div>
    <div class="content-area bg-light p-4 rounded">
      <h5 class="mt-3 mb-2">What to Expect</h5>
      <p class="mb-3">
        By using our chat platform, you will participate in a turn-based discussion about a policy that you previously answered in the questionnaire.
        Your randomly paired discussion partner may or may not share the same attitude as you regarding this policy.
        For anonymity, your name in the discussion will be randomly generated as an animal name.
      </p>
      <p class="mb-3">
        <b>AI Chatbot:</b> During the discussion, you may encounter AI chatbot(s) with different roles, such as participating or moderating the discussion.
        The AI chatbot's roles will be indicated by their names.
      </p>

      <h5 class="mt-4 mb-2">Discussion Rules</h5>
      <b-list-group class="mb-3">
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong>Explain Your Position:</strong> Begin by briefly explaining your stance on the policy.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong>Message Length:</strong> Each message must contain at least 10 meaningful words. Filler words (such as "um", "well", "like") and repeated words don't count toward this minimum.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong>Take Turns to Speak:</strong> If you see "<i>[Participant Name, e.g., pink tiger] is typing</i>" on the interface, wait until the indicator disappears before responding.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong>Duration:</strong> After taking four discussion turns, you may continue or proceed to the exit survey.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong>Exit Options:</strong> You may leave anytime without penalty.</b-list-group-item>
        <b-list-group-item class="px-3 py-3 mb-3 bg-white border rounded"><strong style="color: blue;">No Copy-Pasting:</strong> <span style="color: blue;">Copy-pasting is disabled to ensure original opinions.</span></b-list-group-item>
      </b-list-group>
    </div>

    <div class="button-area text-center mt-4">
      <b-button variant="primary" name="next" @click="goToWaitingRoom" :disabled="!videoEnded">Next</b-button>
    </div>

  </b-jumbotron>
</template>

<script>
export default {
  data() {
    return {
      videoEnded: false
    }
  },
  methods: {
    onVideoEnded() {
      this.videoEnded = true;
    },
    goToWaitingRoom () {
      this.$router.push('/WaitingRoom')
    }
  }
}
</script>

<style scoped>
.button-area {
  text-align: center;
  margin-top: 20px;
}
</style>
