import { IoIosClose } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { AIContentType, TaskSuggestion } from "./Interfaces.tsx";
import { TaskPriority } from "../../Context/TaskContext.tsx";
import { IoIosArrowRoundForward } from "react-icons/io";

interface ModalAIProps {
  contentType: AIContentType | undefined;
  onClose: () => void;
}

interface ContentProps {
  content: string;
  suggestions: TaskSuggestion[];
}

interface SuggestionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  suggestion: TaskSuggestion;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  ...props
}) => {
  const taskPriority = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-blue-100 text-blue-700",
    Low: "bg-gray-100 text-gray-700",
  };

  return (
    <div
      {...props}
      className="p-2 rounded border border-gray-300 flex flex-col gap-2">
      <div className="font-bold">{suggestion.taskTitle}</div>
      {suggestion.newPriority != null && suggestion.oldPriority != null && (
        <div className="flex items-center gap-2">
          <p>Priority: </p>
          <div
            className={`text-sm px-2 py-1 rounded ${
              taskPriority[TaskPriority[suggestion.oldPriority]]
            }`}>
            {TaskPriority[suggestion.oldPriority]}
          </div>
          <IoIosArrowRoundForward />
          <div
            className={`text-sm px-2 py-1 rounded ${
              taskPriority[TaskPriority[suggestion.newPriority]]
            }`}>
            {TaskPriority[suggestion.newPriority]}
          </div>
        </div>
      )}
      {suggestion.newStart != null && suggestion.oldStart != null && (
        <div className="flex items-center gap-2">
          <div>Start date: </div>
          <div className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
            {suggestion.oldStart.toLocaleString()}
          </div>
          <IoIosArrowRoundForward />
          <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
            {suggestion.newStart.toLocaleString()}
          </div>
        </div>
      )}
      {suggestion.newEnd != null && suggestion.oldEnd != null && (
        <div className="flex items-center gap-2">
          <div>Start date: </div>
          <div className="text-sm px-2 py-1 rounded bg-gray-100 text-gray-700">
            {suggestion.oldEnd.toLocaleString()}
          </div>
          <IoIosArrowRoundForward />
          <div className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
            {suggestion.newEnd.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

const Content: React.FC<ContentProps> = ({ content, suggestions }) => {
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
              <SuggestionItem key={index} suggestion={suggestion} />
            ))}
          </div>
          <button className="text-white p-2 rounded border bg-blue-500 hover:bg-blue-700">
            Apply
          </button>
        </div>
      ) : (
        <div>No suggestions</div>
      )}
    </div>
  );
};

const ModalAI: React.FC<ModalAIProps> = ({ contentType, onClose }) => {
  const [isContentLoaded, setContentLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([
    {
      taskId: 1,
      taskTitle: "Task 1",
      oldPriority: TaskPriority.Low,
      newPriority: TaskPriority.High,
      oldStart: new Date("2022-01-01"),
      newStart: new Date("2022-01-15"),
    },
  ]);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (contentType === AIContentType.Suggestions) {
      setContent("Suggestions content");
    } else if (contentType === AIContentType.Analyze) {
      setContent("Analyze content");
    } else {
      setContent("Analytics content");
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
        className="flex flex-col bg-white h-2/3 overflow-y-auto p-6 rounded-lg shadow-lg w-2/3 lg:w-1/2"
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
