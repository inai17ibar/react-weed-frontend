import React from "react";
import { formatToJapaneseDate } from "../utils/timeUtils";

function CommitListComponent( {commits}){
    return ( 
    <div className="commit-list-container">
    <ul>
      {commits.length > 0 ? (
        commits.map((commit) => (
          <li key={commit.Sha}>
            <p>{commit.Message}</p>
            <p>{formatToJapaneseDate(commit.Date)}</p>
          </li>
        ))
      ) : (
        <li>No commits to display</li>
      )}
    </ul>
  </div>);
}

export default CommitListComponent;