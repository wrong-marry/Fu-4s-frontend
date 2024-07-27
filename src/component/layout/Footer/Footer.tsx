import { Container, Group, ActionIcon, rem, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import classes from './Footer.module.css';
import { NavLink } from 'react-router-dom';

import logo from "../../../asset/logo.png";
import darkLogo from "../../../asset/darkLogo.png";
export function Footer() {
	const computedColorScheme = useComputedColorScheme("light");
  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
      <NavLink to={"home"}>
						<img
							className="h-12 w-36 overflow-hidden"
							src={computedColorScheme === "dark" ? darkLogo : logo}
							alt="Dark FU4S logo"
						/>
					</NavLink>
        <Group gap={0} className={classes.links} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}