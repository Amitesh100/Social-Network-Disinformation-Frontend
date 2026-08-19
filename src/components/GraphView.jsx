import React, { useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function GraphView({ 
  graphData, 
  onNodeClick, 
  selectedNode, 
  highlightedPath = [] 
}) {
  const fgRef = useRef();

  useEffect(() => {
    if (fgRef.current) {
      fgRef.current.d3Force('charge').strength(-180);
      fgRef.current.d3Force('link').distance(70);
    }
  }, [graphData]);

  const getNodeColor = (node) => {
    if (highlightedPath.includes(node.id)) {
      return '#facc15'; // Bright yellow for cascade path
    }
    if (node.id === selectedNode?.id) {
      return '#38bdf8'; // Blue highlight
    }
    if (node.label === 'BotCluster') return '#a855f7';
    if (node.label === 'User') {
      return node.isBot ? '#ef4444' : '#3b82f6';
    }
    if (node.label === 'Post') {
      return node.isFlagged ? '#f97316' : '#64748b';
    }
    return '#94a3b8';
  };

  const getNodeSize = (node) => {
    if (highlightedPath.includes(node.id)) return 9;
    if (node.id === selectedNode?.id) return 9;
    if (node.label === 'BotCluster') return 10;
    if (node.label === 'User') return node.followerCount > 10000 ? 8 : 6;
    if (node.label === 'Post') return node.isFlagged ? 7 : 5;
    return 5;
  };

  return (
    <div className="graph-wrapper">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel={(node) => {
          if (node.label === 'User') return `User: @${node.username} (${node.isBot ? 'BOT' : 'HUMAN'})`;
          if (node.label === 'Post') return `Post [${node.id}]: ${node.content.slice(0, 45)}...`;
          if (node.label === 'BotCluster') return `Cluster: ${node.name} (Risk: ${node.riskScore})`;
          return node.id;
        }}
        nodeVal={getNodeSize}
        nodeColor={getNodeColor}
        linkColor={(link) => {
          if (link.type === 'REPOSTED_FROM') return '#ea580c';
          if (link.type === 'BELONGS_TO') return '#a855f7';
          if (link.type === 'FOLLOWS') return '#334155';
          return '#475569';
        }}
        linkWidth={(link) => (link.type === 'REPOSTED_FROM' ? 2 : 1)}
        linkDirectionalArrowLength={4.5}
        linkDirectionalArrowRelPos={1}
        linkCurvature={0.15}
        onNodeClick={(node) => onNodeClick(node)}
        cooldownTicks={100}
      />
      
      {/* Visual Canvas Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        background: 'rgba(17, 23, 38, 0.85)',
        backdropFilter: 'blur(6px)',
        border: '1px solid var(--border-color)',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '11px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        pointerEvents: 'none'
      }}>
        <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '2px' }}>Legend</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
          <span>Bot Account</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
          <span>Authentic User</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f97316' }}></span>
          <span>Flagged Post</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#a855f7' }}></span>
          <span>Bot Cluster</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#facc15' }}></span>
          <span>Provenance Path</span>
        </div>
      </div>
    </div>
  );
}