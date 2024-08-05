import {Box, Flex} from "@chakra-ui/react";
import React from "react";

interface Props {
    language: string;
    message: string;
    children: React.ReactNode;
}

export const CodeBlock = ({language, message, children}: Props) => {
    const [copyText, setCopyText] = React.useState("Copy code");

    const onCopy = async () => {
        await navigator.clipboard.writeText(message);
        setCopyText("Copied!");
        window.setTimeout(() => setCopyText("Copy code"), 1000);
    };

    return (
        <Box bg="black" borderRadius="2xl">
            <Flex justifyContent="space-between" bg="black" borderTopRadius="md" alignItems="center" fontSize="xs" color="white" fontFamily="sans-serif">
                <Box m={2} mb={0}>
                    {language}
                </Box>
                <Box m={2} mb={0} cursor="pointer" onClick={onCopy}>
                    {copyText}
                </Box>
            </Flex>
            {children}
        </Box>
    );
};
