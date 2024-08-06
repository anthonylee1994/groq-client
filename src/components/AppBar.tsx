import {Box, Flex, IconButton, Text} from "@chakra-ui/react";
import {DeleteIcon, RepeatIcon} from "@chakra-ui/icons";

interface Props {
    onClear: () => void;
    onRefresh: () => void;
}

export const AppBar = ({onClear, onRefresh}: Props) => {
    return (
        <Box zIndex={10} p={2} bg="gray.300" position="fixed" w="full">
            <Flex maxW="2xl" mx="auto" alignItems="center" justifyContent="space-between">
                <IconButton aria-label="delete" variant="ghost" colorScheme="gray" onClick={onClear} icon={<DeleteIcon />} />
                <Text textAlign="center" ml={2} fontSize="xl" fontWeight="bold">
                    Groq
                </Text>
                <IconButton aria-label="refresh" variant="ghost" colorScheme="gray" onClick={onRefresh} icon={<RepeatIcon />} />
            </Flex>
        </Box>
    );
};
