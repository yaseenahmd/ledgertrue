import React, { useState } from 'react';
import * as XLSX from 'xlsx';

// Spinner Component
const Spinner = () => (
  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
);

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      // Validate file type
      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(selectedFile.type)) {
        setError('Please upload a valid Excel file (.xlsx, .xls)');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Perform Excel parsing (optional, before backend upload)
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          // Optional: You can log or validate data before upload
          console.log('Parsed Excel Data:', data);
        } catch (parseError) {
          console.error('Excel parsing error:', parseError);
        }
      };
      reader.readAsBinaryString(file);

      // Backend upload using fetch
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('An error occurred while processing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Generate Anomaly Detection Report
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {/* File Input */}
          <div className="flex flex-col items-center w-full">
            <label
              htmlFor="fileInput"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg cursor-pointer transition duration-300"
            >
              {file ? file.name : 'Choose Excel File'}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full text-center text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isLoading || !file}
            className={`w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ${
              isLoading || !file ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? <Spinner /> : 'Upload and Generate Report'}
          </button>

          {/* Download Section */}
          {pdfUrl && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Report Generated Successfully!
              </h3>
              <a
                href={pdfUrl}
                download="anomaly_detection_report.pdf"
                className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
              >
                Download PDF Report
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;