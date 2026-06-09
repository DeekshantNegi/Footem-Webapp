import { useRef } from "react";
import { Pencil } from "lucide-react";

const ProfileImage = ({ image, onImageChange }) => {
  const fileInputRef = useRef();

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) onImageChange(file);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-24 h-24 flex-shrink-0 group cursor-pointer"
    >
      {/* Avatar */}
      <img
        src={image}
        alt="profile"
        className="w-full h-full rounded-full object-cover 
        border-2 border-white/10 group-hover:border-[#c8f028]/50 
        transition-all duration-300"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 rounded-full 
        flex flex-col items-center justify-center gap-1
        opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Pencil className="text-[#c8f028] w-4 h-4" />
        <span className="text-[#c8f028] text-[9px] font-bold uppercase tracking-widest">
          Edit
        </span>
      </div>

      {/* Lime ring pulse on hover */}
      <div className="absolute inset-0 rounded-full ring-2 ring-[#c8f028]/0 
        group-hover:ring-[#c8f028]/40 transition-all duration-300" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default ProfileImage;