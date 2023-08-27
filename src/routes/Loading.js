import React from 'react';
import {Spin} from "antd";
import {FormattedMessage} from "react-intl";

export default function Loading(props) {
  if (props.isLoading) {
    if (props.timedOut) {
      return <div>Loader timed out!</div>;
    } else if (props.pastDelay) {
      return (
        <Spin tip={<FormattedMessage id="loading.tip"/>} size="large" style={{marginTop: 100}}>
          <div className="content" />
        </Spin>
      )
    } else {
      return null;
    }
  } else if (props.error) {
    console.log('error：',props.error);
    return <div>Error! Component failed to load</div>;
  } else {
    return null;
  }
}
