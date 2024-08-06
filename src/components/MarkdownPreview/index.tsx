import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {dracula} from "react-syntax-highlighter/dist/cjs/styles/prism";
import Latex from "react-latex";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "./index.less";
import {CodeBlock} from "./CodeBlock";
import {Box} from "@chakra-ui/react";

interface Props {
    markdown: string;
}

export const MarkdownPreview = ({markdown}: Props) => {
    return (
        <ReactMarkdown
            className="g-markdown-preview"
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm, remarkMath]}
            components={{
                code({className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || "");

                    if (match?.[1] === "math") {
                        return <Latex displayMode>{`$${children}$`}</Latex>;
                    }

                    const lineCount = String(children).split("\n").length;

                    return lineCount > 1 ? (
                        <CodeBlock language={match?.[1] || "text"} message={String(children)}>
                            <SyntaxHighlighter
                                customStyle={{
                                    borderTopLeftRadius: 0,
                                    borderTopRightRadius: 0,
                                    fontSize: 13,
                                }}
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                style={dracula}
                                PreTag="div"
                                language={match?.[1] || "text"}
                                {...props}
                            >
                                {String(children).replace(/\n$/, "")}
                            </SyntaxHighlighter>
                        </CodeBlock>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                table({children, ...props}) {
                    return (
                        <Box overflow="auto">
                            <table {...props}>{children}</table>
                        </Box>
                    );
                },
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
};
