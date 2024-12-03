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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">Bulk Orders</h1>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Import Bulk Orders</h2>
          <div className="relative">
            <select
              className="flex items-center text-blue-600 hover:text-blue-700"
              onChange={handleCategoryChange}
              defaultValue=""
            >
              <option value="" disabled>Download Template</option>
              <option value="next-day">Next Day Delivery</option>
              <option value="standard">Standard Delivery</option>
              <option value="express">Express Delivery</option>
              <option value="same-day">Same Day Delivery</option>
            </select>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Download the sample file and replace its data with your order data. Make sure all mandatory fields are filled. Save the file and upload it back.
        </p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag And Drop to upload the files here</p>
            <p className="text-gray-500 mb-4">OR</p>
            <label className="cursor-pointer text-blue-600 hover:text-blue-700">
              Browse and Upload
              <input
                type="file"
                className="hidden"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload}
              />
            </label>
            <p className="text-gray-500 mt-2">
              Only <span className="font-medium">csv, xls & xls</span> file format will be accepted.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Uploads</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Of Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Successful Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Failed Orders</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentUploads.map((upload, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{upload.fileName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.successfulOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{upload.failedOrders}</td>
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