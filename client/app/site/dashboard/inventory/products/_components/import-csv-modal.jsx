"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Upload, X } from "lucide-react"
import { parseCSV, validateAndTransformProducts, generateSampleCSV } from "@/lib/import-utils"

export function ImportCSVModal({ isOpen, onClose, onImport }) {
  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [importSummary, setImportSummary] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type !== "text/csv") {
      setError("Please select a CSV file")
      setFile(null)
      setFileName("")
      return
    }

    setFile(selectedFile)
    setFileName(selectedFile?.name || "")
    setError("")
  }

  const handleImport = async () => {
    if (!file) {
      setError("Please select a CSV file to import")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Parse the CSV file
      const csvData = await parseCSV(file)

      // Validate and transform the data
      const { validProducts, invalidRows } = validateAndTransformProducts(csvData)

      // Set import summary
      setImportSummary({
        totalRows: csvData.length,
        validRows: validProducts.length,
        invalidRows: invalidRows,
      })

      // If there are valid products, pass them to the parent component
      if (validProducts.length > 0) {
        onImport(validProducts)
      }
    } catch (err) {
      console.error("Error importing CSV:", err)
      setError("Failed to parse CSV file. Please check the file format.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadSample = () => {
    const csvContent = generateSampleCSV()
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", "sample_products_import.csv")
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetModal = () => {
    setFile(null)
    setFileName("")
    setError("")
    setImportSummary(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!importSummary ? (
            <>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CSV file only</p>
                  </div>
                  <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {fileName && (
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span className="text-sm truncate max-w-[300px]">{fileName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null)
                      setFileName("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground">
                <p>The CSV file should have the following required columns:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>name (required)</li>
                  <li>sku (required)</li>
                  <li>price (required, number)</li>
                  <li>reorderLevel (required, number)</li>
                </ul>

                <p className="mt-2">For product quantities, you can use either:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>A single &quot;quantity&quot; column for total inventory</li>
                  <li>Multiple columns with your location names (e.g., &quot;Main Storage&quot;, &quot;Warehouse&quot;, etc.)</li>
                </ul>

                <Button variant="link" size="sm" className="mt-2 p-0 h-auto" onClick={handleDownloadSample}>
                  <Download className="h-3 w-3 mr-1" />
                  Download sample CSV
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <Alert variant={importSummary.validRows > 0 ? "default" : "destructive"}>
                <AlertTitle>Import Summary</AlertTitle>
                <AlertDescription>
                  <p>Total rows: {importSummary.totalRows}</p>
                  <p>Successfully imported: {importSummary.validRows}</p>
                  <p>Failed rows: {importSummary.invalidRows.length}</p>
                </AlertDescription>
              </Alert>

              {importSummary.invalidRows.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Issues found:</h4>
                  <div className="max-h-[200px] overflow-y-auto border rounded-md p-2">
                    <ul className="space-y-2">
                      {importSummary.invalidRows.map((item, index) => (
                        <li key={index} className="text-sm">
                          <span className="font-medium">Row {item.row}:</span>
                          <ul className="list-disc pl-5 mt-1">
                            {item.errors.map((err, i) => (
                              <li key={i} className="text-red-500">
                                {err}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {!importSummary ? (
            <>
              <Button variant="outline" onClick={resetModal}>
                Cancel
              </Button>
              <Button onClick={handleImport} disabled={!file || isLoading}>
                {isLoading ? "Processing..." : "Import"}
              </Button>
            </>
          ) : (
            <Button onClick={resetModal}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

