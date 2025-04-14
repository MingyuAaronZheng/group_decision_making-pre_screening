import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSimpleAlert from 'vue-simple-alert'
/** Qualifications **/
import QualificationEntrance from '../views/QualificationEntrance.vue'
/** Common pages **/
/** Common pages - Instructions**/
/** Common pages - Exit pages**/

/** Errors **/
import TerminatedParticipation from '@/views/errors/TerminatedParticipation.vue'
/** Without AI **/
import PreDSurveySuccess from '@/views/PreDSurveySuccess.vue'
import PreDSurvey from '@/views/PreDSurvey.vue'
import TimeoutPage from '@/views/TimeoutPage.vue'

Vue.use(VueRouter)
Vue.use(VueSimpleAlert)

// Define the correct order of pages
const pageOrder = [
  'QualificationEntrance',
  'DemograSurvey',
  'PreDSurvey',
  'PreDSurveySuccess',
  'DiscussionInstructions',
  'ChatRoom',
  'PostDOSurvey',
  'PostDFSurvey',
  'Debriefing'
]

const routes = [
  {
    path: '/',
    redirect: '/QualificationEntrance'
  },
  {
    path: '/QualificationEntrance',
    name: 'QualificationEntrance',
    component: QualificationEntrance
  },
  {
    path: '/PreDSurvey',
    name: 'PreDSurvey',
    component: PreDSurvey
  },
  {
    path: '/PreDSurveySuccess',
    name: 'PreDSurveySuccess',
    component: PreDSurveySuccess
  },
  {
    path: '/timeout',
    name: 'Timeout',
    component: TimeoutPage
  },
  {
    path: '/terminatedParticipation',
    name: 'TerminatedParticipation',
    component: TerminatedParticipation
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // Get indices of current and target pages in the pageOrder array
  let fromIndex
  let toIndex

  // Define EndingPages as an array of pages that are not part of the study flow
  const EndingPages = ['KickOut', 'FailPairing', 'FailAttention', 'NoEntrance', 'TerminatedParticipation']
  // If the page is an ending page, set the index to 1000
  if (EndingPages.includes(from.name)) {
    fromIndex = 1000
  } else {
    fromIndex = pageOrder.indexOf(from.name)
  }

  if (EndingPages.includes(to.name)) {
    toIndex = 1000
  } else {
    toIndex = pageOrder.indexOf(to.name)
  }
  // Check if trying to go backwards in the study flow
  if (fromIndex !== -1 && toIndex !== -1 && toIndex < fromIndex) {
    VueSimpleAlert.confirm(
      'Warning: Going back will invalidate your participation.',
      'You will not be compensated if you leave. Do you really want to go back?',
      'warning'
    ).then((result) => {
      if (result) {
        next('/terminatedParticipation')
      } else {
        next(false)
      }
    }).catch(() => {
      next(false)
    })
  } else {
    next()
  }
})

export default router
