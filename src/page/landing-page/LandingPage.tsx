import { Title } from "@mantine/core";
import Carousel from "../../component/carousel/HomeCarousel";
import HeroContent from "../../component/hero/HeroContent";
import DocumentTitle from "../../component/document-title/DocumentTitle";

export default function LandingPage() {
    DocumentTitle("FU-4S");
    return (
        <div className="overflow-x-hidden">
            <HeroContent />
            <div className="p-10 mx-auto">
                <Title className="text-center text-4xl">
                    Why you should use FU-4S
                </Title>
            </div>
            <Carousel />
        </div>
    );
  }
