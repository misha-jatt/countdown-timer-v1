"use client";

import Countdown from "@/components/count-down";

export default function Home() {
    return (
        <div className="flex justify-center">
            <h1>
                <Countdown/>
            </h1>
        </div>
    );
}