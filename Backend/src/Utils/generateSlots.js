import ApiError from "./ApiError.js";

const convert24HourFormat = (time) => {
    const match = time.trim().toLowerCase().match(/^(\d{1,2})\s*(am|pm)$/);
    if(!match){
        throw new ApiError(400, "Invalid time format. Expected format: '10 AM' or '3 PM'");
    }
  const hour = parseInt(match[1]);
  const period = match[2];
  if (period === "pm" && hour !== 12) {
    hour += 12;
  } else if (period === "am" && hour === 12) {
    hour = 0;
  }
  return hour;
};

const generateSlots = (openTime, closeTime) => {        
    
  const slots = [];
  for (let i = Number(openTime); i < Number(closeTime); i++) {
    const slot = `${i}-${i + 1}`;
    slots.push(slot);
  }
  return slots;
};

export {generateSlots, convert24HourFormat};