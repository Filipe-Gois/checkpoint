"use client"
import Player from "lottie-react";
import animationNoContent from "@/assets/animations/nocontent.json";

type NoContentSearchProps = {
    text?: string
    className?: string
    isNotification?: boolean
}

const NoContentSearch = ({ text = "Nada encontrado!", className = "", isNotification = false }: NoContentSearchProps) => {
    return (
        <div className={`flex flex-col items-center ${isNotification ? "mt-0" : "mt-10"} `}>
            <p className={`font-poppins text-darkBlue text-xl ${isNotification ? "font-semibold" : "font-extrabold"} text-center`}>{text}</p>
            <Player
                animationData={animationNoContent}
                className={`w-full sm:w-1/2 xl:w-1/4 h-1/6 ${className}`}
                autoplay
            />
        </div>
    );
};

export default NoContentSearch;