import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const {newChat, prevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const chatsEndRef = useRef(null);
    const chatsContainerRef = useRef(null);

    const scrollToBottom = () => {
        chatsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null); //prevchat load
            return;
        }

        if(!prevChats?.length) return;

        const content = reply.split(" "); //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx+1).join(" "));

            idx++;
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    // Auto-scroll when new messages arrive
    useEffect(() => {
        scrollToBottom();
    }, [prevChats, latestReply, newChat])

    return (
        <div className="chats" ref={chatsContainerRef}>
            {newChat && (
                <div className="chatContent">
                    <h1 style={{ 
                        fontSize: '2rem', 
                        fontWeight: '500', 
                        color: '#b4b4b4',
                        margin: '2rem 0',
                        textAlign: 'center'
                    }}>
                        Start a New Chat!
                    </h1>
                </div>
            )}
            <div className="chatContent">
                {
                    prevChats?.slice(0, -1).map((chat, idx) => 
                        <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                            {
                                chat.role === "user"? 
                                <p className="userMessage">{chat.content}</p> : 
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    prevChats.length > 0  && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"} >
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"} >
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }
                <div ref={chatsEndRef} />
            </div>
        </div>
    )
}

export default Chat;