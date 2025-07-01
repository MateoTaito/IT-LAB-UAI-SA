import React from "react";
import Navbar from "../page_components/Navbar/Navbar";
import VerificationButtons from "../page_components/Verification/VerificationButtons";

export default function Verification() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
            <Navbar />
            <div className="flex items-center justify-center min-h-screen pt-20">
                <VerificationButtons />
            </div>
        </div>
    );
}
