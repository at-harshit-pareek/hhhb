"use client";
import React, { useState } from "react";

const CsvUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadSuccess(null);
      setErrorMessage(null);
    }
  };

  // Handle file upload button click
  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      // Prepare the form data
      const formData = new FormData();
      formData.append('file', file);

      // Send the file to the backend using fetch API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadSuccess(true);
      } else {
        setUploadSuccess(false);
        setErrorMessage(result.error || 'Failed to upload file');
      }
    } catch (error) {
      setUploadSuccess(false);
      setErrorMessage('Error occurred while uploading file');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-lg font-semibold mb-4">Upload CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>
      {uploadSuccess && <p className="mt-4 text-green-500">File uploaded successfully!</p>}
      {uploadSuccess === false && <p className="mt-4 text-red-500">File upload failed: {errorMessage}</p>}
    </div>
  );
};

export default CsvUpload;
