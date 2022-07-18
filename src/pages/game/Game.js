import React from 'react';
import PageLayout from '../../layout/PageLayout';
import WorldRender from '../../lifegame/renderers/webtext';

const Game = () => {
  return (
    <PageLayout title="Game">
      <>
        <h3>Conway's Game of Life</h3>
        <WorldRender className="world" />
      </>
    </PageLayout>
  );
};

export default Game;
