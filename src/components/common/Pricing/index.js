import CheckMark from '@/assets/images/pic/check-mark.svg';
import './index.scss'
import {FormattedMessage} from "react-intl";
import {useContext} from "react";
import {EventContext, StateContext} from "@/context";
import dayjs from 'dayjs';
import store from "store";
import {findIndexById} from "@/utils/tool";

export default function Pricing() {
  const event = useContext(EventContext);
  const {mine = {}, org = {}} = useContext(StateContext);

  const currentOrg = store.get('organization');


  function onContactClick() {
    event.emit({
      type: 'modal-contact-us',
      val: 2,
    });
  }

  function getFooterFn(index) {
    try {
      const paymentType = mine.organizations[findIndexById(mine.organizations, currentOrg)].paymentType;
      if (paymentType < index) {
        return 2;
      } else if (paymentType === index) {
        return 1;
      } else {
        return 0;
      }
    } catch (e) {
      return 2;
    }
  }

  const footerList = [(
    <div className="text-footer">
      <FormattedMessage id="pricing.alreadyAcquired"/>
    </div>
  ), (
    <div className="text-footer">
      <FormattedMessage id="pricing.currentPlan"/>
    </div>
  ), (
    <div className="contact-btn" onClick={onContactClick}>
      <FormattedMessage id="contactUs.title"/>
    </div>
  )];

  const PlansInfo = [
    {
      title: (<FormattedMessage id="pricing.free.title"/>),
      price: (
        <div className="price-text">
          <span>￥</span>
          <span className="strong">0</span>
        </div>
      ),
      rights: [
        (<FormattedMessage id="pricing.free.rights.first"/>),
        (<FormattedMessage id="pricing.free.rights.second"/>),
        (<FormattedMessage id="pricing.free.rights.third"/>),
        (<FormattedMessage id="pricing.free.rights.fifth"/>),
        (<FormattedMessage id="pricing.free.rights.fourth"/>),
      ],
    },
    {
      title: (<FormattedMessage id="pricing.pro.title"/>),
      price: (
        <div className="price-text">
          <span>￥</span>
          <span className="strong">19</span>
          <span> / <FormattedMessage id="month"/></span>
        </div>
      ),
      rights: [
        (<FormattedMessage id="pricing.pro.rights.first"/>),
        (<FormattedMessage id="pricing.pro.rights.second"/>),
        (<FormattedMessage id="pricing.pro.rights.third"/>),
        (<FormattedMessage id="pricing.pro.rights.fifth"/>),
        (<FormattedMessage id="pricing.pro.rights.fourth"/>),
        (<FormattedMessage id="pricing.pro.rights.sixth"/>),
      ],
    },
    {
      title: (<FormattedMessage id="pricing.team.title"/>),
      price: (
        <div className="price-text">
          <span>￥</span>
          <span className="strong">69</span>
          <span> / <FormattedMessage id="month"/></span>
        </div>
      ),
      rights: [
        (<FormattedMessage id="pricing.team.rights.first"/>),
        (<FormattedMessage id="pricing.team.rights.second"/>),
        (<FormattedMessage id="pricing.team.rights.third"/>),
        (<FormattedMessage id="pricing.team.rights.fifth"/>),
        (<FormattedMessage id="pricing.team.rights.fourth"/>),
        (<FormattedMessage id="pricing.team.rights.sixth"/>),
      ],
    },
  ];

  return (
    <div className="plans-wrapper">
      {
        PlansInfo.map((plan, index) => {
          return (
            <div className="plan-box" key={index}>
              <div className="top-container">
                <div className="title">{plan.title}</div>
                <div className="price">
                  {plan.price}
                </div>
                <div className="rights">
                  {plan.rights.map((right, index) => {
                    return (
                      <div className="right" key={index}>
                        <img src={CheckMark} alt=""/>
                        {right}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bottom-container">
                {getFooterFn(index) === 1 &&
                  <span className="expired-date"><FormattedMessage
                    id="pricing.paymentExpired"/>{dayjs(org.paymentExpired).format('YYYY-MM-DD')}</span>}
                <div className="footer">{footerList[getFooterFn(index)]}</div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}
