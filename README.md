# LedgerTrue
Project Description:  Anomaly Detection Application built with the FARM stack (FastAPI, React, MongoDB, Python) and DeepSeek for efficient data anomaly detection. Users can upload Excel files for real-time anomaly detection, with results displayed on an interactive dashboard.

# Anomaly Detection App using FARM Stack with DeepSeek

Anomaly detection tool built with FastAPI, React, MongoDB, and Python, utilizing **DeepSeek** for data analysis. Users can upload Excel files, and the app will detect anomalies, displaying results on a real-time dashboard.

## Features
- Upload and process Excel files
- Real-time anomaly detection using DeepSeek
- Interactive dashboard for data visualization
- Scalable backend with FastAPI
- Data storage using MongoDB

## Tech Stack
- Frontend: React
- Backend: FastAPI, Python
- Database: MongoDB
- Anomaly Detection: DeepSeek

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repository-name.git
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

4. Activate the virtual environment:
   - For macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - For Windows:
     ```bash
     venv\Scripts\activate
     ```

5. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

6. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the React development server:
   ```bash
   npm start
   ```

### Running MongoDB (if running locally)

1. Install MongoDB from [here](https://www.mongodb.com/try/download/community).
2. Start the MongoDB server:
   ```bash
   mongod
   ```




