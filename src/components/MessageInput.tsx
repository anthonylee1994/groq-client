import {Flex, Textarea} from "@chakra-ui/react";
import React from "react";
import {Button} from "./ui/button";
import {InputGroup} from "./ui/input-group";

interface Props {
    inputRef: React.RefObject<HTMLTextAreaElement>;
    isLoading: boolean;
    inputValue: string;
    setInputValue: (value: string) => void;
    handleSubmit: (event: React.FormEvent) => void;
}

export const MessageInput = ({inputRef, isLoading, inputValue, setInputValue, handleSubmit}: Props) => {
    return (
        <Flex p={{base: 2, sm: 4}} py={{base: 2, sm: 4}} maxW="2xl" w="full" mx="auto" position="fixed" bottom={0} left={0} right={0} bg="white" borderTopWidth="1px" pb="env(safe-area-inset-bottom)">
            <form style={{display: "flex", width: "100%"}} onSubmit={handleSubmit}>
                <InputGroup
                    w="full"
                    endElement={
                        <Button disabled={inputValue === ""} position="relative" top={{base: -3, sm: -2}} right={-1} h="1.75rem" size="sm" type="submit" loading={isLoading}>
                            Send
                        </Button>
                    }
                >
                    <Textarea
                        onKeyDown={e => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                handleSubmit(e as never);
                            }
                        }}
                        ref={inputRef}
                        flex={1}
                        resize="none"
                        mb={{base: 2, sm: 0}}
                        pr="4.5rem"
                        placeholder="Ask for question"
                        value={inputValue}
                        onChange={event => setInputValue(event.target.value)}
                    />
                </InputGroup>
            </form>
        </Flex>
    );
};
