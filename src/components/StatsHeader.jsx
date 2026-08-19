import React from 'react';
import { ShieldAlert, RefreshCw, Layers, Database } from 'lucide-react';

export default function StatsHeader({ 
    dbStatus, 
    onRefresh, 
    stats, 
    onRunBotAnalysis, 
    isAnalyzing 
}) {
    return (
        <header style={{
            height: '60px',
            backgroundColor: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            zIndex: 10
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#fff'
            }}>
            ET
            </div>
            <div>
            <h1 style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.02em' }}>
                EchoTrace
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Disinformation & Bot-Net Propagation Visualizer
            </p>
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <Database size={14} color={dbStatus === 'UP' ? '#10b981' : '#ef4444'} />
            <span style={{ color: dbStatus === 'UP' ? '#10b981' : '#ef4444' }}>
                {dbStatus === 'UP' ? 'CognoDB Connected' : 'DB Offline'}
            </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span>Nodes: <strong style={{ color: 'var(--text-main)' }}>{stats.nodes}</strong></span>
            <span>Relationships: <strong style={{ color: 'var(--text-main)' }}>{stats.links}</strong></span>
            </div>

            <button 
            className="btn btn-primary" 
            onClick={onRunBotAnalysis}
            disabled={isAnalyzing}
            >
            <ShieldAlert size={15} />
            {isAnalyzing ? 'Analyzing Rings...' : 'Detect Bot Rings'}
            </button>

            <button className="btn" onClick={onRefresh} title="Reload Graph">
            <RefreshCw size={14} />
            </button>
        </div>
        </header>
    );
}