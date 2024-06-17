import {
  Title,
  Button,
  Text,
  Overlay,
  AspectRatio,
  useComputedColorScheme,
  TypographyStylesProvider
} from "@mantine/core";
import homepageCover from "../../asset/homepage-cover.jpg";
import landingCover from "../../asset/landing-cover.jpg";
import { useNavigate } from "react-router-dom";
import React from "react";

export function HeroContent() {
  const navigate = useNavigate();
  const color = useComputedColorScheme();
  return (
      <AspectRatio
          pos="relative"
          className="w-full h-screen bg-cover "
          style={{backgroundImage: `url(${homepageCover})`}}
    >
        {color == "dark" && <Overlay
            gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            opacity={0.3}
            zIndex={0}
        />}

      <div className="h-full flex justify-start items-center w-[80%] mx-auto">
        <div className="basis-1/2">
          <Title >Welcome to FU-4S Forum!</Title>
          <Text className="text-left" size="xl" mt="xl">
            A dedicated platform for FPT University students majoring in
            Software Engineering.
          </Text>
          <Text className="text-left" size="xl">
            Join the community to get your educational journey enhanced with
            valuable resources and interactive discussions!
          </Text>

          <Button onClick={()=>navigate("/home")} variant="gradient" size="xl" radius="xl" className="mt-5">
            Get started
          </Button>
        </div>
      </div>
      </AspectRatio>
  ) as React.ReactElement;
}

export function HeroContent2() {
  const navigate = useNavigate();
  const color = useComputedColorScheme();
  return (
      <AspectRatio
          className="w-full h-screen bg-cover "
          style={{backgroundImage: `url(${landingCover})`}}
          pos="relative"
      >
        {color == "dark" && <Overlay
            gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
            opacity={0.3}
            zIndex={0}
        />}

        <div className="h-full flex justify-center items-center w-[80%] mx-auto">
          <div className="basis-1/2 ms-2 me-10 mt-20">
            <TypographyStylesProvider>
              <Title>Guaranteed high quality!</Title>
              <Text className="text-start" size="xl" mt="xl">
                A dedicated platform for FPT University students majoring in
                Software Engineering.
              </Text>
              <Text className="text-start" size="xl">
                Join the community to get your educational journey enhanced with
                valuable resources and interactive discussions!
              </Text>
            </TypographyStylesProvider>
            <Button color={"orange"} onClick={() => navigate("/home")} variant="filled" size="xl" radius="xl"
                    className="mt-5 ms-40">
              Explore our forum
            </Button>
          </div>
        </div>
      </AspectRatio>
  ) as React.ReactElement;
}
