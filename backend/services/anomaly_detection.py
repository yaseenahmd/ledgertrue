# services/anomaly_detection.py
import requests
from config import DEEPSEEK_API_KEY

async def perform_anomaly_detection_with_deepseek(df):
    try:
        # Convert the entire dataset to a string representation for the prompt
        data_sample = df.to_dict(orient='records')
        
        prompt = f"""
        Analyze the following dataset for potential anomalies or unusual patterns:
        
        Dataset: {data_sample}
        
        Provide a detailed analysis focusing on:
        1. Any statistically unusual values or outliers.
        2. Unexpected trends or patterns in the data.
        3. Potential data quality issues (e.g., missing values, inconsistencies).
        4. Recommendations for further investigation or data cleaning.
        
        Structure your response as follows:
        - **Summary**: A brief overview of the findings.
        - **Detailed Analysis**: A breakdown of the anomalies detected.
        - **Recommendations**: Suggestions for addressing the issues.
        """
        
        # DeepSeek API request
        response = requests.post(
            "https://api.deepseek.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": "You are a data analysis assistant."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1000,
                "temperature": 0.5
            }
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Extract and return the response content
        result = response.json()
        return result['choices'][0]['message']['content'].strip()
    
    except Exception as e:
        return f"Error in DeepSeek analysis: {str(e)}"