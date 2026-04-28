'use client';
import { useState, useRef } from 'react';
import { X, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkImportModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const fileRef = useRef();

  const downloadTemplate = () => {
    const csv = `Name,Email,Phone
John Doe,john@email.com,+2348000000000
Jane Smith,jane@email.com,+2348111111111
Mike Johnson,mike@email.com,`;
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFile(selectedFile);

    // Parse CSV for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const phoneIdx = headers.indexOf('phone');

      if (nameIdx === -1 || emailIdx === -1) {
        toast.error('CSV must have "Name" and "Email" columns');
        setFile(null);
        return;
      }

      const parsed = lines.slice(1, 6).map(line => {
        const cols = line.split(',').map(c => c.trim().replace(/"/g, ''));
        return {
          name: cols[nameIdx] || '',
          email: cols[emailIdx] || '',
          phone: phoneIdx !== -1 ? cols[phoneIdx] || '' : ''
        };
      }).filter(row => row.name && row.email);

      setPreview(parsed);
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/customers/bulk-import', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      setResults(data);
      toast.success(`${data.imported} customers imported!`);

    } catch (err) {
      toast.error('Import failed. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            📤 Bulk Import Customers
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {!results ? (
            <>
              {/* Download Template */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    📋 Need the template?
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Download and fill in your customers
                  </p>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Download size={14} />
                  Template
                </button>
              </div>

              {/* File Upload Area */}
              <div
                onClick={() => fileRef.current.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition"
              >
                <Upload size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-600">
                  Click to upload CSV file
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Max 500 customers per import
                </p>
                {file && (
                  <p className="text-sm text-purple-600 mt-2 font-medium">
                    ✅ {file.name} selected
                  </p>
                )}
              </div>

              <input
                type="file"
                ref={fileRef}
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Preview */}
              {preview.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Preview (first {preview.length} rows):
                  </p>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Email</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {preview.map((row, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2 text-gray-700">{row.name}</td>
                            <td className="px-4 py-2 text-gray-500 text-xs">{row.email}</td>
                            <td className="px-4 py-2 text-gray-500 text-xs">{row.phone || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
                >
                  {importing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Import Customers
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            // Results View
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Import Complete!
              </h3>
              
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-green-600">
                    {results.imported}
                  </p>
                  <p className="text-xs text-green-700 mt-1">Imported</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-yellow-600">
                    {results.duplicates}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">Duplicates</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-red-600">
                    {results.failed}
                  </p>
                  <p className="text-xs text-red-700 mt-1">Failed</p>
                </div>
              </div>

              <button
                onClick={onSuccess}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition"
              >
                Done ✅
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}