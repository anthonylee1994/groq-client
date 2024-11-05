import React from "react";
import {Box, Flex, IconButton} from "@chakra-ui/react";
import {FaTrash} from "react-icons/fa";
import {mistral} from "../utils/mistral.ts";
import {ModelList} from "@mistralai/mistralai/models/components/modellist";
import {NativeSelectField, NativeSelectRoot} from "./ui/native-select.tsx";

interface Props {
    onClear: () => void;
    model: string;
    setModel: (model: string) => void;
}

export const AppBar = ({onClear, model, setModel}: Props) => {
    const [models, setModels] = React.useState<ModelList["data"]>([]);

    React.useEffect(() => {
        mistral.models.list().then(({data}) => setModels(data));
    }, []);

    return (
        <Box zIndex={10} p={2} bg="gray.500" position="fixed" w="full">
            <Flex maxW="2xl" mx="auto" alignItems="center" justifyContent="space-between">
                <IconButton mr={2} aria-label="delete" variant="solid" colorScheme="gray" onClick={onClear} size="sm">
                    <FaTrash size={16} />
                </IconButton>
                <NativeSelectRoot w="full" variant="subtle" colorPalette="gray">
                    <NativeSelectField value={model} onChange={e => setModel(e.target.value)}>
                        {models?.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.id}
                            </option>
                        ))}
                    </NativeSelectField>
                </NativeSelectRoot>
            </Flex>
        </Box>
    );
};
