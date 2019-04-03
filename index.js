import React from 'react';
import ReactDOM from 'react-dom';
import Graph from 'react-graph-vis';

const actualForEach = require('tallbag-for-each');

const container = document.createElement('div');
document.body.appendChild(container);

function metadataToGraph(metadata) {
  const nodes = [];
  const edges = [];
  (function doIt(m, prevId, index) {
    // create node
    const node = {id: prevId + '.', label: m.name};
    if (typeof index === 'number') node.id = prevId + index;
    nodes.push(node);
    // create edge
    if (prevId) edges.push({from: node.id, to: prevId});
    // continue
    if (Array.isArray(m.source)) {
      for (let i = 0; i < m.source.length; i++) {
        doIt(m.source[i], node.id, i);
      }
    } else if (m.source) {
      doIt(m.source, node.id);
    }
  })(metadata, '');
  return {nodes, edges};
}

class Visualizer extends React.Component {
  shouldComponentUpdate(nextProps) {
    const prevGraph = metadataToGraph(this.props.metadata);
    const nextGraph = metadataToGraph(nextProps.metadata);
    const prev = JSON.stringify(prevGraph);
    const next = JSON.stringify(nextGraph);
    return next !== prev;
  }

  render() {
    const metadata = this.props.metadata;
    const graph = metadata
      ? metadataToGraph(metadata)
      : {
          nodes: [
            {id: 1, label: 'Node 1', title: 'node 1 tootip text'},
            {id: 2, label: 'Node 2', title: 'node 2 tootip text'},
            {id: 3, label: 'Node 3', title: 'node 3 tootip text'},
            {id: 4, label: 'Node 4', title: 'node 4 tootip text'},
            {id: 5, label: 'Node 5', title: 'node 5 tootip text'},
          ],
          edges: [
            {from: 1, to: 2},
            {from: 1, to: 3},
            {from: 2, to: 4},
            {from: 2, to: 5},
          ],
        };

    const options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'DU',
        },
      },
      physics: {
        enabled: false,
      },
      edges: {
        color: '#000000',
      },
      height: '500px',
    };

    return React.createElement(Graph, {graph, options});
  }
}

const forEach = operation => source => {
  actualForEach(operation, metadata => {
    ReactDOM.render(React.createElement(Visualizer, {metadata}), container);
  })(source);
};

module.exports = forEach;
