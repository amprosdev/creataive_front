import {useCallback, useEffect} from 'react';
import {useImmer} from 'use-immer';
import {locales} from '@/constants';
import store from "store";
import {getBrowserLanguage} from "../../utils/device";

function getInitialState() {
  return {
    locale: store.get('locale'),
    messages: {},
  };
}

export function useMessages() {
  const [state, setState] = useImmer(getInitialState);

  const setMessages = useCallback((messages) => setState((draft) => {
    draft.messages = messages;
  }), [setState]);

  const setLocale = useCallback((locale) => setState((draft) => {
    draft.locale = locale;
  }), [setState]);

  const changeLanguage = useCallback(async (language) => {
    const currentLocale = locales.find(({locale}) => locale === language);
    const messages = (await currentLocale.getMessages()).default;
    setLocale(language);
    setMessages(messages);
    store.set('locale', language);
  }, [setLocale, setMessages]);

  useEffect(() => {
    const lang = store.get('locale') || getBrowserLanguage();
    changeLanguage(lang);
  }, [changeLanguage]);

  function onChangeLangHandler(event) {
    changeLanguage(event.detail.language);
  }

  useEffect(() => {
    // 添加事件监听器
    document.addEventListener('change-language-event', onChangeLangHandler);
    return () => {
      document.removeEventListener('change-language-event', onChangeLangHandler);
    };
  })

  return {
    ...state,
    changeLanguage,
  };
}
