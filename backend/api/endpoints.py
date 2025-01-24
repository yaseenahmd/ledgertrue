# api/endpoints.py
from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
import tempfile
import os
from services.anomaly_detection import perform_anomaly_detection_with_deepseek
from services.report_generator import generate_graphs, create_pdf_report
from utils.file_handling import read_excel_file

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read the Excel file
        contents = await file.read()
        df = read_excel_file(contents)
        
        # Perform anomaly detection using DeepSeek
        deepseek_analysis = await perform_anomaly_detection_with_deepseek(df)
        
        # Generate graphs
        graphs = generate_graphs(df)
        
        # Create a PDF report
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            pdf_path = tmp_file.name
            create_pdf_report(deepseek_analysis, graphs, pdf_path)
        
        # Clean up graph files
        for graph in graphs:
            os.remove(graph)
        
        # Return the PDF file as a response
        return FileResponse(pdf_path, filename="anomaly_detection_report.pdf", media_type="application/pdf")
    
    except Exception as e:
        print("Error in upload_file:", e)  # Add logging
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")