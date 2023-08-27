import {Outlet} from 'react-router-dom';
import ModalContactUs from "@/features/modal-contact-us";
import ModalSettings from "@/features/modal-settings";
import ModalBindPhone from "@/features/modal-bind-phone";
import React, {useContext} from "react";
import {StateContext} from "../context";

export default function NoSidebarLayout() {
  const { mine } = useContext(StateContext);
  return (
    <>
      <div id="detail">
        <Outlet />
      </div>
      {
        mine &&
        <ModalSettings/>
      }
      <ModalContactUs/>
      <ModalBindPhone/>
    </>
  );
}
