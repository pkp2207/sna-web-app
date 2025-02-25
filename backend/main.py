from fastapi import FastAPI, HTTPException
import pandas as pd
import networkx as nx
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Citation Network API")

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Only allow your frontend
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Initialize Graph
G = nx.Graph()

def load_data():
    """Load data from CSV files and build the network graph"""
    try:
        # Check if files exist
        if not os.path.exists("iitd_professor_citation_data.csv") or not os.path.exists("nitt_professor_citation_data.csv"):
            print("Warning: One or more CSV files not found. Using empty dataframes.")
            iit_df = pd.DataFrame(columns=['Citations', 'H-Index', 'i10-Index', 'Coauthors'])
            nit_df = pd.DataFrame(columns=['Citations', 'H-Index', 'i10-Index', 'Coauthors'])
        else:
            # Read CSV files
            iit_df = pd.read_csv("iitd_professor_citation_data.csv", index_col=0)
            nit_df = pd.read_csv("nitt_professor_citation_data.csv", index_col=0)
        
        # Add professors to graph
        add_professors(iit_df, "IIT")
        add_professors(nit_df, "NIT")
        
        print(f"Network loaded with {G.number_of_nodes()} nodes and {G.number_of_edges()} edges")
    except Exception as e:
        print(f"Error loading data: {e}")

def add_professors(df, institution):
    """Add professors and their coauthors to the graph"""
    for professor, row in df.iterrows():
        # Add professor node
        G.add_node(
            professor, 
            institution=institution, 
            citations=row.get('Citations', 0), 
            h_index=row.get('H-Index', 0), 
            i10_index=row.get('i10-Index', 0),
            type="professor"
        )
        
        # Handle coauthors
        try:
            coauthors = eval(row['Coauthors']) if isinstance(row.get('Coauthors'), str) else []
            for coauthor in coauthors:
                G.add_node(coauthor, type="coauthor")
                G.add_edge(professor, coauthor, relationship="coauthor")
        except (SyntaxError, KeyError) as e:
            print(f"Error processing coauthors for {professor}: {e}")

@app.on_event("startup")
async def startup_event():
    """Load data on startup"""
    load_data()

@app.get("/")
def home():
    return {"message": "Citation Network API", "nodes": G.number_of_nodes(), "edges": G.number_of_edges()}

@app.get("/network")
def get_network():
    """Return the network data for visualization"""
    # Return only nodes and edges for visualization
    return {"nodes": list(G.nodes), "edges": list(G.edges)}

@app.get("/network/detailed")
def get_detailed_network():
    """Return detailed network data including node attributes"""
    nodes = [{"id": node, **G.nodes[node]} for node in G.nodes]
    edges = [{"source": u, "target": v, **G.edges[u, v]} for u, v in G.edges]
    return {"nodes": nodes, "edges": edges}

@app.get("/centrality")
def get_centrality():
    """Calculate and return network centrality metrics"""
    # Calculate various centrality measures
    degree_centrality = nx.degree_centrality(G)
    betweenness_centrality = nx.betweenness_centrality(G)
    closeness_centrality = nx.closeness_centrality(G)
    
    # Return top 10 nodes by degree centrality
    sorted_degree = sorted(degree_centrality.items(), key=lambda x: x[1], reverse=True)[:10]
    
    return {
        "top_degree_centrality": dict(sorted_degree),
        "metrics": {
            "nodes": G.number_of_nodes(),
            "edges": G.number_of_edges(),
            "density": nx.density(G),
            "average_clustering": nx.average_clustering(G)
        }
    }

# Run the server when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)