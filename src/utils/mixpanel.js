import Cookies from 'js-cookie'
const mixpanel = require('mixpanel-browser')
const config = require('../../config/resolveConfig')

const { staffEmails: Staff, staffDomains: StaffDomains } = config

mixpanel.init(config.mixpanel.apiKey)

const AppEvents = {
  // General App Events
  VISIT_HOMEPAGE: {
    name: 'Visit Homepage'
  },
  VISIT_DASHBOARD: {
    name: 'Visit Dashboard'
  },
  VISIT_HELP: {
    name: 'Visit Help Center'
  },
  VISIT_CONTACT_US: {
    name: 'Visit Contact Us'
  }
}

const SignUpEvents = {
  // SIGN-UP
  GITHUB: {
    name: 'GitHub Sign-up Clicked'
  },
  GITLAB: {
    name: 'GitLab Sign-up Clicked'
  },
}

const AuthEvents = {
  // LOGIN & AUTH
  LOGIN: {
    name: 'Login Successful'
  },
  LOGIN_GITHUB: {
    name: 'GitHub Login Successful'
  },
  LOGIN_GITLAB: {
    name: 'GitLab Login Successful'
  },
  LOGIN_GITHUB_FAILED: { name: 'GitHub Login Unauthorized' },
  LOGIN_GITLAB_FAILED: { name: 'GitLab Login Unauthorized' },
  LOGOUT: {
    name: 'Logout Successful'
  },
}

const OnboardingEvents = {
  // ONBOARDING
  CONFIRMED: { name: 'Onboarding: Confirmed' },
  CANCELLED: { name: 'Onboarding: Cancelled' },
  SKIP_REPOSITORIES: { name: 'Onboarding: Skipped Add Repositories' },
  BROWSE_REPOSITORIES: { name: 'Onboarding: Browse Repositories' },
  ADD_REPOSITORIES: { name: 'Onboarding: Added Repositories' },
  SKIP_EMAILS: { name: 'Onboarding: Skipped Secondary E-mails' },
  ADD_EMAILS: { name: 'Onboarding: Added Secondary E-mails' },
  START_PROCESSING: { name: 'Onboarding: Started Processing' },
}

const RepositoryEvents = {
  // REPOSITORIES
  BROWSE: { name: 'Browse Repositories' },
  LIST_ALL: { name: 'List Imported Repositories' },
  ADD_REPO: { name: 'Repositories Added' },
  ADD_REPO_FAILURE: { name: 'Repositories Added Failure' },
  DELETE_REPO: { name: 'Repositories Deleted' },
  RUN_ANALYSIS: { name: 'Run Repository Analysis' },
  ANALYSIS_FAILED: { name: 'Analysis Failed' },
  ANALYSIS_RESTARTED: { name: 'Analysis Restarted' },
}

const BadgeEvents = {
  // BADGES
  VIEW_ALL: { name: 'View All Badges' },
  VIEW_BADGE: { name: 'View Badge Assertion' },
  CLICKED_SHARE_DIALOG: { name: 'Share Dialog Opened' },
  SHARE_BADGE: { name: 'Share Badge' },
}

const AccountEvents = {
  // ACCOUNT
  ACCOUNT_SETTINGS_UPDATED: { name: 'Account Settings Updated' },
  ACCOUNT_DELETED: { name: 'Account Deleted' },
}

const NotificationEvents = {
  // NOTIFICATIONS
  CLICKED: { name: 'Notifications Panel Opened' },
  READ_NOTIFICATION: { name: 'Read Notification' },
  READ_ALL: { name: 'Read All Notifications' },
}

const isStaffMember = (email) => {
  return Staff.some((staffEmail) => email === staffEmail)
}

const hasStaffDomain = (email) => {
  return StaffDomains.some((staffDomain) => email.includes(staffDomain))
}

const MP = {
  track: (event, data = {}, options = {}, callback = null) => {
    // Allow tracking Opt-Out via Cookie
    const doNotTrack = Cookies.get('ce-no-track')
    const trackingExpired = doNotTrack ? Date.now() > doNotTrack : false
    if (config.mixpanel.enabled && event && (!doNotTrack || (doNotTrack && trackingExpired))) {
      const distinctId = mixpanel.get_distinct_id()
      if (process.env.NODE_ENV === 'production' && (isStaffMember(distinctId) || hasStaffDomain(distinctId))) {
        // DO NOT TRACK Merico Staff in Production
        // mixpanel.track(event.name, data, options, callback)
      } else {
        mixpanel.track(event.name, data, options, callback)
      }
    }
  },
  identify: (email) => {
    if (config.mixpanel.enabled && email) {
      mixpanel.identify(email)
    }
  },
  profile: (email, displayName, firstName, lastName) => {
    if (config.mixpanel.enabled && email) {
      mixpanel.people.set({
        $email: email,
        $first_name: firstName,
        $last_name: lastName,
        $name: displayName,
        'Display Name': displayName
      })
    }
  },
  // Properties set only ONCE on the User's Profile
  signup_profile: (data = {}) => {
    if (config.mixpanel.enabled && Object.keys(data).length > 0) {
      mixpanel.people.set_once(data)
    }
  },
}

export {
  MP,
  AppEvents,
  SignUpEvents,
  AuthEvents,
  OnboardingEvents,
  RepositoryEvents,
  BadgeEvents,
  AccountEvents,
  NotificationEvents
}
