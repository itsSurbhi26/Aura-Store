/**
 * Helper to resolve product and category image URLs
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
  }

  // If path is already a full URL (e.g. http://... or https://...)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If relative path starts with /, append backend origin
  const backendOrigin = 'http://localhost:3000';
  if (imagePath.startsWith('/')) {
    return `${backendOrigin}${imagePath}`;
  }

  return `${backendOrigin}/${imagePath}`;
};

export const getFallbackImage = () => {
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
};
