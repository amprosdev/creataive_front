import React from 'react';
import {IntlProvider as Provider} from 'react-intl';

import {useMessages} from './useMessages';

export function IntlProvider(props) {
  const {children} = props;
  const {locale, messages} = useMessages();
  return Object.keys(messages).length ? (
    <Provider locale={locale} messages={messages}>
      {children}
    </Provider>
  ) : null;
}

IntlProvider.defaultProps = {
  children: undefined,
};

export default React.memo(IntlProvider);
