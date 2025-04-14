import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/axios'
import './plugins/bootstrap-vue'
import VueSimpleAlert from './plugins/vue-simple-alert'
import App from './App.vue'
import router from './router'
import animal from 'vue-animals'
import './assets/style.css'
import Vuex from 'vuex'
import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'
import { useSound } from '@vueuse/sound'
import sound from './assets/alert.mp3'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import specific icons */
import { faCircleCheck, faCircleXmark, faCircle, faSkull, faGavel } from '@fortawesome/free-solid-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import VueTour from 'vue-tour'
import axios from 'axios'

require('vue-tour/dist/vue-tour.css')
Amplify.configure(aws_exports)
Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueSimpleAlert)
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 20,
  newestOnTop: true
})
Vue.use(VueTour)
Vue.component('v-animal', animal)
library.add(faCircleCheck)
library.add(faCircleXmark)
library.add(faCircle)
library.add(faSkull)
library.add(faGavel)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Add global properties
Vue.prototype.$server_url = 'http://go.discussionexperiment.com/ccw/api/'
Vue.prototype.$ws_url = 'ws://go.discussionexperiment.com/ws/chat/'
Vue.prototype.$chat_url = 'ws://go.discussionexperiment.com/ws/chat/'
Vue.prototype.$test_mode = false

