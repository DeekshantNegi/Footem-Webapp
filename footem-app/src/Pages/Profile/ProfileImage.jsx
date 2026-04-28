import {useRef} from "react";
import {Pencil} from "lucide-react";

const ProfileImage = ({image, onImageChange}) =>{
    const fileInputRef = useRef();
    
    const handleClick = ()=>{
            fileInputRef.current.click();
    };
    
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (file) {
            onImageChange(file);
        }
    };

    return(
        <div className="relative w-32 h-32 group cursor-pointer group-hover:scale-105 transition-all duration-300">
            <img 
             src={image}
             alt="profile"
             className="w-full h-full rounded-full object-cover border"/>

            <div 
              onClick={ handleClick }
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition "
            >
                <Pencil className="text-white w-6 h-6" />
            </div>

            <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
             />

        </div>
    )
}

export default ProfileImage;