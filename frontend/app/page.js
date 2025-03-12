"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
const Aframe = dynamic(() => import("aframe"), { ssr: false });

const ForceGraph = dynamic(() => import("react-force-graph"), { ssr: false });

const API_BASE_URL = "https://sna-web-app.onrender.com";

const CitationNetwork = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterInstitution, setFilterInstitution] = useState("all");
  const [showCentrality, setShowCentrality] = useState(false);
  const [centrality, setCentrality] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/network`);
        setGraphData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load network data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (showCentrality) {
      const fetchCentrality = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/centrality`);
          setCentrality(response.data);
        } catch (err) {
          console.error("Error fetching centrality data:", err);
        }
      };
      fetchCentrality();
    }
  }, [showCentrality]);

  const filteredData = filterInstitution === "all"
    ? graphData
    : {
        nodes: graphData.nodes.filter(node => 
          node.institution === filterInstitution || node.type === "coauthor"
        ),
        links: graphData.links.filter(link => 
          graphData.nodes.some(node => node.id === link.source) &&
          graphData.nodes.some(node => node.id === link.target)
        ),
      };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div>
      <div className="flex gap-4 p-4">
        <select
          className="p-2 border rounded"
          value={filterInstitution}
          onChange={(e) => setFilterInstitution(e.target.value)}
        >
          <option value="all">All Institutions</option>
          <option value="Institution A">Institution A</option>
          <option value="Institution B">Institution B</option>
        </select>
        <button
          className="p-2 bg-blue-500 text-white rounded"
          onClick={() => setShowCentrality(!showCentrality)}
        >
          {showCentrality ? "Hide Centrality" : "Show Centrality"}
        </button>
      </div>
      <ForceGraph
        graphData={filteredData}
        nodeAutoColorBy="institution"
        linkDirectionalArrowLength={3.5}
      />
      {showCentrality && centrality && (
        <div className="p-4 bg-gray-100">
          <h3>Centrality Metrics</h3>
          <pre>{JSON.stringify(centrality, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CitationNetwork;