const store = new Vuex.Store({
  // plugins: [createPersistedState({
  //   getItem: key => Cookies.get(key),
  //   setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: false }),
  //   removeItem: key => Cookies.remove(key)
  // })],
  state () {
    return {
      subject_id: null,
      avatar_name: null,
      avatar_color: null,
      group_id: -1,
      messages: [],
      preDiscussionResponses: [], // Store pre-discussion responses
      participant_number_condition: -1,
      participant_condition: -1,
      moderator_condition: -1,
      masterStatements: [
        'Abortion should be legal.',
        'Governments should have the authority to censor online content.',
        'The government should employ a stricter immigration/border policy.',
        'Tariffs on imported goods protect American jobs and industries from foreign competition.',
        'The government should cut taxes for the wealthy.',
        'Unpredictability in U.S. foreign policy is an effective deterrent against hostile actions from other nations.',
        'The United States should implement a digital dollar system.',
        'We should use gene editing to make better babies.',
        'The United States should expand the development of nuclear power.',
        'Unions benefit the economy',
        'Automation will crash democracy'
      ], // Store master statements
      heartbeatInterval: null,
      chat_statement_index: null,
      chat_statement: null,
      all_ready: false, // Tracks whether all human members are ready
      lastActivityTimestamp: Date.now(),
      inactivityWarningShown: false,
      inactivityCheckInterval: null,
      random_third_person_prompt: -1,
      is_third_person: false
    }
  },
  mutations: {
    setAllReadyStatus (state, all_ready) {
      state.all_ready = all_ready
    },
    assign_random_third_person_prompt (state, random_third_person_prompt) {
      state.random_third_person_prompt = random_third_person_prompt
    },
    assign_is_third_person (state, is_third_person) {
      state.is_third_person = is_third_person
    },
    // In main.js store configuration
    startHeartbeat (state) {
      if (!state.heartbeatInterval) {
        if (!state.subject_id) return
        state.heartbeatInterval = setInterval(() => {
          axios.post(Vue.prototype.$server_url + 'heartbeat', {
            subject_id: state.subject_id
          }).catch(() => {})
        }, 10000)
      }
    },
    stopHeartbeat (state) {
      if (state.heartbeatInterval) {
        clearInterval(state.heartbeatInterval)
        state.heartbeatInterval = null
      }
    },
    assign_participant_condition (state, participant_condition) {
      state.participant_condition = participant_condition
    },
    assign_moderator_condition (state, moderator_condition) {
      state.moderator_condition = moderator_condition
    },
    setPreDiscussionResponses (state, responses) {
      state.preDiscussionResponses = responses
    },
    assign_subject_id (state, record) {
      state.subject_id = record.subject_id
    },
    assign_condition (state, record) {
      state.condition = record.condition
    },
    assign_group_id (state, record) {
      state.group_id = record.group_id
    },
    new_message (state, message) {
      state.messages.push(message)
    },
    clear_messages (state) {
      state.messages = []
    },
    assign_group_chat_statement_indx (state, index) {
      state.chat_statement_index = index
    },
    assign_group_chat_statement (state, chat_statement_index) {
      state.chat_statement = state.masterStatements[chat_statement_index]
    },
    update_avatar (state, payload) {
      state.avatar_name = payload.avatar_name
      state.avatar_color = payload.avatar_color
    },
    updateLastActivity (state) {
      state.lastActivityTimestamp = Date.now()
      state.inactivityWarningShown = false
    },
    setInactivityWarningShown (state, value) {
      state.inactivityWarningShown = value
    },
    startInactivityCheck (state) {
      if (!state.inactivityCheckInterval) {
        state.inactivityCheckInterval = setInterval(() => {
          try {
            const currentTime = Date.now()
            const timeSinceLastActivity = currentTime - state.lastActivityTimestamp
            // console.log('Time since last activity: ' + timeSinceLastActivity) // Debug log
            // Show warning after 30 seconds of inactivity
            if (timeSinceLastActivity >= 30000 && !state.inactivityWarningShown) {
              // console.log('Showing inactivity warning' + timeSinceLastActivity) // Debug log
              state.inactivityWarningShown = true
              // Emit a custom event that components can listen to
              window.dispatchEvent(new CustomEvent('show-inactivity-warning'))
            }
            // Remove user after 45 seconds of inactivity
            if (timeSinceLastActivity >= 45000) {
              // console.log('Removing inactive user' + timeSinceLastActivity) // Debug log
              window.dispatchEvent(new CustomEvent('remove-inactive-user'))
            }
          } catch (error) {
            console.error('Inactivity check error:', error)
          }
        }, 1000)
      }
    },
    stopInactivityCheck (state) {
      if (state.inactivityCheckInterval) {
        clearInterval(state.inactivityCheckInterval)
        state.inactivityCheckInterval = null
      }
    },
    setThirdPerson (state, is_third_person) {
      state.is_third_person = is_third_person
    }
  },
  actions: {
    updatePreDiscussionResponses ({ commit }, responses) {
      commit('setPreDiscussionResponses', responses)
    },
    initializeHeartbeat ({ commit, state }) {
      if (!state.heartbeatInterval) {
        commit('startHeartbeat')
      }
    },
    terminateHeartbeat ({ commit }) {
      commit('stopHeartbeat')
    },
    recordActivity ({ commit }) {
      commit('updateLastActivity')
    }
  },
  getters: {
    getSelectedStatements: (state) => state.masterStatements,
    getPreDiscussionResponses: (state) => state.preDiscussionResponses
  }
})

// Keep only this part for browser close/refresh warning
window.addEventListener('beforeunload', (event) => {
  event.preventDefault()
  event.returnValue = 'Warning: Leaving this page will invalidate your participation. You will not be compensated if you leave.'
})

new Vue({
  data: function () {
    return {
      // AWS
      server_url: 'https://go.discussionexperiment.com/ccw/api/',
      chat_url: 'wss://go.discussionexperiment.com/ws/chat/',
      test_mode: false,
      estimation: null,
      is_loading: false,
      fire_400: false,
      members: [],
      decisions: [],
      typingUsers: new Set() // Track who is currently typing
    }
  },
  watch: {
    '$store.state.all_ready': function (newVal) {
      if (newVal) {
        this.$router.push('/PostDOSurvey') // Redirect when all are ready
      }
    }
  },
  methods: {
    setup () {
      const alarm_sound = useSound(sound)

      return {
        alarm_sound
      }
    },
    handleInactiveUser () {
      axios.post(Vue.prototype.$server_url + 'terminate_participation', { subject_id: this.$store.state.subject_id })
        .then(response => {
          this.$router.push('/timeout')
        })
        .catch(error => {
          console.error(error)
        })
    }
  },
  store: store,
  router,
  render: h => h(App)
}).$mount('#app')
