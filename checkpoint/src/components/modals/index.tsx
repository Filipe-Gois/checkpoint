import { Dispatch, SetStateAction } from "react";

export type ModalProps = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export { default as ModalAddSquad } from "./ModalAddSquad"
export { default as ModalAddTask } from "./ModalAddTask"
export { default as ModalAddUser } from "./ModalAddUser"
export { default as ModalCalendar } from "./ModalCalendar"
export { default as ModalEditSquad } from "./ModalEditSquad"
export { default as ModalJustify } from "./ModalJustify"
export { default as ModalViewTask } from "./ModalViewTask"
export { default as ModalViewJustification } from "./ModalViewJustification"
export { default as ModalViewMoreJustification } from "./ModalViewMoreJustification"
export { default as ModalViewUser } from "./ModalViewUser"