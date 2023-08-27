import './index.scss';
import React, {useEffect, useRef, useState} from 'react';
import Reveal from 'reveal.js';
import 'reveal.js/dist/reveal.css';


import {getPPTById} from "@/services/ppt";
import {useParams} from "react-router-dom";
import {getTemplateById} from "../../services/ppt";
import {loadTheme} from "../../utils/ppt";
import PPTBuildSlides from "../../components/common/PPTBuildSlides";

const PPTPreviewReveal = () => {
  const revealRef = useRef();
  const params = useParams();
  const [content, setContent] = useState(null);
  const [template, setTemplate] = useState(null);
  useEffect(() => {
    if (template) {
      Reveal.initialize({
        width: 1280,
        height: 720,
      });
      Reveal.on( 'ready', event => {
        const print = window.location.search.indexOf('print-pdf') > 0;
        if (print) {
          setTimeout(() => {
            // 等待页面资源加载完毕
            window.print();
          }, 2000);
        }
      });
    }
    return () => {
      if (Reveal.destroy) {
        Reveal.destroy();
      }
    }
  }, [template]);

  useEffect(() => {
    if (params.id) {
      getPPTById(params.id).then(({data}) => {
        setContent(data);
        loadTheme(data.themeId);
        getTemplateById(data.templateId).then(({data}) => {
          setTemplate(data);
        });
      });
    }
  }, [params.id]);

  return (
    <>
      {
        template &&
        <div className="ppt-preview">
          <div className="reveal" ref={revealRef}>
            <PPTBuildSlides
              template={template}
              content={content}
              docTree={JSON.parse(content.docTree)}
              docContent={JSON.parse(content.docContent)}
            />
          </div>
        </div>
      }
    </>
  );
};

export default PPTPreviewReveal;
