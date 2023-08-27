import './index.scss';
import {useEffect, useState} from "react";
import {Button, Tabs} from "antd";
import {getTemplateList, getGraphicList, updatePPTById} from "@/services/ppt";
import {getImageUrl, themeList, loadTheme} from "@/utils/ppt";
import {useParams} from "react-router-dom";

const PPTemplate = ({ content, setTemplate, setSlideGraphic, currentGraphicSlide }) => {
  const [activeKey, setActiveKey] = useState('1');
  const [theme, setTheme] = useState(content.themeId);
  const [templateList, setTemplateList] = useState([]);
  const [graphicsList, setGraphicsList] = useState([]);
  const params = useParams();
  let themeLink = null;

  useEffect(() => {
    if (theme) {
      themeLink = loadTheme(theme);
      updatePPTById({
        id: params.id,
        themeId: theme
      });
    }
    return () => {
      if (themeLink) {
        document.head.removeChild(themeLink);
      }
    }
  }, [theme]);

  useEffect(() => {
    getTemplateList().then(({ data }) => {
      setTemplateList(data.data);
      const currentTemplate = data.data.find(item => item.id == content.templateId)
      setTemplate(currentTemplate);
    });
    getGraphicList().then(({ data }) => {
      setGraphicsList(data.data);
    });
  }, []);
  useEffect(() => {
    if (currentGraphicSlide) {
      setActiveKey('3');
    } else {
      setActiveKey('1');
    }
  }, [currentGraphicSlide]);

  const changeTheme = (newTheme) => {
    // Remove the old CSS file
    if (themeLink) {
      document.head.removeChild(themeLink);
    }

    // Load the new CSS file
    themeLink = loadTheme(newTheme);

    // Update the theme state
    setTheme(newTheme);
  };
  const changeTemplate = (template) => {
    setTemplate(template);
    updatePPTById({
      id: params.id,
      templateId: template.id
    });
  };
  const changeGraphic = (graphic) => {
    setSlideGraphic(graphic);
  }
  const items = [
    {
      key: '1',
      label: `模板`,
      children: <div className="tab-all">
        {
          templateList.map((item, index) => {
            return (
              <div
                className="all-item"
                key={index}
                onClick={() => changeTemplate(item)}
              >
                <img src={getImageUrl(item.image)} alt=""/>
              </div>
            )
          })
        }
      </div>,
    },
    {
      key: '2',
      label: `主题`,
      children: <div className="tab-all">
        {
          themeList.map((theme, index) => {
            return (
              <div
                className="all-item"
                key={index}
                onClick={() => changeTheme(theme)}
              >
                <img src={require(`@/assets/images/ppt/theme/${theme}.png`)} alt=""/>
              </div>
            )
          })
        }
      </div>,
    },
    {
      key: '3',
      label: `布局`,
      children: <div className="tab-all">
        {
          currentGraphicSlide ?
            graphicsList.map((graphic, index) => {
              return (
                <div
                  className="all-item"
                  key={index}
                  onClick={() => changeGraphic(graphic)}
                >
                  <img src={getImageUrl(graphic.image)} alt=""/>
                </div>
              )
            })
            : <div style={{textAlign: 'center', flex: 1}}>抱歉，此页面不支持布局</div>
        }
      </div>,
    },
  ];
  return (
    <div className="ppt-template">
      <Tabs activeKey={activeKey} items={items} onChange={(key) => setActiveKey(key)} />
    </div>
  );
};
export default PPTemplate;
