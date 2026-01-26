/**
 * Load image from public folder and convert to base64 for @react-pdf/renderer
 */
export async function loadImageAsBase64(imagePath: string): Promise<string> {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Failed to load image: ${imagePath}`, error);
    throw error;
  }
}

/**
 * Preload images and return base64 strings
 */
export async function preloadPDFImages(): Promise<{
  geriCareImage: string;
}> {
  const geriCareImage = await loadImageAsBase64("/Geri Care, India's Pioneer in Integrated Geriatric Care, Launches its First Assisted Living Centre for Elders in Bengaluru.png");

  return { geriCareImage };
}

