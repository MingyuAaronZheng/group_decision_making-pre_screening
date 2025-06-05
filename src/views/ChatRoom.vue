<template>
  <div class="chat-room">
    <div class="page-indicator text-center mb-1">Page: 7 / 10</div>
    <!-- Chat Statement, User's Stance, and User's Name -->
    <div class="statement-area">
      <p class="chat-statement">
        <strong>Discussion Topic:</strong> {{ chat_statement }}
      </p>
      <p class="current-turn">
        <v-animal size="30px" :name="$store.state.avatar_name" :color="$store.state.avatar_color" class="avatar-icon"/>
        <strong>Your Name:</strong> {{ avatar_full_name }}
      </p>
      <p class="user-stance">
        <v-animal size="30px" :name="$store.state.avatar_name" :color="$store.state.avatar_color" class="avatar-icon"/>
        <strong>{{ avatar_full_name }}'s (Your) Stance:</strong> {{ user_stance }}
      </p>
    </div>

    <!-- System Messages Display Area -->
    <div class="d-flex">
      <div class="flex-grow-1">
        <!-- System Messages Display Area and Chat -->
        <div class="room-area" ref="roomarea">
          <!-- System Messages always show at the top, scroll up with chat -->
          <div v-for="(sysMsg, idx) in systemMessages" :key="'sysmsg-' + idx" class="message-card system-message">
            <b-row>
              <b-col cols="12">
                <div class="system-message-content">
                  <span v-html="sysMsg"></span>
                </div>
              </b-col>
            </b-row>
          </div>
          <!-- Chat Messages Display Area -->
          <div v-for="message in messages" :key="message.id" class="message-card">
            <!-- AI Messages -->
            <b-row v-if="message.sender.subject_id < -1">
              <b-col cols="1" class="vertical-align">
                <div class="message-avatar-icon">
                  <!-- Different icons for different AI roles -->
                  <div class="ai-icon-container" :style="{ backgroundColor: getAIColorHex(message.sender.subject_id) }">
                    <img :src="getAIIcon(message.sender.subject_id)" class="circle-icon" style="color: white; width: 30px; height: 30px;"/>
                  </div>
                </div>
              </b-col>
              <b-col cols="9" style="padding-left: 0;">
                <b-row>
                  <b-col class="message-avatar-name">{{ getAIName(message.sender.subject_id) }}</b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="message-content">
                      <span>{{ message.content }}</span>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <!-- Other Users' Messages -->
            <b-row v-else-if="message.sender.subject_id !== $store.state.subject_id">
              <b-col cols="1" class="vertical-align">
                <div class="message-avatar-icon">
                  <v-animal size="30px" :name="message.sender.avatar_name"
                            :color="message.sender.avatar_color"
                            class="avatar-icon"/>
                </div>
              </b-col>
              <b-col cols="9" style="padding-left: 0;">
                <b-row>
                  <b-col class="message-avatar-name" :style="{ color: message.sender.avatar_color }">{{message.sender.avatar_color }} {{ message.sender.avatar_name }}</b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <div class="message-content">
                      <span>{{ message.content }}</span>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>

            <!-- Current User's Messages -->
            <b-row v-else class="own_message">
              <b-col cols="2"/>
              <b-col cols="9" style="padding-right: 15px;">
                <b-row style="margin-right: 0;" class="justify-content-end">
                  <b-col class="current-user-avatar-name text-end" style="text-align: right; width: 100%;" >{{ avatar_full_name }} (You)</b-col>
                </b-row>
                <b-row style="margin-left: 0;">
                  <b-col>
                    <div class="message-content">
                      <span>{{ message.content }}</span>
                    </div>
                  </b-col>
                </b-row>
              </b-col>
              <b-col cols="1" class="vertical-align" style="text-align: left; padding-right: 0; padding-left: 10px;">
                <div class="message-avatar-icon">
                  <v-animal size="30px" :name="$store.state.avatar_name"
                            :color="$store.state.avatar_color"
                            class="avatar-icon"/>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
      </div>
    </div>

    <!-- Typing Notifications -->
    <div v-if="typingNotification" class="typing-notifications">
      <p class="typing-indicator">
        <span :style="{ color: avatarColorHex(typingNotification.avatar_color) }">
          {{ typingNotification.avatar_color }} {{ typingNotification.avatar_name }}
        </span> is typing...
      </p>
      <p v-if="isAITyping" class="typing-disabled-note">
        Send button is disabled while AI is typing.
      </p>
    </div>

    <!-- Chat Input Area -->
    <div class="message-area">
      <b-input-group>
        <b-form-textarea
          placeholder="Type a message..."
          v-model="send_out_message"
          class="message-input-area"
          rows="1"
          max-rows="5"
          resize="none"
          @keydown.enter.native.exact.prevent="sendMessage"
          @paste="handlePaste"
          @copy="handleCopy"
          @cut="handleCut"
          :disabled="isAITyping"
        />
        <b-button
          variant='success'
          class="message-send-button"
          v-on:click="sendMessage"
          :disabled="isAITyping"
        >
          Send
        </b-button>
      </b-input-group>
    </div>

    <!-- Ready to End Button and Status -->
    <div v-if="canExit" class="ready-to-end-area d-flex justify-content-center my-4" style="padding: 0;">
      <div class="button-container d-flex justify-content-center">
        <b-button
          @click="handleReadyToEnd"
          :variant="isReadyToEnd ? 'success' : 'warning'"
          class="exit-button"
          :disabled="isReadyToEnd"
        >
          {{ isReadyToEnd ? 'You indicated you are ready to end the discussion. We are waiting for other participants to do the same.' : 'When you are ready to end the discussion, click this button' }}
        </b-button>
      </div>
    </div>

    <!-- System Prompt Panel (now fully separate) -->
    <div v-if="$store.state.test === 'Y'" class="system-panel-container mt-4">
      <div class="card shadow-sm" style="max-width:800px; margin:0 auto;">
        <div class="card-header bg-light">
          <h6 class="mb-0">System Prompt Controls</h6>
        </div>
        <div class="card-body">
          <div class="current-system-message mb-3">
            <label class="small text-muted mb-1">Current Prompt:</label>
            <div class="border p-2 bg-light rounded" style="min-height:100px; white-space:pre-wrap; font-size:0.9rem;">
              {{ currentSystemMessage || "No system prompt set" }}
            </div>
            <div class="d-flex justify-content-between mt-2">
              <b-button size="sm" variant="outline-secondary" @click="refreshSystemMessage">
                <i class="fas fa-sync-alt mr-1"></i> Refresh
              </b-button>
              <b-button size="sm" variant="outline-primary" @click="copySystemMessage">
                <i class="fas fa-copy mr-1"></i> Copy
              </b-button>
            </div>
          </div>
          <div class="system-editor">
            <label class="small text-muted mb-1">Edit Prompt:</label>
            <textarea
              v-model="editedSystemMessage"
              rows="5"
              class="form-control mb-2"
              placeholder="Enter custom system message..."
            ></textarea>
            <b-button size="sm" variant="primary" class="w-100" @click="saveSystemMessage">
              <i class="fas fa-save mr-1"></i> Save Changes
            </b-button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import { colors } from '@/components/constants'
