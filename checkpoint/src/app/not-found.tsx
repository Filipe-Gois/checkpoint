"use client";
import Player from "lottie-react";
import animationNotFound from "@/assets/animations/notfound.json";
import { MainContainer } from "@/components/container";

const NotFound = () => {

    return (
        <MainContainer>
            <section className="flex flex-col w-full h-screen justify-center items-center">
                <h1 className="text-center text-xl font-extrabold font-poppins md:text-6xl text-[#002346]">Página não encontrada!</h1>

                <Player
                    animationData={animationNotFound}
                    className="w-full h-2/4 md:h-[70%]"
                    autoplay
                />
            </section>
        </MainContainer>
    );
};

export default NotFound;
