import { useRef, useState } from "react";
import { supabaseAuth } from "../lib/supabaseClient.js"; // Adjust path if needed

export function AvatarUpload({ currentUrl, userId, onUpload, disabled }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Create unique file path for user (avatars/{userId}.{ext})
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}.${fileExt}`;

    // Upload to Supabase Storage (upsert = true overwrites old avatar)
    let { error: uploadError } = await supabaseAuth.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data } = supabaseAuth.storage.from('avatars').getPublicUrl(filePath);
    if (!data?.publicUrl) {
      alert("Could not get public URL");
      setUploading(false);
      return;
    }

    setPreview(data.publicUrl); // Show the new preview
    onUpload(data.publicUrl);   // Update parent component
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center mt-2">
      <div
        className="relative"
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        onClick={() => !disabled && inputRef.current?.click()}
        title={disabled ? "" : "Change avatar"}
      >
        <img
          src={preview || currentUrl || "/default-avatar.png"}
          alt="Avatar"
          className="rounded-full w-24 h-24 object-cover border-2 border-gray-200"
        />
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center rounded-full">
            <span className="text-gray-700 text-sm">Uploading…</span>
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />
      <button
        type="button"
        className="mt-2 text-xs text-blue-600 underline"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
      >
        Change Avatar
      </button>
    </div>
  );
}
