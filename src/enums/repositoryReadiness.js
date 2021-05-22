export const Readiness = {
  UNDERWAY: 'UNDERWAY',
  UNKNOWN: 'UNKNOWN',
  NOT_INIT: 'NOT_INIT',
  WAITING: 'WAITING',
  AUTH_REQUIRE: 'AUTH_REQUIRE',
  NOT_REPO: 'NOT_REPO',
  PRE_UNDERWAY: 'PRE_UNDERWAY',
  PRE_READY: 'PRE_READY',
  READY: 'READY',
  FAILURE: 'FAILURE',
  PULLING: 'PULLING',
  UNSUPPORTED: 'UNSUPPORTED',
}

export const ReadinessStatusReverseMap = {
  initializing: [
    Readiness.NOT_INIT,
    Readiness.WAITING,
    Readiness.AUTH_REQUIRE,
    Readiness.PRE_UNDERWAY,
    Readiness.PRE_READY
  ],
  ongoing: [
    Readiness.UNDERWAY,
    Readiness.PULLING
  ],
  done: [
    Readiness.READY
  ],
  failed: [
    Readiness.FAILURE,
  ],
  abnormal: [
    Readiness.UNKNOWN,
    Readiness.NOT_REPO,
    Readiness.UNSUPPORTED
  ]
}

export const readinessStatusMap = new Map([
  [Readiness.NOT_INIT, 'initializing'],
  [Readiness.WAITING, 'initializing'],
  [Readiness.AUTH_REQUIRE, 'initializing'],
  [Readiness.PRE_UNDERWAY, 'initializing'],
  [Readiness.PRE_READY, 'initializing'],
  [Readiness.UNDERWAY, 'ongoing'],
  [Readiness.READY, 'processed'],
  [Readiness.PULLING, 'ongoing'],
  [Readiness.UNKNOWN, 'abnormal'],
  [Readiness.FAILURE, 'abnormal'],
  [Readiness.NOT_REPO, 'abnormal'],
  [Readiness.UNSUPPORTED, 'abnormal'],
])
