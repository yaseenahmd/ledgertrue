# utils/file_handling.py
import pandas as pd
import io

def read_excel_file(file_contents):
    return pd.read_excel(io.BytesIO(file_contents))