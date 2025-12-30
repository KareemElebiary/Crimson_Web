<?php
/**
 * Portfolio XML Server
 * Serves portfolio.xml with proper headers
 * Optional: Can be used instead of direct XML file access
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');

// Read the XML file
$xmlFile = 'portfolio.xml';

if (file_exists($xmlFile)) {
    // Read and output the XML content
    $xmlContent = file_get_contents($xmlFile);
    echo $xmlContent;
} else {
    // Return error XML if file not found
    http_response_code(404);
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<error>';
    echo '<message>Portfolio data not found</message>';
    echo '</error>';
}
?>
