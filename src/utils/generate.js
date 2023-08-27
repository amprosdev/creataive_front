import {EventSourcePolyfill} from 'event-source-polyfill';
import store from 'store';

const createSSE = (url, token, organizationId, callback, final) => {
  const sse = new EventSourcePolyfill(url, {
    headers: {
      Authorization: `${token}`,
      Organization: organizationId
    }
  });

  sse.addEventListener('ping', () => {
    console.log('ping success')
  });

  sse.addEventListener('stop', () => {
    sse.close();
    if (final) {
      final();
    }
  }, false);

  sse.onmessage = function (evt) {
    // rawText += evt.data || '';
    if (callback) {
      callback(evt.data);
    }
  };

  sse.onclose = () => {
    if (final) {
      final();
    }
  };

  sse.onerror = () => {
    sse.close();
    if (final) {
      final();
    }
  };

  return sse;
}

const startConversation = (conversation_id, callback, final) => {
  const host = 'https://api.creataive.net';
  const url = `${host}/api/proxy/ai/v1/conversations/${conversation_id}`;
  const token = store.get('_authing_token');
  const organizationId = store.get('organization');
  return createSSE(url, token, organizationId, callback, final);
}

const generateRecord = (record_id, callback, final) => {
  const host = 'https://api.creataive.net';
  const url = `${host}/api/proxy/ai/v1/records/config/${record_id}`;
  const token = store.get('_authing_token');
  const organizationId = store.get('organization');
  return createSSE(url, token, organizationId, callback, final);
}

export {
  startConversation as chat,
  generateRecord,
};
