/**
 * Utility function to export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file to download
 */
export function exportToCSV(data, filename) {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV rows
    const csvRows = [];

    // Add headers row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        // Handle values that contain commas, quotes, or newlines
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    // Combine rows into a single string
    const csvString = csvRows.join("\n");

    // Create a blob with the CSV data
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const link = document.createElement("a");

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Set link properties
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";

    // Add link to document
    document.body.appendChild(link);

    // Click the link to trigger download
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting to CSV:", error);
  }
}
