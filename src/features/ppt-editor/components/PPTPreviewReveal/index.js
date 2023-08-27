import React, {useContext, useEffect, useRef} from 'react';
import Reveal from 'reveal.js';
import FsFx from 'reveal.js-fsfx';
import 'reveal.js/dist/reveal.css';

import {EventContext} from "@/context";
import PPTBuildSlides from "@/components/common/PPTBuildSlides";


import './index.scss';

const PPTPreviewReveal = ({ template = {}, content, docTree, docContent, setCurrentSlideIndex }) => {
  const revealRef = useRef();
  const event = useContext(EventContext);
  useEffect(() => {
    if (revealRef.current) {
      Reveal.initialize({
        width: 1280,
        height: 720,
        // center: false,
        plugins: [
          FsFx,
          // Appearance,
        ],
        appearance: {
          // ...
          autoappear: true,
          autoelements: {
            'ul li': 'animate__fadeInLeft',
            'ol li': 'animate__fadeInRight'
          }
        },
        // embedded: true,
      });
    }
    return () => {
      Reveal.destroy();
    }
  }, [revealRef, template]);
  useEffect(() => {
    Reveal.on( 'slidechanged', event => {
      setCurrentSlideIndex(event.indexh);
    } );
  }, []);
  event.useSubscription(({type, item}) => {
    if (type === 'on-slide-click') {
      const index = docContent.findIndex(slide => slide.id === item.id + '-root');
      Reveal.slide(index + 2); // 补充首页，目录页，还有下标
    }
  });

  return (
    <div className="reveal-wrapper">
      <div className="reveal" ref={revealRef}>
        <PPTBuildSlides template={template} content={content} docTree={docTree} docContent={docContent}/>
      </div>
    </div>
  );
};

export default PPTPreviewReveal;
