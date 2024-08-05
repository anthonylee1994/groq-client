import React, {useState} from "react";
import Groq from "groq-sdk";
import {Box, Button, Flex, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import {MarkdownPreview} from "./components/MarkdownPreview";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const groq = new Groq({apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true});

export const App = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue.trim() === "") return;

        setIsLoading(true);

        const newMessage: Message = {
            role: "user",
            content: inputValue,
        };

        setMessages(messages => [...messages, newMessage]);
        setInputValue("");

        const chatCompletion = await groq.chat.completions.create({
            messages: [...messages, newMessage],
            model: "llama3-70b-8192",
        });

        if (chatCompletion.choices[0]?.message?.content) {
            setMessages([...messages, newMessage, {role: "assistant", content: chatCompletion.choices[0].message.content}]);
        }

        setIsLoading(false);
    };

    React.useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, [messages]);

    return (
        <Flex flexDir="column">
            <Box flex={1} p={4} overflowY="auto" pb={20}>
                <Box maxW="2xl" mx="auto">
                    {messages.map((message, index) => (
                        <Box key={index} mb={2} bg="gray.200" p={4} borderRadius="md" bgColor={message.role === "user" ? "blue.100" : "gray.100"} overflow="auto">
                            <MarkdownPreview markdown={message.content} />
                        </Box>
                    ))}
                </Box>
            </Box>
            <Flex
                p={{base: 2, sm: 4}}
                py={{base: 2, sm: 4}}
                maxW="2xl"
                w="full"
                mx="auto"
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bg="white"
                borderTopWidth="1px"
                pb="env(safe-area-inset-bottom)"
            >
                <form style={{display: "flex", width: "100%"}} onSubmit={handleSubmit}>
                    <InputGroup size="md">
                        <Input pr="4.5rem" placeholder="Ask for question" value={inputValue} onChange={event => setInputValue(event.target.value)} />
                        <InputRightElement width="4.5rem">
                            <Button h="1.75rem" size="sm" type="submit" isLoading={isLoading}>
                                Send
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </form>
            </Flex>
        </Flex>
    );
};
