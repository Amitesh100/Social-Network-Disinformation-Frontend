import React, { useState, useEffect } from 'react';
import StatsHeader from './components/StatsHeader';
import GraphView from './components/GraphView';
import Sidebar from './components/Sidebar';

const API_BASE = import.meta.env.VITE_API_URL;

export default function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [dbStatus, setDbStatus] = useState('DOWN');
  const [selectedNode, setSelectedNode] = useState(null);
  const [traceData, setTraceData] = useState(null);
  const [highlightedPath, setHighlightedPath] = useState([]);
  const [botClusters, setBotClusters] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTracing, setIsTracing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      setDbStatus(data.status === 'UP' ? 'UP' : 'DOWN');
    } catch {
      setDbStatus('DOWN');
    }
  };

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/graph`);
      const json = await res.json();
      if (json.success) {
        setGraphData(json.data);
      }
    } catch (err) {
      console.error('Failed to load graph data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [clusterRes, infRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/bot-clusters`),
        fetch(`${API_BASE}/analytics/influencers`)
      ]);
      const clusterJson = await clusterRes.json();
      const infJson = await infRes.json();
      if (clusterJson.success) setBotClusters(clusterJson.data);
      if (infJson.success) setInfluencers(infJson.data);
    } catch (err) {
      console.error('Failed to fetch graph analytics:', err);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchGraph();
    fetchAnalytics();
  }, []);

  const handleTraceOrigin = async (postId) => {
    setIsTracing(true);
    try {
      const res = await fetch(`${API_BASE}/trace/${postId}`);
      const json = await res.json();
      if (json.success) {
        setTraceData(json.data);
        setHighlightedPath(json.data.pathNodeIds);
      }
    } catch (err) {
      console.error('Trace error:', err);
    } finally {
      setIsTracing(false);
    }
  };

  const handleRunBotAnalysis = async () => {
    setIsAnalyzing(true);
    await fetchAnalytics();
    setIsAnalyzing(false);
  };

  const handleSelectPostFromCluster = (targetPostId) => {
    const node = graphData.nodes.find(n => n.id === targetPostId);
    if (node) {
      setSelectedNode(node);
      handleTraceOrigin(targetPostId);
    }
  };

  return (
    <div className="app-container">
      <StatsHeader 
        dbStatus={dbStatus}
        onRefresh={() => { fetchGraph(); fetchAnalytics(); checkHealth(); }}
        stats={{ nodes: graphData.nodes.length, links: graphData.links.length }}
        onRunBotAnalysis={handleRunBotAnalysis}
        isAnalyzing={isAnalyzing}
      />
      
      <div className="main-content">
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
            <div className="loader"></div>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Querying CognoDB Graph Layer...</span>
          </div>
        ) : (
          <GraphView 
            graphData={graphData}
            onNodeClick={(node) => {
              setSelectedNode(node);
              setTraceData(null);
              setHighlightedPath([node.id]);
            }}
            selectedNode={selectedNode}
            highlightedPath={highlightedPath}
          />
        )}

        <Sidebar 
          selectedNode={selectedNode}
          traceData={traceData}
          onTraceOrigin={handleTraceOrigin}
          isTracing={isTracing}
          botClusters={botClusters}
          influencers={influencers}
          onSelectPost={handleSelectPostFromCluster}
        />
      </div>
    </div>
  );
}