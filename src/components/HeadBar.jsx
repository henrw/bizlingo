import React from "react";

export default function ProgressBar({text}) {
    return (
        <h1 className="w-full font-bold rounded-xl p-4 text-2xl bg-theme-green text-white">
            {text}
        </h1>
    );
};