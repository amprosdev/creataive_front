import {useEffect, useState} from "react";
import {Select} from "antd";
import {FormattedMessage} from "react-intl";

export default function AISettings({ setSettings }) {
  
  const toneOptions = [{
    label: <FormattedMessage id="workspace.settings.tone.formal" />,
    value: 'official',
  }, {
    label: <FormattedMessage id="workspace.settings.tone.poetic" />,
    value: 'art',
  }, {
    label: <FormattedMessage id="workspace.settings.tone.general" />,
    value: 'flat',
  }, {
    label: <FormattedMessage id="workspace.settings.tone.lively" />,
    value: 'lively',
  }, {
    label: <FormattedMessage id="workspace.settings.tone.chill" />,
    value: 'light',
  }]
  const langOptions = [{
    label: '中文',
    value: '中文',
  }, {
    label: 'English',
    value: 'English',
  }, {
    label: 'Japanese',
    value: 'Japanese',
  }, {
    label: 'Korean',
    value: 'Korean',
  }, {
    label: 'Germany',
    value: 'Germany',
  }]
  
  const [lang, setLang] = useState(langOptions[0]);
  const [tone, setTone] = useState(toneOptions[0]);

  const onToneChange = (key) => {
    let toneTarget = toneOptions.find(opt => opt.value === key);
    setTone(toneTarget);
  }
  
  const onLangChange = (key) => {
    let langTarget = langOptions.find(opt => opt.value === key);
    setLang(langTarget);
  }
  
  useEffect(() => {
    setSettings({
      lang: lang.value,
      tone: tone.value,
    })
  }, [tone, lang]);
  
  return (
    <div>
      <div className="ai-function-label">
        <span className="ai-function-label-title">
          <FormattedMessage id="workspace.settings.tone" />
        </span>
      </div>
      <Select
        defaultValue={tone.value}
        style={{
          width: '100%',
        }}
        onChange={onToneChange}
        options={toneOptions}
      />
      <div className="ai-function-label">
        <FormattedMessage id="workspace.settings.language" />
      </div>
      <Select
        defaultValue={lang.value}
        style={{
          width: '100%',
        }}
        onChange={onLangChange}
        options={langOptions}
      />
    </div>
  )
}
