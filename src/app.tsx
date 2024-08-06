import React, {useState} from "react";
import Groq from "groq-sdk";
import {Box, Button, Flex, IconButton, InputGroup, InputRightElement, Text, Textarea} from "@chakra-ui/react";
import {MarkdownPreview} from "./components/MarkdownPreview";
import {DeleteIcon, RepeatIcon} from "@chakra-ui/icons";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const groq = new Groq({apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true});

export const App = () => {
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(localStorage.getItem("messages") ? JSON.parse(localStorage.getItem("messages")!) : []);
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
            stream: true,
        });

        for await (const chunk of chatCompletion) {
            setMessages(messages => {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.role === "assistant") {
                    lastMessage.content += chunk.choices[0]?.delta?.content || "";
                } else {
                    return [...messages, {role: "assistant", content: chunk.choices[0]?.delta?.content || ""}];
                }
                return [...messages];
            });
        }

        setIsLoading(false);
    };

    React.useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
        window.scrollTo(0, document.body.scrollHeight);
    }, [messages]);

    return (
        <Flex flexDir="column">
            <Box p={2} bg="gray.300" position="fixed" w="full">
                <Flex maxW="2xl" mx="auto" alignItems="center" justifyContent="space-between">
                    <IconButton aria-label="delete" variant="ghost" colorScheme="gray" onClick={() => setMessages([])} icon={<DeleteIcon />} />
                    <Text textAlign="center" ml={2} fontSize="xl" fontWeight="bold">
                        Groq
                    </Text>
                    <IconButton aria-label="refresh" variant="ghost" colorScheme="gray" onClick={() => window.location.reload()} icon={<RepeatIcon />} />
                </Flex>
            </Box>
            <Box flex={1} p={4} overflowY="auto" pb="calc(env(safe-area-inset-bottom) + 120px)" pt="calc(env(safe-area-inset-top) + 80px)">
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
