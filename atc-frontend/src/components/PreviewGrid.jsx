import React from "react";

export default function PreviewGrid({ files }) {
    if (!files || files.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {files.map((file, index) => (
                <div key={index} className="border rounded-xl shadow p-2">
                    <img
                        src={URL.createObjectURL(file)}
                        alt={`upload-${index}`}
                        className="w-full h-40 object-cover rounded-lg"
                    />
                    <p className="text-sm text-center mt-2 truncate">{file.name}</p>
                </div>
            ))}
        </div>
    );
}
