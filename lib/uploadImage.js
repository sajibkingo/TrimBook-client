const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function uploadImageToImgBB(file) {
    if (!file) {
        throw new Error("Please select an image file to upload.");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Invalid file type. Only JPG, PNG, or WebP images are allowed.");
    }

    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
        throw new Error("Image file is too large. Maximum allowed size is 5MB.");
    }

    if (!IMGBB_API_KEY) {
        throw new Error(
            "Image upload is not configured (missing NEXT_PUBLIC_IMGBB_API_KEY). Please paste an Image URL instead."
        );
    }

    const formData = new FormData();
    formData.append("image", file);

    let response;
    try {
        response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );
    } catch (networkError) {
        throw new Error("Image upload failed due to a network error.");
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.success || !data?.data?.display_url) {
        throw new Error(
            data?.error?.message || "Failed to upload image. Please try another photo or paste a URL."
        );
    }

    return data.data.display_url;
}