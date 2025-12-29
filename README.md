# sna-web-app

Backend running at https://sna-web-app.onrender.com/

Full app running on https://pkp-citnet-app.onrender.com/

# SNA Web App

A full-stack web application for visualizing and analyzing citation networks of professors from IIT Delhi and NIT Trichy.  Built with Next.js (frontend) and FastAPI (backend), this tool provides interactive network visualizations and centrality metrics for academic collaboration networks.

## 🌐 Live Demo

- **Full Application**: [https://pkp-citnet-app.onrender.com/](https://pkp-citnet-app.onrender.com/)
- **Backend API**: [https://sna-web-app.onrender.com/](https://sna-web-app.onrender.com/)

## 📋 Features

- **Interactive Network Visualization**:  Explore citation networks with force-directed graph layouts
- **Centrality Metrics**: Calculate and display degree centrality, betweenness centrality, and closeness centrality
- **Academic Data**: Analyze professor citation data including: 
  - Total Citations
  - H-Index
  - i10-Index
  - Coauthor relationships
- **Institution Comparison**: Compare networks between IIT Delhi and NIT Trichy
- **Network Statistics**: View density, clustering coefficients, and other graph metrics

## 🏗️ Architecture

### Backend (FastAPI + NetworkX)
- RESTful API built with FastAPI
- Network analysis using NetworkX
- CSV-based data storage for professor citation data
- CORS-enabled for frontend integration

### Frontend (Next.js + React)
- Modern React framework with Next.js 14
- Interactive graph visualization with `react-force-graph`
- Responsive UI built with TailwindCSS
- API integration with Axios

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)
- **Docker** and **Docker Compose** (for containerized deployment)

### Local Development

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The backend will be available at `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Deployment

Run the entire application stack using Docker Compose:

```bash
docker-compose up --build
```

This will start:
- Backend on `http://localhost:8000`
- Frontend on `http://localhost:3000`

## 📊 API Endpoints

### `GET /`
Returns API status and basic network statistics. 

**Response:**
```json
{
  "message": "Citation Network API",
  "nodes": 150,
  "edges": 420
}
```

### `GET /network`
Returns basic network structure (nodes and edges).

**Response:**
```json
{
  "nodes": ["Prof.  A", "Prof. B", ... ],
  "edges": [["Prof. A", "Prof. B"], ...]
}
```

### `GET /network/detailed`
Returns detailed network data including node attributes. 

**Response:**
```json
{
  "nodes": [
    {
      "id": "Prof. A",
      "institution": "IIT",
      "citations": 5000,
      "h_index": 40,
      "i10_index": 120,
      "type": "professor"
    }
  ],
  "edges": [
    {
      "source": "Prof.  A",
      "target": "Prof. B",
      "relationship": "coauthor"
    }
  ]
}
```

### `GET /centrality`
Returns network centrality metrics.

**Response:**
```json
{
  "top_degree_centrality": {
    "Prof. A": 0.85,
    "Prof. B":  0.72
  },
  "metrics": {
    "nodes": 150,
    "edges": 420,
    "density": 0.04,
    "average_clustering": 0.35
  }
}
```

## 📁 Project Structure

```
sna-web-app/
├── backend/
│   ├── main.py                              # FastAPI application
│   ├── requirements. txt                     # Python dependencies
│   ├── Dockerfile                           # Backend Docker configuration
│   ├── iitd_professor_citation_data.csv     # IIT Delhi data
│   └── nitt_professor_citation_data.csv     # NIT Trichy data
├── frontend/
│   ├── app/                                 # Next.js app directory
│   ├── package.json                         # Node.js dependencies
│   ├── Dockerfile                           # Frontend Docker configuration
│   └── README.md                            # Frontend documentation
├── docker-compose. yml                       # Docker orchestration
├── LICENSE                                  # MIT License
└── README. md                                # This file
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **NetworkX**:  Network analysis and graph theory
- **Pandas**: Data manipulation and CSV processing
- **Uvicorn**: ASGI server

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **React**:  Component-based UI library
- **react-force-graph**: Interactive graph visualization
- **Axios**: HTTP client for API requests
- **TailwindCSS**: Utility-first CSS framework
- **A-Frame**: WebVR framework (for 3D visualizations)

## 📈 Data Format

The application expects CSV files with the following structure:

```csv
Professor Name,Citations,H-Index,i10-Index,Coauthors
Dr. John Doe,5000,40,120,"['Dr. Jane Smith', 'Dr. Bob Johnson']"
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**pkp2207**
- GitHub: [@pkp2207](https://github.com/pkp2207)

## 🙏 Acknowledgments

- Citation data sourced from Google Scholar
- Built with open-source libraries and frameworks
- Deployed on Render

---

**Note**: This is an academic project for social network analysis of professor citation networks. Data accuracy depends on the source CSV files. 
