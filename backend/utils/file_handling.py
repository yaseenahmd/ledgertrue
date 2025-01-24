# utils/file_handling.py
import pandas as pd
import io

def read_excel_file(file_contents):
    try:
        df = pd.read_excel(io.BytesIO(file_contents))
        print("Excel file read successfully:", df.head())  # Add logging
        return df
    except Exception as e:
        print("Error reading Excel file:", e)
        raise