import React, { useState } from "react";
import { PiSparkle, PiMagicWandLight } from "react-icons/pi";
import { TbAnalyze } from "react-icons/tb";
import ModalAI from "./ModalAI.tsx";

const HoverAIButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("Analyze");
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {isExpanded && (
        <>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setModalContent("Analyze");
            }}
            className="flex items-center gap-2 p-4 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 transition-all">
            <TbAnalyze />
            Analyze
          </button>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setModalContent("Suggestions");
            }}
            className="flex items-center gap-2 p-4 rounded-full bg-blue-400 text-white shadow-lg hover:bg-blue-700 transition-all">
            <PiMagicWandLight />
            Suggestions
          </button>
        </>
      )}

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
          onClose={() => setIsModalOpen(false)}
          contentType={modalContent}
        />
      )}
    </div>
  );
};

export default HoverAIButton;
