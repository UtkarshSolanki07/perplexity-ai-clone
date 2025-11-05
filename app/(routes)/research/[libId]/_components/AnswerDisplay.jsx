import React from "react";
import SourceList from "./SourceList";
import DisplaySummary from "./DisplaySummary";

function AnswerDisplay({ research, loadingResearch }) {
  return (
    <div>
      <SourceList
        searchResult={research?.searchResult}
        loadingSearch={loadingResearch}
      />
      <DisplaySummary aiResp={research?.aiResp} />
    </div>
  );
}

export default AnswerDisplay;
