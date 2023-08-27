import mixpanel from "mixpanel-browser";
const appId = '1a8e052f3a200c160963c7ecfd636aff'

export function init() {
  console.log('mixpanel inited');
  mixpanel.init(appId, {debug: true});
}

export function identify(userId) {
  console.log('mixpanel auth', userId);
  mixpanel.identify(userId);
}

/**
 *   mixpanel.track('Signed Up', {
 *     'Signup Type': 'Referral',
 *   });
 * @param eventName
 * @param data
 */
export function track(eventName, data) {
  console.log('mixpanel event: ', eventName);
  console.log('mixpanel data: ', data);
  mixpanel.track(eventName, data);
}