import axios from 'axios'
import { notifyInactivity } from '@/plugins/notificationService.js'

const CUSTOM_FILLER_WORDS = new Set([
  'um', 'uh', 'er', 'ah', 'like', 'okay', 'right', 'you know', 'i mean',
  'well', 'so', 'anyway', 'basically', 'actually', 'literally', 'just'
])

export default {
  data () {
    return {
      send_out_message: '',
      typingTimeout: null,
      isReadyToEnd: false,
      typingNotification: null,
      typingNotificationTimeout: null,
      systemMessages: [], // system messages like "joined" with agreement
      memberAgreements: [], // raw API data
      currentSystemMessage: '',
      editedSystemMessage: '',
      memberLeftToastId: null
    }
  },
  computed: {
    avatar_full_name () {
      return this.$store.state.avatar_color + ' ' + this.$store.state.avatar_name
    },
    avatar_part_name () {
      return this.$store.state.avatar_name
    },
    chat_statement () {
      return this.$store.state.chat_statement || 'No discussion topic available'
    },
    user_stance () {
      const masterStatements = this.$store.state.masterStatements || []
      const chatStatement = this.$store.state.chat_statement

      const statementIndex = masterStatements.indexOf(chatStatement)
      if (statementIndex === -1) return 'No stance recorded'

      // Find this statement in the user's selected statements
      const userStatementIndex = masterStatements.indexOf(chatStatement)
      if (userStatementIndex === -1) return 'No stance recorded'

      // Get the user's response for this statement
      const response = this.$store.state.preDiscussionResponses[userStatementIndex]
      if (!response) return 'No stance recorded'

      // Convert agreement value to corresponding text from the scale
      const agreementScale = [
        {text: 'Strongly disagree', value: -3},
        {text: 'Disagree', value: -2},
        {text: 'Somewhat disagree', value: -1},
        {text: 'Neutral', value: 0},
        {text: 'Somewhat agree', value: 1},
        {text: 'Agree', value: 2},
        {text: 'Strongly agree', value: 3}
      ]

      const scaleItem = agreementScale.find(item => item.value === response.agreement)
      return scaleItem ? scaleItem.text : 'No stance recorded'
    },
    messages () {
      return this.$store.state.messages
    },
    typingNotifications () {
      // Filter out current user from typing notifications
      return Array.from(this.$root.typingUsers)
        .filter(user => user.subject_id !== this.$store.state.subject_id)
    },
    // ***** TODO: Currently, can exit only when it is the 5th turn (i.e., one person sends a message after finishing 4th turn),
    //        but it should be after 4th turn and before 5th turn (i.e., no one needs to send a message for the 5th turn)
    canExit () {
      return this.$store.state.current_turn > this.$store.state.conversation_exit_turn_number
    },
    // readyMembers () {
    //   return this.$root.members.filter(m => m.is_ready_to_end && m.subject_id > 0)
    // },
    // humanMemberCount () {
    //   return this.$root.members.filter(m => m.subject_id > 0).length
    // },
    isAITyping () {
      return this.typingNotification && this.typingNotification.subject_id < 0
    }
  },
  methods: {
    proceedToNextSurvey (toastId) {
      // Hide the notification
      if (toastId) {
        this.$bvToast.hide(toastId)
      } else if (this.memberLeftToastId) {
        this.$bvToast.hide(this.memberLeftToastId)
      }
      // Navigate to the next survey
      this.$router.push('/PostDOSurvey')
    },
    bumpActivityOnClick () {
      this.$store.commit('updateLastActivity')
    },
    avatarColorHex (avatar_color) {
      return colors[avatar_color] || avatar_color || '#000000'
    },
    getAIColorHex (subjectId) {
      switch (subjectId) {
        case -2: return '#2196F3' // Blue for moderator
        case -3: return '#4CAF50' // Green for participant
        case -4: return '#4CAF50' // Green for dispute
        default: return '#9E9E9E' // Grey for default
      }
    },
    getAIIcon (subjectId) {
      switch (subjectId) {
        case -2: return require('@/assets/AI_moderator.png') // AI Moderator
        case -3: return require('@/assets/AI_participant.jpg') // Advocating AI
        case -4: return require('@/assets/AI_participant.jpg') // Disputing AI
        default: return ['fas', 'robot']
      }
    },
    getAIName (subjectId) {
      switch (subjectId) {
        case -2: return 'AI Moderator'
        case -3: return 'AI Participant'
        case -4: return 'AI Participant'
        default: return 'AI'
      }
    },
    getAvatarName (subjectId) {
      // Find the member with matching subject_id in the root members list
      const member = this.$root.members.find(m => m.subject_id === parseInt(subjectId))
      if (member) {
        return member.avatar_name
      }
      // Fallback to the message's avatar name if member not found
      const message = this.messages.find(m => m.sender.subject_id === subjectId)
      return message ? message.sender.avatar_name : 'Unknown'
    },
    getAvatarColor (subjectId) {
      // Find the member with matching subject_id in the root members list
      const member = this.$root.members.find(m => m.subject_id === parseInt(subjectId))
      if (member) {
        return member.avatar_color
      }
      // Fallback to the message's avatar color if member not found
      const message = this.messages.find(m => m.sender.subject_id === subjectId)
      return message ? message.sender.avatar_color : 'blue'
    },
    updateChatStatus () {
      const formData = new FormData()
      formData.append('group_id', this.$store.state.group_id)
      formData.append('chatting', true)
      axios.post(this.$server_url + 'update_chat_status', formData)
        .then(response => {
          console.log('Chat status updated:', response.data)
        })
        .catch(error => {
          console.error('Error updating chat status:', error)
        })
    },
    deactivateChatStatus () {
      const formData = new FormData()
      formData.append('group_id', this.$store.state.group_id)
      formData.append('chatting', false)
      axios.post(this.$server_url + 'update_chat_status', formData)
        .then(response => {
          console.log('Chat status deactivated:', response.data)
        })
        .catch(error => {
          console.error('Error deactivating chat status:', error)
        })
    },
    countMeaningfulWords (message) {
      const words = message.toLowerCase().trim().split(/\s+/)
      // Remove custom filler words
      const filtered = words.filter(word => !CUSTOM_FILLER_WORDS.has(word))
      // Count only unique words
      const uniqueWords = new Set(filtered)
      return uniqueWords.size
    },
    sendMessage () {
      this.$store.dispatch('recordActivity')
      // Also bump activity on send
      this.$store.commit('updateLastActivity')
      const trimmedMessage = this.send_out_message.trim()
      // console.log('Trimmed message:', trimmedMessage)

      if (trimmedMessage !== '') {
        const meaningfulWordCount = this.countMeaningfulWords(trimmedMessage)
        // console.log('Meaningful word count:', meaningfulWordCount)
        // Set required meaningful word count based on test state
        const requiredMeaningfulWords = this.$store.state.test === 'Y' ? 3 : 10
        if (meaningfulWordCount < requiredMeaningfulWords) {
          // Show error message
          this.$bvToast.toast(
            `Your message must contain at least ${requiredMeaningfulWords} meaningful words. Filler words don't count. (Currently: ${meaningfulWordCount})`,
            {
              title: 'Message Too Short',
              variant: 'warning',
              solid: true
            }
          )
          return
        }

        let send_chat_message = {
          'code': 200,
          'data': {
            'subject_id': this.$store.state.subject_id,
            'group_id': this.$store.state.group_id,
            'msg': this.send_out_message
          }
        }
        this.$root.sendWebSocketMessage(send_chat_message)
        this.send_out_message = ''
      }
    },
    notifyTyping (isTyping) {
      const data = {
        code: 202,
        data: {
          event: isTyping ? 'user_typing' : 'user_stopped_typing',
          subject_id: this.$store.state.subject_id,
          group_id: this.$store.state.group_id,
          avatar_name: this.$store.state.avatar_name,
          avatar_color: this.$store.state.avatar_color
        }
      }

      this.$root.sendWebSocketMessage(data)
    },
    handleReadyToEnd () {
      this.isReadyToEnd = true
      let ready_message = {
        'code': 902, // code for ready to end
        'data': {
          'subject_id': this.$store.state.subject_id,
          'group_id': this.$store.state.group_id
        }
      }
      this.$root.sendWebSocketMessage(ready_message)
    },
    showInactivityWarning () {
      if (this.$store.state.test === 'N') {
        notifyInactivity(this.$bvToast, this.$store.state.test)
      }
    },
    handleInactiveUser () {
      // Send websocket message to notify server
      let inactive_message = {
        'code': 131, // new code for inactivity
        'data': {
          'subject_id': this.$store.state.subject_id,
          'group_id': this.$store.state.group_id
        }
      }
      this.$root.sendWebSocketMessage(inactive_message)
      // Redirect to a timeout page
      this.$router.push('/InactivityTerminatedParticipation')
    },
    handleTyping (user) {
      // Store the typing user
      this.typingNotification = user

      // Clear any existing timeout
      if (this.typingNotificationTimeout) {
        clearTimeout(this.typingNotificationTimeout)
      }

      // Set a timeout to clear the notification
      this.typingNotificationTimeout = setTimeout(() => {
        this.typingNotification = null
      }, 3000) // Show typing indicator for 3 seconds
    },
    handlePaste (e) {
      if (this.$store.state.test !== 'Y') {
        e.preventDefault()
      }
    },
    handleCopy (e) {
      if (this.$store.state.test !== 'Y') {
        e.preventDefault()
      }
    },
    handleCut (e) {
      if (this.$store.state.test !== 'Y') {
        e.preventDefault()
      }
    },
    saveSystemMessage () {
      axios.post(`${this.$server_url}update_system_message`, {
        group_id: this.$store.state.group_id,
        system_message: this.editedSystemMessage
      })
        .then(() => {
          this.$bvToast.toast('System prompt saved', 'Saved', {variant: 'success'})
          this.currentSystemMessage = this.editedSystemMessage
        })
        .catch(err => { console.error('save prompt', err); this.$bvToast.toast('Failed to save prompt', 'Error', {variant: 'danger'}) })
    },
    refreshSystemMessage () {
      axios.get(`${this.$server_url}get_system_message`, { params: { group_id: this.$store.state.group_id } })
        .then(res => {
          this.currentSystemMessage = res.data.system_message
          this.$bvToast.toast('Prompt refreshed', {variant: 'success'})
        })
        .catch(e => {
          console.error('refresh prompt', e)
          this.$bvToast.toast('Refresh failed', {variant: 'danger'})
        })
    },
    copySystemMessage () {
      if (!this.currentSystemMessage) return
      navigator.clipboard.writeText(this.currentSystemMessage)
        .then(() => this.$bvToast.toast('Copied to clipboard', {variant: 'success'}))
        .catch(err => {
          console.error('Copy failed:', err)
          this.$bvToast.toast('Copy failed', {variant: 'danger'})
        })
    },
    showMemberLeftNotification (message = 'A group member has left the chat') {
      console.log('Showing member left notification with message:', message)
      // Create a unique ID for this toast
      const toastId = `member-left-${Date.now()}`

      // Hide any existing member left toasts
      if (this.memberLeftToastId) {
        this.$bvToast.hide(this.memberLeftToastId)
      }
      this.memberLeftToastId = toastId

      // Show a toast notification with a button to proceed to the next survey
      this.$nextTick(() => {
        this.$bvToast.toast(
          [
            message,
            this.$createElement('div', { class: 'mt-2' }, [
              this.$createElement('b-button', {
                props: { variant: 'primary', size: 'sm' },
                on: { click: () => this.proceedToNextSurvey(toastId) }
              }, 'Proceed to Next Survey')
            ])
          ],
          {
            id: toastId,
            title: 'Member Left',
            variant: 'warning',
            solid: true,
            noAutoHide: true,
            noCloseButton: true,
            noHoverPause: true
          }
        )
        console.log('Notification should be visible now')
      })

      return toastId
    }
  },
  watch: {
    '$store.state.memberLeftChat': {
      handler (newVal) {
        // Skip if this is a reset or if there's no message
        if (newVal && newVal.message && !newVal.reset) {
          console.log('Store state changed - member left chat detected')
          this.showMemberLeftNotification(newVal.message)
        }
      },
      immediate: true,
      deep: true
    },
    messages: {
      handler () {
        this.$nextTick(() => {
          const el = this.$refs.roomarea
          if (el) {
            el.scrollTop = el.scrollHeight
          }
        })
      },
      deep: true
    },
    canExit: {
      handler (newVal) {
        if (newVal) {
          this.$nextTick(() => {
            const el = this.$refs.roomarea
            if (el) {
              const buttonContainer = document.querySelector('.ready-to-end-area')
              const buttonHeight = buttonContainer?.offsetHeight || 0
              const buttonMargin = 24 // From my-4
              const messageAreaPadding = 0 // From .message-area
              const totalScroll = buttonHeight + buttonMargin + messageAreaPadding
              el.style.scrollBehavior = 'smooth'
              el.scrollTop += totalScroll
              setTimeout(() => {
                el.style.scrollBehavior = 'auto'
              }, 500)
            }
          })
        }
      },
      immediate: true
    },
    send_out_message (newMessage) {
      // Bump activity on typing
      this.$store.commit('updateLastActivity')
      // Clear any existing timeout
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }

      if (newMessage.trim() !== '') {
        // Send typing notification
        this.notifyTyping(true)
        // Set timeout to clear typing status after 1 second of no changes
        this.typingTimeout = setTimeout(() => {
          this.notifyTyping(false)
        }, 1000)
      } else {
        // If message is empty, immediately send stopped typing
        this.notifyTyping(false)
      }
    }
  },
  mounted () {
    // Scroll to top when component is mounted
    window.scrollTo(0, 0)

    // Reset the member left state when component mounts
    this.$store.commit('setMemberLeftChat', {
      message: '',
      reset: true // Add a flag to indicate this is a reset
    })

    // Ensure WebSocket is initialized
    if (!this.$root.websock || this.$root.websock.readyState !== WebSocket.OPEN) {
      this.$root.initWebSocket()
    }

    // Listen for inactivity events
    window.addEventListener('show-inactivity-warning', this.showInactivityWarning)
    window.addEventListener('remove-inactive-user', this.handleInactiveUser)

    // Bump activity on any click in the chat room
    this.$el.addEventListener('click', this.bumpActivityOnClick)

    // Fetch group member agreements and generate system messages
    const groupId = this.$store.state.group_id
    const formData = new FormData()
    formData.append('group_id', groupId)
    axios.post(`${this.$server_url}get_group_member_agreements`, formData)
      .then(response => {
        console.log('Group member agreements response:', response.data)
        if (response.data && response.data.members) {
          // Initialize root members list for message processing
          this.$root.members = response.data.members.map(member => ({
            subject_id: member.subject_id,
            avatar_name: member.avatar_name,
            avatar_color: member.avatar_color,
            is_ready_to_end: false
          }))
          this.memberAgreements = response.data.members
          // Build system messages for each member
          const messages = response.data.members
            .filter(member => member.avatar_name !== this.$store.state.avatar_name || member.avatar_color !== this.$store.state.avatar_color)
            .map(member => {
              let agreementText = 'No response'
              if (member.agreement_level !== null && member.agreement_level !== undefined) {
                const scale = [
                  {text: 'Strongly disagree', value: -3},
                  {text: 'Disagree', value: -2},
                  {text: 'Somewhat disagree', value: -1},
                  {text: 'Neutral', value: 0},
                  {text: 'Somewhat agree', value: 1},
                  {text: 'Agree', value: 2},
                  {text: 'Strongly agree', value: 3}
                ]
                const found = scale.find(item => item.value === member.agreement_level)
                agreementText = found ? found.text : member.agreement_level
              }
              const styledName = `<span>${member.avatar_color} ${member.avatar_name}</span>`
              return `${styledName}'s Stance: "${agreementText}"`
            })
          const header = messages.length === 1 ? 'Your discussion partner:' : 'Your discussion partners:'
          this.systemMessages = messages.length > 0
            ? [header, ...messages]
            : []
        }
      }).catch(error => {
        console.error('Error loading group member agreements:', error)
        this.systemMessages = ['Failed to load group member agreements.' + error]
      })

    // Load saved system prompt
    axios.get(`${this.$server_url}get_system_message`, { params: { group_id: this.$store.state.group_id } })
      .then(res => { this.currentSystemMessage = res.data.system_message })
      .catch(e => { console.error('load prompt', e) })

    // Listen for typing events
    window.addEventListener('user-typing', (event) => this.handleTyping(event.detail))
    window.addEventListener('user-stopped-typing', () => { this.typingNotification = null })

    // Existing mounted code...
    this.updateChatStatus()
    this.$store.commit('startInactivityCheck')
  },
  beforeDestroy () {
    if (this.$toast) {
      this.$toast.clear()
    }
    // Dismiss ready-to-end-warning toast if present
    if (this.$toast && typeof this.$toast.dismiss === 'function') {
      this.$toast.dismiss('ready-to-end-warning')
    }
    // Clean up event listeners
    window.removeEventListener('show-inactivity-warning', this.showInactivityWarning)
    window.removeEventListener('remove-inactive-user', this.handleInactiveUser)
    window.removeEventListener('user-typing', (event) => this.handleTyping(event.detail))
    window.removeEventListener('user-stopped-typing', () => { this.typingNotification = null })
    if (this.$el) {
      this.$el.removeEventListener('click', this.bumpActivityOnClick)
    }
    // Clear any existing timeouts
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }

    if (this.typingNotificationTimeout) {
      clearTimeout(this.typingNotificationTimeout)
    }

    // Deactivate chat status
    this.deactivateChatStatus()
    // Optionally, send a WebSocket message to inform the server
    let leave_room = {
      'code': 130,
      'data': this.$store.state.subject_id
    }
    this.$root.sendWebSocketMessage(leave_room)
    // TODO There is currently no handling for code 130 in consumers.py
    // Clean up listeners and intervals
    this.$store.commit('stopInactivityCheck')
  }
}
</script>

