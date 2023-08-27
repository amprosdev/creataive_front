import {getImageUrl} from "@/utils/ppt";
import './index.scss';

const PPTBuildSlides = ({ template = {}, content, docTree, docContent }) => {
  const convertDataToSections = (data) => {
    if (!data) return;
    return data.map((item) => (
      <section key={item.id}>
        {
          item.parent === 'root' ?
            <section data-background-image={getImageUrl(template.sessionBg)}>
              <h3>{item.content}</h3>
            </section>
            :
            <section>
              <div className={item.graphic}>
                <h3>{item.content}</h3>
                <ul className="ppt-slide-ul">
                  {
                    item.children.map((item, index) => <li key={'content-' + index}>
                      <span>{item.content}</span>
                    </li>)
                  }
                </ul>
              </div>
            </section>
        }
      </section>
    ));
  };

  const buildContents = (tree) => {
    return (
      <div className="ppt-content">
        <h3>目录</h3>
        <ol>
          {tree.map((item, index) => {
            return <li key={'catalog-' + index}>{item.content}</li>;
          })}
        </ol>
      </div>
    );
  };

  return (
    <div className={"slides " + template.title} >
      <section data-background-image={getImageUrl(template.coverBg)}>
        <div style={{margin: 50}}>
          <h3>{content.title}</h3>
          <h5>{content.subTitle}</h5>
        </div>
        <div>{content.speaker}</div>
        <div style={{fontSize: 32}}>{content.speakerTime}</div>
      </section>
      <section data-background-image={getImageUrl(template.catalogBg)}>
        {buildContents(docTree)}
      </section>
      {convertDataToSections(docContent)}

      <section data-background-image={getImageUrl(template.coverBg)}>
        <div style={{margin: 50}}>
          <div className="ppt-end-text">THE END</div>
          <h3 className="ppt-end-thanks">THANKS</h3>
        </div>
      </section>
    </div>
  );
};

export default PPTBuildSlides;
