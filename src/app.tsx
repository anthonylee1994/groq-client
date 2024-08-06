import React, {useState} from "react";
import {Flex} from "@chakra-ui/react";
import {MarkdownPreview} from "./components/MarkdownPreview";
import {AppBar} from "./components/AppBar.tsx";
import {MessageList} from "./components/MessageList.tsx";
import {Message} from "./components/Message.tsx";
import {MessageInput} from "./components/MessageInput.tsx";
import {groq} from "./utils/groq.ts";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export const App = () => {
    const inputRef = React.useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(localStorage.getItem("messages") ? JSON.parse(localStorage.getItem("messages")!) : []);
    const [inputValue, setInputValue] = useState("");
    const [model, setModel] = useState(localStorage.getItem("model") || "llama3-70b-8192");

    const createNewMessage = (content: string): Message => ({
        role: "user",
        content,
    });

    const fetchChatCompletion = async (model: string, messages: Message[]) => {
        const chatCompletion = await groq.chat.completions.create({
            model,
            messages,
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
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inputValue.trim() === "") return;

        setIsLoading(true);

        const newMessage = createNewMessage(inputValue);
        setMessages(messages => [...messages, newMessage]);
        setInputValue("");

        await fetchChatCompletion(model, [...messages, newMessage]);

        setIsLoading(false);
    };

    React.useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages));
        window.scrollTo(0, document.body.scrollHeight);
    }, [messages]);

    React.useEffect(() => {
        localStorage.setItem("model", model);
    }, [model]);

    return (
        <Flex flexDir="column">
            <AppBar onClear={() => setMessages([])} model={model} setModel={setModel} />
            <MessageList>
                {messages.map((message, index) => (
                    <Message key={index} role={message.role}>
                        <MarkdownPreview markdown={message.content} />
                    </Message>
                ))}
            </MessageList>
            <MessageInput inputRef={inputRef} isLoading={isLoading} inputValue={inputValue} setInputValue={setInputValue} handleSubmit={handleSubmit} />
        </Flex>
    );
};