<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  background: #f5f7fa;
}

.statement-area {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
  width: 100%;
}

.chat-statement, .user-stance {
  margin: 0;
  padding: 8px 0;
  color: #2c3e50;
}

.room-area {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  margin-bottom: 20px;
}

.message-card {
  margin-bottom: 16px;
  animation: fadeIn 0.3s ease;
}

.system-message-content {
  text-align: center;
  color: #6c757d;
  font-size: 1.05rem;
  font-style: italic;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  max-width: 80%;
  word-wrap: break-word;
}

.own_message .message-content {
  background: #007bff;
  color: white;
  margin-left: auto;
}

.message-avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e9ecef;
}

.typing-notifications {
  margin: 8px 0;
}

.typing-indicator {
  display: flex;
  align-items: center;
  color: #6c757d;
  font-size: 0.9em;
}

.typing-indicator::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 50%;
  background: #007bff;
  animation: typing 1s infinite;
}

@keyframes typing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.message-area {
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
}

.message-input-area {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  margin-right: 8px;
}

.message-send-button {
    border-radius: 8px;
    padding: 12px 24px;
    background-color: #0342a1 !important;
    border-color: #0342a1 !important;
}

.exit-button {
  position: static;
  box-shadow: none;
}

.ready-status {
  position: static;
  background-color: transparent;
  border: none;
  padding: 0;
}

.ready-to-end-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  margin: 2;
  background: transparent;
  border: none;
  box-shadow: none;
}

.avatar-icon {
  display:inline-block !important;
  color: inherit !important;
}

.avatar-icon svg {
  fill: currentColor !important;
}

.avatar-icon path {
  fill: currentColor !important;
}

.ready-instructions {
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.instruction-text {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0;
  font-style: italic;
}

.button-container {
  text-align: right;
}

.current-user-avatar-name {
  text-align: right;
  width: 100%;
}

@media (max-width: 768px) {
  .chat-room {
    padding: 10px;
  }

  .message-content {
    max-width: 90%;
  }
}

.system-panel-container {
  margin-top: 20px;
}
</style>
