import React, { useState } from "react";
import { PiSparkle, PiMagicWandLight } from "react-icons/pi";
import ModalAI from "./ModalAI.tsx";
import { MdOutlineFeedback } from "react-icons/md";
import { AIContentType } from "./Interfaces.tsx";

const ButtonTasksContent = ({ onSuggestion }) => {
  return (
    <button
      onClick={onSuggestion}
      className="flex items-center gap-2 p-4 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 transition-all">
      <PiMagicWandLight />
      Suggestions
    </button>
  );
};

const ButtonAnalyticsContent = ({ onAnalytics }) => {
  return (
    <button
      onClick={onAnalytics}
      className="flex items-center gap-2 p-4 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 transition-all">
      <MdOutlineFeedback />
      Feedback
    </button>
  );
};

const HoverAIButton = ({ isAnalytics = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<AIContentType | undefined>();

  const handleSuggestion = () => {
    setIsModalOpen(true);
    setModalContent(AIContentType.Suggestions);
  };

  const handleAnalytics = () => {
    setIsModalOpen(true);
    setModalContent(AIContentType.Analytics);
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isExpanded &&
        (isAnalytics ? (
          <ButtonAnalyticsContent onAnalytics={handleAnalytics} />
        ) : (
          <ButtonTasksContent onSuggestion={handleSuggestion} />
        ))}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 p-4 rounded-full bg-blue-600 text-white shadow-lg transition-all ${
          isHovered || isExpanded ? "scale-110" : "scale-100"
        }`}>
        <PiSparkle />
        {(isHovered || isExpanded) && (
          <span className="text-sm font-medium">Ask AI</span>
        )}
      </button>

      {isModalOpen && (
        <ModalAI
          onClose={() => {
            setIsModalOpen(false);
            setModalContent(undefined);
          }}
          contentType={modalContent}
        />
      )}
    </div>
  );
};

export default HoverAIButton;
