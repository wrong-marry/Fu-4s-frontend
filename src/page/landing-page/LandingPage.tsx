import {Title, useMantineTheme} from "@mantine/core";
import Carousel from "../../component/carousel/HomeCarousel";
import {HeroContent, HeroContent2} from "../../component/hero/HeroContent";
import DocumentTitle from "../../component/document-title/DocumentTitle";
import React from "react";

export default function LandingPage() {
    DocumentTitle("FU-4S");
    return (
        <div className="overflow-x-hidden">
            <HeroContent />
            <div className="p-10 mx-auto">
                <Title className="text-center text-4xl">
                    About us
                </Title>
            </div>
            <HeroContent2/>
            <div className="p-10 mx-auto">
                <Title className="text-center text-4xl">
                    Join now
                </Title>
            </div>
            <Carousel/>
        </div>
    ) as React.ReactElement;
}
