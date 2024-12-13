import { Dispatch, RefObject, SetStateAction } from "react";
import "./style.css"

type ToggleMobileSidebarProps = {
    inputRef: RefObject<HTMLInputElement> | null;
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ToggleMobileSidebar = ({ inputRef, isOpen, setIsOpen }: ToggleMobileSidebarProps) => {
    const abrirOuFecharSidebarMobile = () => {

        setIsOpen(prev => !prev)

        if (inputRef && inputRef.current) {
            inputRef.current.checked = !inputRef.current.checked;
        }
    }
    return (
        <button className="md:!hidden bar" onClick={abrirOuFecharSidebarMobile} >
            <input ref={inputRef} type="checkbox" id="check" />

            <span className="top"></span>
            <span className="middle"></span>
            <span className="bottom"></span>
        </button>
    );
};

export default ToggleMobileSidebar;