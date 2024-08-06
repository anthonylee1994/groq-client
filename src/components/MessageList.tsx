import {Box} from "@chakra-ui/react";
import React from "react";

interface Props {
    children: React.ReactNode;
}

export const MessageList = ({children}: Props) => {
    return (
        <Box flex={1} p={4} overflowY="auto" pb="calc(env(safe-area-inset-bottom) + 120px)" pt="calc(env(safe-area-inset-top) + 80px)">
            <Box maxW="2xl" mx="auto">
                {children}
            </Box>
        </Box>
    );
};
