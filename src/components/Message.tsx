import React from "react";
import {Box} from "@chakra-ui/react";

interface Props {
    role: "user" | "assistant";
    children: React.ReactNode;
}

export const Message = ({role, children}: Props) => {
    return (
        <Box mb={2} bg="gray.200" p={4} borderRadius="md" bgColor={role === "user" ? "blue.100" : "gray.100"} overflow="auto">
            {children}
        </Box>
    );
};
