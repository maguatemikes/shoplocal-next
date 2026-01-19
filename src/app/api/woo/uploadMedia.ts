import { config } from '../../lib/config';

export interface WordPressMediaUploadResponse {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: any;
    image_meta: any;
  };
  post: number | null;
  source_url: string;
}

/**
 * Upload an image to WordPress Media Library
 * @param file - The image file to upload
 * @param title - Optional title for the media
 * @param alt - Optional alt text for the image
 * @returns WordPress media object with ID and source_url
 */
export async function uploadImageToWordPress(
  file: File,
  title?: string,
  alt?: string
): Promise<WordPressMediaUploadResponse> {
  try {
    console.log('📤 Uploading image to WordPress Media Library:', file.name);

    const formData = new FormData();
    formData.append('file', file);
    
    if (title) {
      formData.append('title', title);
    }
    
    if (alt) {
      formData.append('alt_text', alt);
    }

    const url = `${config.api.wordpress}/media`;
    
    // Use WordPress Application Password authentication (not WooCommerce keys)
    const wpAuth = btoa(`${config.auth.username}:${config.auth.appPassword}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${wpAuth}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
      console.error('❌ WordPress Media API error:', errorData);
      throw new Error(errorData.message || 'Failed to upload image to WordPress');
    }

    const media: WordPressMediaUploadResponse = await response.json();
    console.log('✅ Image uploaded successfully. Media ID:', media.id);
    console.log('📷 Image URL:', media.source_url);
    
    return media;
  } catch (error) {
    console.error('❌ Error uploading image to WordPress:', error);
    throw error;
  }
}

/**
 * Delete a media item from WordPress Media Library
 * @param mediaId - The WordPress media ID
 * @param force - Whether to permanently delete (true) or move to trash (false)
 */
export async function deleteWordPressMedia(
  mediaId: number,
  force: boolean = false
): Promise<void> {
  try {
    console.log(`🗑️ Deleting WordPress media ${mediaId}`);

    const url = `${config.api.wordpress}/media/${mediaId}?force=${force}`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${config.woocommerce.authHeader}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete media' }));
      console.error('❌ WordPress Media API error:', errorData);
      throw new Error(errorData.message || 'Failed to delete media from WordPress');
    }

    console.log('✅ Media deleted successfully');
  } catch (error) {
    console.error('❌ Error deleting WordPress media:', error);
    throw error;
  }
}