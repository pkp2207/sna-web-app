'use client';
import 'aframe';

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import dynamic from "next/dynamic";

// Import ForceGraph2D with dynamic loading
const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false }
);

export default function Home() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInstitution, setFilterInstitution] = useState("all");
  const [centrality, setCentrality] = useState({});
  const [showCentrality, setShowCentrality] = useState(false);

  // Fetch network data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get detailed network data
        const networkResponse = await axios.get("http://localhost:8000/network/detailed");
        const detailedData = networkResponse.data;
        
        // Process and set the graph data
        setGraphData({
          nodes: detailedData.nodes.map(node => ({
            id: node.id,
            institution: node.institution || "Other",
            type: node.type || "coauthor",
            citations: node.citations || 0,
            h_index: node.h_index || 0,
            i10_index: node.i10_index || 0
          })),
          links: detailedData.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            relationship: edge.relationship || "unknown"
          }))
        });
        
        // Get centrality data
        const centralityResponse = await axios.get("http://localhost:8000/centrality");
        setCentrality(centralityResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load network data. Please ensure the API server is running.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters to the graph data
  const filteredData = useCallback(() => {
    if (filterInstitution === "all") {
      return graphData;
    }
    
    // Filter nodes by institution
    const filteredNodes = graphData.nodes.filter(node => 
      node.institution === filterInstitution || node.type === "coauthor"
    );
    
    // Get the IDs of filtered nodes
    const nodeIds = new Set(filteredNodes.map(node => node.id));
    
    // Filter links to only include connections between filtered nodes
    const filteredLinks = graphData.links.filter(link => 
      nodeIds.has(link.source.id || link.source) && 
      nodeIds.has(link.target.id || link.target)
    );
    
    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, filterInstitution]);

  const nodeColor = useCallback(node => {
    if (node.type === "professor") {
      return node.institution === "IIT" ? "#ff6b6b" : "#4dabf7";
    }
    return "#82c91e"; // coauthors
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading citation network...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">Citation Network Analysis</h1>
      
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="mr-2">Filter by Institution:</label>
          <select 
            value={filterInstitution}
            onChange={(e) => setFilterInstitution(e.target.value)}
            className="border rounded p-1 text-black"
          >
            <option className='text-black' value="all">All Institutions</option>
            <option className='text-black' value="IIT">IIT Only</option>
            <option className='text-black' value="NIT">NIT Only</option>
          </select>
        </div>
        
        <button 
          onClick={() => setShowCentrality(!showCentrality)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          {showCentrality ? "Hide" : "Show"} Centrality Metrics
        </button>
      </div>
      
      {showCentrality && centrality.metrics && (
        <div className="w-full max-w-2xl mb-4 p-4 border rounded bg-gray-50 text-black">
          <h2 className="text-lg font-semibold mb-2">Network Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Nodes:</span> {centrality.metrics.nodes}</p>
              <p><span className="font-medium">Edges:</span> {centrality.metrics.edges}</p>
            </div>
            <div>
              <p><span className="font-medium">Density:</span> {centrality.metrics.density.toFixed(4)}</p>
              <p><span className="font-medium">Clustering:</span> {centrality.metrics.average_clustering.toFixed(4)}</p>
            </div>
          </div>
          
          {centrality.top_degree_centrality && (
            <div className="mt-4">
              <h3 className="font-medium">Top Nodes by Centrality:</h3>
              <ul className="mt-2">
                {Object.entries(centrality.top_degree_centrality).slice(0, 5).map(([node, value]) => (
                  <li key={node}>{node}: {value.toFixed(4)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="w-full h-[70vh] border border-gray-300 rounded-lg overflow-hidden">
        {filteredData().nodes.length > 0 ? (
          <ForceGraph2D 
            graphData={filteredData()} 
            nodeColor={nodeColor}
            nodeLabel={node => `${node.id} ${node.type === "professor" ? `(${node.institution})` : ""}`}
            linkDirectionalParticles={2}
            linkWidth={1}
            nodeRelSize={6}
            cooldownTime={3000}
            onNodeClick={node => {
              // Display node details when clicked
              alert(`${node.id}\nType: ${node.type}\n${node.type === "professor" ? 
                `Institution: ${node.institution}\nCitations: ${node.citations}\nH-Index: ${node.h_index}` : 
                "Coauthor"}`);
            }}
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">No network data available</div>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-400 rounded-full mr-2"></div>
          <span>IIT Professors</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
          <span>NIT Professors</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
          <span>Coauthors</span>
        </div>
      </div>
    </div>
  );
}