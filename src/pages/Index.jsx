import { useState } from 'react';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name.replace('.csv', ''));
    
    Papa.parse(file, {
      complete: (results) => {
        if (results.errors.length) {
          setError('Error parsing CSV file. Please check the file format.');
          return;
        }
        const json = JSON.stringify(results.data, null, 2);
        setJsonData(json);
        setError('');
      },
      header: true
    });
  };

  const handleDownload = () => {
    if (!jsonData) return;
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, `${fileName}.json`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">CSV to JSON Converter</h1>
      
      <div className="mb-6">
        <Input 
          type="file" 
          accept=".csv" 
          onChange={handleFileUpload}
          className="mb-4"
        />
        <Button 
          onClick={handleDownload} 
          disabled={!jsonData}
          className="w-full"
        >
          Download JSON
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {jsonData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Preview:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {jsonData.slice(0, 200)}...
          </pre>
        </div>
      )}
    </div>
  );
};

export default Index;
