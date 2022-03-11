import Link from "next/link";
import { useState } from "react";

import { HeaderBody } from "@components/nav/headerBody";

import {
    Box,
    Burger,
    Center,
    Divider,
    Drawer,
    Header,
    MediaQuery,
    Space,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";

export const MyHeader: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <Header
                height={64}
                p="md"
                sx={(theme) => ({
                    border: "none",
                    background: "transparent",
                })}>
                <Box
                    sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "space-between",
                    })}>
                    <Link href={"/"} passHref>
                        <Text component="a" weight="bolder" size="xl">
                            Abuse Sleuth
                        </Text>
                    </Link>
                    <Box
                        sx={(theme) => ({
                            display: "flex",
                        })}>
                        <MediaQuery
                            largerThan={"xs"}
                            styles={{ display: "none" }}>
                            <Burger
                                size={"md"}
                                opened={isOpen}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                        </MediaQuery>
                        <MediaQuery
                            smallerThan={"xs"}
                            styles={{ display: "none" }}>
                            <Box>
                                <HeaderBody />
                            </Box>
                        </MediaQuery>
                        <Drawer
                            hideCloseButton
                            opened={isOpen}
                            p="md"
                            size="sm"
                            onClose={() => setIsOpen(false)}>
                            <Center>
                                <Box>
                                    <Title>Navigation</Title>
                                    <Divider my="xs" />

                                    <HeaderBody isDrawer />
                                </Box>
                            </Center>
                        </Drawer>
                    </Box>
                </Box>
            </Header>
        </>
    );
};

export default MyHeader;