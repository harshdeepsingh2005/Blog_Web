import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function ImageUploader({ value, onChange, className = '', label = 'Upload Image' }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(data.data.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const clearImage = () => {
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative group rounded-none overflow-hidden border-4 border-text-primary dark:border-white">
          <img src={value} alt="Uploaded preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              className="p-3 bg-accent text-white rounded-none hover:bg-white hover:text-accent border-2 border-transparent hover:border-accent transition-colors"
              title="Remove image"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full h-40 flex flex-col items-center justify-center border-4 border-text-primary dark:border-white rounded-none bg-surface dark:bg-surface-dark hover:bg-text-primary dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors text-text-primary dark:text-white group"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mb-2 text-accent" size={32} />
              <span className="text-sm font-bold uppercase tracking-widest">UPLOADING...</span>
            </>
          ) : (
            <>
              <Upload size={32} className="mb-2 group-hover:text-white dark:group-hover:text-black" />
              <span className="text-sm font-bold uppercase tracking-widest group-hover:text-white dark:group-hover:text-black">{label}</span>
              <span className="text-xs mt-2 font-medium uppercase tracking-widest group-hover:text-white/80 dark:group-hover:text-black/80">PNG, JPG, WEBP &lt; 5MB</span>
            </>
          )}
        </button>
      )}
      <input
        type="file"
        ref={inputRef}
        onChange={handleUpload}
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
      />
    </div>
  );
}
