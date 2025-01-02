import { IoIosClose } from "react-icons/io";
import React, { useState, useEffect } from "react";

interface ModalAIProps {
  contentType: string;
  onClose: () => void;
}

const Content: React.FC<{ content: string; suggestions: string[] }> = ({
  content,
  suggestions,
}) => {
  return (
    <div className="flex-grow h-full flex flex-col overflow-y-auto">
      <div className="pb-4">
        <h3 className="text-lg font-semibold pb-2">Feedback</h3>
        <p className="break-words p-2 rounded border border-gray-200">
          {content}
        </p>
      </div>
      {suggestions.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Suggestions</h3>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-2 rounded border border-gray-300">
                {suggestion}
              </div>
            ))}
          </div>
          <button className="text-white p-2 rounded border bg-blue-500 hover:bg-blue-700">
            Apply
          </button>
        </div>
      ) : (
        <div>No suggestions available</div>
      )}
    </div>
  );
};

const ModalAI: React.FC<ModalAIProps> = ({ contentType, onClose }) => {
  const [isContentLoaded, setContentLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (contentType === "Suggestions") {
      setContent("Suggestions content");
      const suggestions: any[] = [];
      for (let i = 0; i < 15; i++) {
        suggestions.push(`Suggestion ${i + 1}`);
      }
      setSuggestions(suggestions);
    } else {
      setContent("Analyze content");
    }

    const timer = setTimeout(() => {
      setContentLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [contentType]);

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="flex flex-col bg-white h-2/3 overflow-y-auto p-6 rounded-lg shadow-lg w-2/3 lg:w-1/3"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">AI Modal</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}>
            <IoIosClose className="w-6 h-6" />
          </button>
        </div>
        {/* Show loading spinner or placeholder until content is ready */}
        <div className="flex-grow flex items-center justify-center">
          {isContentLoaded ? (
            <Content content={content} suggestions={suggestions} />
          ) : (
            <div className="text-center">
              <div className="loader border-t-blue-500 border-4 w-8 h-8 mx-auto animate-spin rounded-full"></div>
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAI;
