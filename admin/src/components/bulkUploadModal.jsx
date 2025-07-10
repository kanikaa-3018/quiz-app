import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, FolderOpen, Download, X } from "lucide-react";
import { API_BASE_URL } from '../config';

export default function BulkUploadModal({ onClose, onSuccess }) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/questions/bulk-upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Successfully uploaded ${data.length || 0} questions`,
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV or Excel file",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const downloadTemplate = () => {
    const csvContent = `Class,Stream,Subject,Topic,Question,Option A,Option B,Option C,Option D,Correct Answer
10,,Science,Motion,What is velocity?,Speed,Displacement/time,Force,Acceleration,B
10,,Science,Light,What is a concave mirror?,Diverging,Flat,Converging,None,C
10,,Science,Electricity,What flows in a circuit?,Voltage,Electrons,Protons,Neutrons,B`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quiz_questions_template.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "Use this template to format your questions",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[100vh] overflow-auto z-[9999] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-xl border border-gray-300 rounded-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Bulk Upload Questions</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Upload CSV or Excel File</h4>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <div className="mb-4">
                <CloudUpload className="w-12 h-12 text-gray-400 mx-auto" />
              </div>
              {selectedFile ? (
                <div>
                  <p className="text-green-600 mb-2">✓ {selectedFile.name}</p>
                  <p className="text-sm text-gray-500">Size: {(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-2">Drag and drop your file here, or</p>
                  <label className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <FolderOpen className="w-4 h-4 mr-2 inline" />
                    Browse Files
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Supported formats: CSV, XLSX, XLS (Max 10MB)</p>
                </>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Required File Format</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">Include these columns:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-white">
                      {[
                        "Class",
                        "Stream (leave blank for lower classes)",
                        "Subject",
                        "Topic",
                        "Question",
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D",
                        "Correct Answer",
                      ].map((col) => (
                        <th key={col} className="px-3 py-2 text-left font-medium text-gray-900 border border-gray-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {[
                        "10",
                        "",
                        "Science",
                        "Electricity",
                        "What flows in a circuit?",
                        "Voltage",
                        "Electrons",
                        "Protons",
                        "Neutrons",
                        "B",
                      ].map((val, i) => (
                        <td key={i} className="px-3 py-2 text-gray-600 border border-gray-200">
                          {val}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <Button onClick={downloadTemplate} variant="outline" className="text-blue-600 hover:text-blue-800">
              <Download className="w-4 h-4 mr-2" />
              Download Sample Template
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className="btn-primary"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload Questions"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
