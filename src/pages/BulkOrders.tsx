import React, { useState } from 'react';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { downloadTemplate } from '../store/slices/ordersSlice';

interface RecentUpload {
  fileName: string;
  date: string;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
}

const BulkOrders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    // Implement template download logic
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Implement file upload logic
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const category = event.target.value;
    dispatch(downloadTemplate(category));
  };

  return (
    <div id="bulk-orders-page" className="space-y-6 p-6">
      {/* Header */}
      <div id="bulk-orders-header" className="flex items-center gap-4">
        <button
          id="bulk-orders-header-back-button"
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 id="bulk-orders-header-title" className="text-2xl font-bold">Bulk Orders</h1>
      </div>

      {/* Import Section */}
      <div id="bulk-orders-import-section" className="bg-white rounded-lg shadow-sm p-6">
        <div id="bulk-orders-import-section-title" className="flex justify-between items-center mb-4">
          <h2 id="bulk-orders-import-section-title-text" className="text-lg font-semibold">Import Bulk Orders</h2>
          <div id="bulk-orders-import-section-template-select-container" className="relative">
            <select
              id="bulk-orders-import-section-template-select"
              className="flex items-center text-blue-600 hover:text-blue-700"
              onChange={handleCategoryChange}
              defaultValue=""
            >
              <option id="bulk-orders-import-section-template-select-option-download-template" value="" disabled>Download Template</option>
              <option id="bulk-orders-import-section-template-select-option-next-day" value="next-day">Next Day Delivery</option>
              <option id="bulk-orders-import-section-template-select-option-standard" value="standard">Standard Delivery</option>
              <option id="bulk-orders-import-section-template-select-option-express" value="express">Express Delivery</option>
              <option id="bulk-orders-import-section-template-select-option-same-day" value="same-day">Same Day Delivery</option>
            </select>
          </div>
        </div>
        
        <p id="bulk-orders-import-section-description" className="text-gray-600 mb-6">
          Download the sample file and replace its data with your order data. Make sure all mandatory fields are filled. Save the file and upload it back.
        </p>

        {/* Upload Area */}
        <div id="bulk-orders-import-section-upload-area" className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div id="bulk-orders-import-section-upload-area-content" className="flex flex-col items-center justify-center text-center">
            <Upload id="bulk-orders-import-section-upload-area-content-upload-icon" className="w-12 h-12 text-gray-400 mb-4" />
            <p id="bulk-orders-import-section-upload-area-content-drag-and-drop-text" className="text-gray-600 mb-2">Drag And Drop to upload the files here</p>
            <p id="bulk-orders-import-section-upload-area-content-or-text" className="text-gray-500 mb-4">OR</p>
            <label id="bulk-orders-import-section-upload-area-content-browse-and-upload-label" className="cursor-pointer text-blue-600 hover:text-blue-700">
              Browse and Upload
              <input
                type="file"
                className="hidden"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload}
                id="bulk-orders-import-section-upload-area-content-browse-and-upload-input"
              />
            </label>
            <p id="bulk-orders-import-section-upload-area-content-file-format-description" className="text-gray-500 mt-2">
              Only <span className="font-medium">csv, xls & xls</span> file format will be accepted.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div id="bulk-orders-recent-uploads-table" className="bg-white rounded-lg shadow-sm p-6">
        <h2 id="bulk-orders-recent-uploads-table-title" className="text-lg font-semibold mb-4">Recent Uploads</h2>
        <div id="bulk-orders-recent-uploads-table-content" className="overflow-x-auto">
          <table id="bulk-orders-recent-uploads-table-content-table" className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr id="bulk-orders-recent-uploads-table-content-table-header" className="bg-gray-50">
                <th id="bulk-orders-recent-uploads-table-content-table-header-file-name" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                <th id="bulk-orders-recent-uploads-table-content-table-header-date" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th id="bulk-orders-recent-uploads-table-content-table-header-no-of-orders" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Of Orders</th>
                <th id="bulk-orders-recent-uploads-table-content-table-header-successful-orders" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Successful Orders</th>
                <th id="bulk-orders-recent-uploads-table-content-table-header-failed-orders" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed Orders</th>
              </tr>
            </thead>
            <tbody id="bulk-orders-recent-uploads-table-content-table-body" className="bg-white divide-y divide-gray-200">
              {recentUploads.map((upload, index) => (
                <tr id="bulk-orders-recent-uploads-table-content-table-row" key={index}>
                  <td id="bulk-orders-recent-uploads-table-content-table-row-file-name" className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{upload.fileName}</td>
                  <td id="bulk-orders-recent-uploads-table-content-table-row-date" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.date}</td>
                  <td id="bulk-orders-recent-uploads-table-content-table-row-no-of-orders" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.totalOrders}</td>
                  <td id="bulk-orders-recent-uploads-table-content-table-row-successful-orders" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.successfulOrders}</td>
                  <td id="bulk-orders-recent-uploads-table-content-table-row-failed-orders" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.failedOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkOrders; 