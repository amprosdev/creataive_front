import PPTMarkdownEditor from './components/PPTMarkdownEditor';
import PPTPreviewReveal from "./components/PPTPreviewReveal";
import PPTTemplate from "./components/PPTTemplate";
import './index.scss';
import {useEffect, useState} from "react";
import {getPPTById,updatePPTById} from "../../services/ppt";
import {useParams} from "react-router-dom";
import {flattenData, findItem} from "../../utils/ppt";
import PPTHead from "./components/PPTHead";
import {useDebounce, useDebounceFn} from "ahooks";

const PPT = () => {
  const params = useParams();
  const [template, setTemplate] = useState({});
  const [content, setContent] = useState(null);
  const [docContent, setDocContent] = useState(null);
  const [docTree, setDocTree] = useState(null);
  const [currentGraphicSlide, setCurrentGraphicSlide] = useState(null);
  useEffect(() => {
    if (params.id) {
      getPPTById(params.id).then(({data}) => {
        const {docTree, docContent, ...args} = data;
        setContent(args);
        setDocTree(JSON.parse(docTree));
        setDocContent(JSON.parse(docContent))
      });
    }
  }, [params.id]);
  const updatePPT = (params) => {
    updatePPTById(params);
  };
  const {run, cancel, flush} = useDebounceFn(updatePPT, {wait: 500});
  useEffect(() => {
    if (content)
      setSyncData();
  }, [docTree]);

  const setSyncData = () => {
    const {id, speaker, speakerTime, subTitle, title} = content;
    run({
      id,
      speaker,
      speakerTime,
      subTitle,
      title,
      docTree: JSON.stringify(docTree),
      docContent: JSON.stringify(flattenData(docTree)),
    });
  }
  const setCurrentSlideIndex = (index) => {
    const currentSlide = docContent[index - 2];
    if (currentSlide?.children.length > 0) {
      console.log('可布局')
      setCurrentGraphicSlide(currentSlide);
    } else {
      setCurrentGraphicSlide(null);
    }
  };

  const setSlideGraphic = (graphic) => {
    if (currentGraphicSlide) {
      currentGraphicSlide.graphic = graphic
      setDocTree(prevState => {
        const item = findItem(prevState, currentGraphicSlide.id.split('-')[0]);
        item.graphic = graphic.title;
        const newData = prevState.slice();
        setDocContent(flattenData(newData));
        return newData;
      });
    }
  };
  return (
    <>
      <PPTHead/>
      {
        content && <div className="ppt-editor">
          <div className="ppt-left">
            <PPTMarkdownEditor
              content={content}
              docTree={docTree}
              docContent={docContent}
              setDocTree={setDocTree}
              setContent={setContent}
              setSyncData={setSyncData}
              setDocContent={setDocContent}
            />
          </div>
          <div className="ppt-right">
            <PPTPreviewReveal
              content={content}
              docTree={docTree}
              docContent={docContent}
              template={template}
              setCurrentSlideIndex={setCurrentSlideIndex}
            />
            <PPTTemplate
              content={content}
              docTree={docTree}
              docContent={docContent}
              setTemplate={setTemplate}
              currentGraphicSlide={currentGraphicSlide}
              setSlideGraphic={setSlideGraphic}
            />
          </div>
          {/*<PPTPreviewImpress />*/}
        </div>
      }
    </>
  );
};
export default PPT;
