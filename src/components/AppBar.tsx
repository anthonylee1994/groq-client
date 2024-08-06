import {Box, Flex, IconButton, Select} from "@chakra-ui/react";
import {DeleteIcon} from "@chakra-ui/icons";
import React from "react";
import {groq} from "../utils/groq.ts";
import Groq from "groq-sdk";
import Model = Groq.Model;

interface Props {
    onClear: () => void;
    model: string;
    setModel: (model: string) => void;
}

export const AppBar = ({onClear, model, setModel}: Props) => {
    const [models, setModels] = React.useState<Model[]>([]);

    React.useEffect(() => {
        groq.models.list().then(({data}) => setModels(data));
    }, []);

    return (
        <Box zIndex={10} p={2} bg="gray.300" position="fixed" w="full">
            <Flex maxW="2xl" mx="auto" alignItems="center" justifyContent="space-between">
                <IconButton mr={2} aria-label="delete" variant="ghost" colorScheme="gray" onClick={onClear} icon={<DeleteIcon />} />
                <Select w="full" variant="filled" placeholder="Select model" value={model} onChange={e => setModel(e.target.value)}>
                    {models
                        .filter(m => !["whisper-large-v3"].includes(m.id))
                        .map(model => (
                            <option key={model.id} value={model.id}>
                                {model.id}
                            </option>
                        ))}
                </Select>
            </Flex>
        </Box>
    );
};
