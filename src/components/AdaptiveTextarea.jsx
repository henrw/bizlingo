import React, { useState, useEffect, useRef } from "react";
import HeadBar from "./HeadBar";


export default function AdaptiveTextarea({ placeholderText, text, setText }) {

    const textareaRef = useRef(null);

    const handleFocus = (e) => {
        if (e.target.value === placeholderText) {
            setText("");
        }
    };

    const handleBlur = (e) => {
        if (e.target.value === "") {
            setText(placeholderText);
        }
    };

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const handleInput = (e) => {
        setText(e.target.value);
        adjustHeight();
    };


    // Adjust the height on component mount and whenever text changes
    useEffect(() => {
        adjustHeight();
    }, [text]);

    return (
        <>
            <textarea
                ref={textareaRef}
                className="rounded-2xl outline outline-gray-100 outline-2 p-4"
                value={text}
                onChange={handleInput}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ color: text === placeholderText ? '#ccc' : '#000' }}
            ></textarea>

        </>
    );
};