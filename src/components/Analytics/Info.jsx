import React from "react";

const Info = () => {
  return (
    <div className="w-full grid grid-cols-3 gap-4 mb-6">
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Time spent / Estimated time</div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">100/200 hours</div>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Time spent daily</div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">100 hours</div>
        </div>
      </div>
      <div className="rounded-xl border bg-card shadow">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="text-sm">Total tasks</div>
        </div>
        <div className="p-6 pt-0">
          <div className="text-2xl font-bold">20 tasks</div>
        </div>
      </div>
    </div>
  );
};

export default Info;
