import {useEffect, useRef} from "react";
import './index.css';
const PPTPreviewImpress = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            window.impress().init();
        }
    }, [containerRef]);
    const jsonData = {
        "slides": [
            {
                "title": "Slide 1",
                "content": "This is the content of Slide 1."
            },
            {
                "title": "Slide 2",
                "content": "This is the content of Slide 2."
            },
            // 添加更多幻灯片数据
        ]
    };
    return (
        // <div id="impress" ref={containerRef}>
        //     {jsonData.slides.map((slide, index) => (
        //         <div
        //             key={index}
        //             className="step"
        //             data-x="0"
        //             data-y="0"
        //         >
        //             <h1>{slide.title}</h1>
        //             <p>{slide.content}</p>
        //         </div>
        //     ))}
        // </div>
        <>
            <div id="impress" data-transition-duration="1000">

                <div className="step" data-scale="2" data-x="-500" data-y="-500">
                    <h1>2D navigation</h1>

                    <ul>
                        <li>Impress.js allows you to layout your presentation in a 3D space</li>
                        <li>Now <a href="https://github.com/impress/impress.js/tree/master/src/plugins/goto">the
                            goto plugin</a> also allows you to specify
                            non-linear navigation!
                        </li>
                        <li>This demo can be navigated by
                            <ul>
                                <li>continuously pressing Right Arrow</li>
                                <li>continuously pressing Down Arrow</li>
                                <li>(or freely, pressing Up, Down, Right, Left as you choose)</li>
                            </ul>
                        </li>
                        <li>It's up to you to decide which is the better structure</li>
                    </ul>
                </div>

                <div id="contents" className="step" data-rel-x="1500" data-rel-y="1500" data-scale="1">
                    <h1>Choosing a treat</h1>

                    <ul>
                        <li>You can choose your preferred treat from:
                            <ul>
                                <li>Ice cream</li>
                                <li>Crisps</li>
                                <li>Apple pie</li>
                            </ul>
                        </li>
                        <li>We will make a structured pro's &amp; con's analysis to arrive at a conclusion</li>
                    </ul>
                </div>

                <div id="icecream" className="step" data-x="2000" data-y="2000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="contents icecream-pro contents crisps">
                    <h1>Ice cream</h1>

                    <ul>
                        <li>Cold</li>
                        <li>Creamy</li>
                        <li>Vanilla or flavored</li>
                        <li>Caramel sauce, jams &amp; other toppings</li>
                    </ul>
                </div>

                <div id="icecream-pro" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="icecream icecream-con applepie crisps-pro">
                    <h1>Ice cream: Pro's</h1>

                    <ul>
                        <li>Great for dessert or snack</li>
                        <li>Great in the Summer</li>
                    </ul>
                </div>


                <div id="icecream-con" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="icecream-pro crisps applepie-pro crisps-con">
                    <h1>Ice cream: Con's</h1>

                    <ul>
                        <li>Not so great in the Winter</li>
                        <li>If you're allergic to lactose/milk</li>
                        <li>Diet alternatives are not real ice cream</li>
                    </ul>
                </div>


                <div id="crisps" className="step" data-x="3500" data-y="2000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="icecream-con crisps-pro icecream applepie">
                    <h1>Crisps</h1>

                    <ul>
                        <li>Potatoes fried in oil and salted</li>
                        <li>Various flavors</li>
                        <li>Dips</li>
                        <li>Can be used as ingredient in subs (Cliff Huxtable style)</li>
                    </ul>
                </div>

                <div id="crisps-pro" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="crisps crisps-con icecream-pro applepie-pro">
                    <h1>Crisps: Pro's</h1>

                    <ul>
                        <li>Simple yet tasty concept</li>
                        <li>Great for snack</li>
                        <li>Salty / spicy (not sweet)</li>
                        <li>Finger food</li>
                        <li>Diet alternatives are often ok</li>
                    </ul>
                </div>


                <div id="crisps-con" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="crisps-pro applepie icecream-con applepie-con">
                    <h1>Crisps: Con's</h1>

                    <ul>
                        <li>Commonly not used as dessert</li>
                        <li>Not sweet</li>
                    </ul>
                </div>


                <div id="applepie" className="step" data-x="5000" data-y="2000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="crisps-con applepie-pro crisps icecream-pro">
                    <h1>Apple pie</h1>

                    <ul>
                        <li>Apple's in a pie</li>
                        <li>Many recipes exist. (Grandma's is the best.)</li>
                        <li>Vanilla sauce or cream on top</li>
                    </ul>
                </div>

                <div id="applepie-pro" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="applepie applepie-con crisps-pro icecream-con">
                    <h1>Apple pie: Pro's</h1>

                    <ul>
                        <li>Great for dessert</li>
                        <li>Or just with a cup of tea or glass of milk</li>
                        <li>Best when warm</li>
                    </ul>
                </div>


                <div id="applepie-con" className="step" data-rel-x="0" data-rel-y="1000"
                     data-goto-key-list="ArrowUp ArrowDown ArrowLeft ArrowRight"
                     data-goto-next-list="applepie-pro conclusion crisps-con conclusion">
                    <h1>Apple pie: Con's</h1>

                    <ul>
                        <li>I'm allergic to apple (but a small slice is worth it)</li>
                        <li>Not finger food</li>
                    </ul>
                </div>


                <div id="conclusion" className="step" data-rel-x="1000" data-rel-y="1000">
                    <h1>Conclusion</h1>

                    <p>Can I choose all three ;-)</p>
                </div>

                <div id="overview" className="step" data-x="3000" data-y="2000" data-scale="9"
                     >
                </div>
            </div>

            <div id="impress-toolbar"></div>

            <div className="impress-progressbar">
                <div></div>
            </div>
            <div className="impress-progress"></div>

            <div id="impress-help"></div>
        </>
    );
};
export default PPTPreviewImpress;
