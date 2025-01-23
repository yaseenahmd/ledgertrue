import React, { useState } from 'react';
import axios from 'axios';

// Add a spinner component or import a spinner library if needed
const Spinner = () => (
  <div className="loader">Loading...</div>
);

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file.');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while processing the file.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          Generate Anomaly Detection Report
        </h1>

        <div className="flex flex-col items-center space-y-6">
          {/* File Input */}
          <div className="flex flex-col items-center w-full">
            <label
              htmlFor="fileInput"
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg cursor-pointer hover:scale-105 transform transition duration-300 hover:bg-gradient-to-r hover:from-blue-700 hover:to-purple-700"
            >
              {file ? file.name : 'Choose a File'}
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className={`w-full px-6 py-4 text-white font-semibold rounded-xl transition duration-300 shadow-lg transform hover:scale-105 focus:outline-none ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            }`}
          >
            {isLoading ? <Spinner /> : 'Upload and Generate Report'}
          </button>

          {/* Download Section */}
          {pdfUrl && (
            <div className="mt-6 text-center">
              <h3 className="text-xl font-semibold text-white mb-4">
                Report Generated Successfully!
              </h3>
              <a
                href={pdfUrl}
                download="anomaly_detection_report.pdf"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-teal-600 transform hover:scale-105 transition duration-300 shadow-lg"
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
