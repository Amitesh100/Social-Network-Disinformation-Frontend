import React from 'react';
import { GitCommit, AlertTriangle, UserCheck, Flame, Network } from 'lucide-react';

export default function Sidebar({ 
  selectedNode, 
  traceData, 
  onTraceOrigin, 
  isTracing, 
  botClusters, 
  influencers,
  onSelectPost 
}) {
  return (
        <aside style={{
        width: '380px',
        minWidth: '380px',       
        maxWidth: '380px',
        flexShrink: 0,           
        backgroundColor: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border-color)',
        padding: '20px',
        overflowY: 'auto',
        height: '100%',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
        }}>
      {/* Node Inspector Panel */}
      <div>
        <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Entity Inspector
        </h3>
        
        {selectedNode ? (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '700' }}>
                {selectedNode.label === 'User' ? `@${selectedNode.username}` : selectedNode.label}
              </span>
              {selectedNode.label === 'User' && (
                <span className={`badge ${selectedNode.isBot ? 'badge-bot' : 'badge-user'}`}>
                  {selectedNode.isBot ? 'BOT' : 'AUTHENTIC'}
                </span>
              )}
              {selectedNode.label === 'Post' && (
                <span className={`badge ${selectedNode.isFlagged ? 'badge-flagged' : 'badge-user'}`}>
                  {selectedNode.isFlagged ? 'FLAGGED' : 'CLEAN'}
                </span>
              )}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>ID:</strong> <code>{selectedNode.id}</code></div>
              {selectedNode.cluster && <div><strong>Cluster:</strong> {selectedNode.cluster}</div>}
              {selectedNode.followerCount !== undefined && <div><strong>Followers:</strong> {selectedNode.followerCount.toLocaleString()}</div>}
              {selectedNode.content && (
                <div style={{ marginTop: '6px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', fontStyle: 'italic' }}>
                  "{selectedNode.content}"
                </div>
              )}
            </div>

            {selectedNode.label === 'Post' && (
              <button 
                className="btn btn-primary" 
                style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}
                onClick={() => onTraceOrigin(selectedNode.id)}
                disabled={isTracing}
              >
                <GitCommit size={14} />
                {isTracing ? 'Tracing Lineage...' : 'Trace Patient Zero (Multi-Hop)'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: '16px', border: '1px dashed var(--border-color)', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            Click any node on the graph to inspect details and trace provenance.
          </div>
        )}
      </div>

      {/* Multi-Hop Lineage Result Panel */}
      {traceData && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.05)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '8px',
          padding: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
            <AlertTriangle size={16} />
            Provenance Discovery
          </div>
          <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div><strong>Patient Zero:</strong> <code style={{ color: '#f87171' }}>@{traceData.patientZero}</code></div>
            <div><strong>Account Type:</strong> {traceData.originIsBot ? 'Autonomous Bot' : 'Human Operator'}</div>
            <div><strong>Cascade Depth:</strong> {traceData.totalHops} Hops Traversed</div>
            {traceData.originCluster && <div><strong>Origin Bot Cluster:</strong> {traceData.originCluster}</div>}
            <div style={{ marginTop: '6px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '4px' }}>
              <strong>Root Claim:</strong> "{traceData.originContent}"
            </div>
          </div>
        </div>
      )}

      {/* Coordinated Bot Rings Section */}
      {botClusters.length > 0 && (
        <div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Network size={14} /> Coordinated Bot Rings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {botClusters.map((cluster, i) => (
              <div 
                key={i} 
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => onSelectPost(cluster.targetPostId)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                  <span style={{ color: '#c084fc' }}>{cluster.clusterName}</span>
                  <span style={{ color: '#f87171' }}>Risk: {cluster.riskScore}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Amplified Post: <code>{cluster.targetPostId}</code> ({cluster.botCount} synchronized bots)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Influencer Centrality Table */}
      {influencers.length > 0 && (
        <div>
          <h3 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={14} /> Top Amplifiers
          </h3>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            {influencers.map((inf, i) => (
              <div 
                key={i}
                style={{
                  padding: '8px 12px',
                  borderBottom: i < influencers.length - 1 ? '1px solid var(--border-color)' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px'
                }}
              >
                <span>@{inf.username}</span>
                <span style={{ color: 'var(--text-muted)' }}>+{inf.amplifiedReach} downstream reposts</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}