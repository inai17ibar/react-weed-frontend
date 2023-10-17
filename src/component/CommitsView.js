import React from 'react';
import CommitListComponent from './CommitListComponent';
import ContributionsGraph from './ContributionsGraph';
import CommitsGraph from './CommitsGraph';
//import  './CommitsView.css';
import CommitChart from './CommitChart';

function CommitsView({ commits, commitData, contributionDays }) {
  return (
    // MyCommit データのリストをここにレンダリング
    <div>
    <CommitListComponent commits={commits}/>
    <CommitChart commitData={commitData}/>
    <div className="weed-contribution-container">
      <h1>Contributions Graph</h1>
      {contributionDays && contributionDays.length > 0 ? (
      <ContributionsGraph data={contributionDays} />
      ): (<p>No contributions to display</p>)}
    </div>
    <div className="weed-commits-container">
      <h1>Commits Graph</h1>
      {commitData && commitData.length > 0 ? (
      <CommitsGraph data={commitData} />
      ):( <p>No commits to display</p> )}
    </div>
    </div>
  );
}

export default CommitsView;