import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OwnerContext } from "../context/OwnerContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "../Components/Spinner.jsx";
import { FileCheck, Phone, MapPin, ShieldCheck, BadgeCheck, LayoutDashboard, ClipboardList } from "lucide-react";

const FIELDS = [
  {
    name: "turfName",
    label: "Turf Name",
    type: "text",
    placeholder: "e.g. Green Field Arena",
    icon: FileCheck,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter 10-digit phone number",
    icon: Phone,
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "e.g. Koramangala, Bengaluru",
    icon: MapPin,
  },
  {
    name: "businessLicenseNumber",
    label: "Business License Number",
    type: "text",
    placeholder: "Enter business license number",
    icon: ShieldCheck,
  },
  {
    name: "idProof",
    label: "ID Proof",
    type: "text",
    placeholder: "Aadhaar / PAN / Passport number",
    icon: BadgeCheck,
  },
];

const NEXT_STEPS = [
  { icon: ClipboardList,   text: "Your application will be reviewed by our admin team."          },
  { icon: ShieldCheck,     text: "We'll verify your business documents and details."              },
  { icon: BadgeCheck,      text: "Once approved, you'll receive a confirmation notification."     },
  { icon: LayoutDashboard, text: "You'll get full access to the owner dashboard to manage turfs." },
];

const ApplyForOwner = () => {
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);
  const { ownerProfile, applyForOwner, loading } = useContext(OwnerContext);

  const [formData, setFormData] = useState({
    turfName: "", phone: "", location: "",
    businessLicenseNumber: "", idProof: "",
  });
  const [errors,        setErrors]        = useState({});
  const [touched,       setTouched]       = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/signup"); return; }
    if (ownerProfile) {
      toast.info("You have already applied for owner status");
      navigate("/owner-profile");
    }
  }, [user, ownerProfile, navigate]);

  const validateForm = () => {
    const e = {};
    if (!formData.turfName?.trim())               e.turfName = "Turf name is required";
    if (!formData.phone?.trim())                  e.phone    = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, "")))
                                                  e.phone    = "Enter a valid 10-digit number";
    if (!formData.location?.trim())               e.location = "Location is required";
    if (!formData.businessLicenseNumber?.trim())  e.businessLicenseNumber = "License number is required";
    if (!formData.idProof?.trim())                e.idProof  = "ID proof is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // mark all touched so errors show
    const allTouched = Object.fromEntries(FIELDS.map((f) => [f.name, true]));
    setTouched(allTouched);
    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      await applyForOwner(formData);
      toast.success("Application submitted successfully!");
      navigate("/owner-profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] pt-20 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >

          {/* ── Page Header ── */}
          <div className="mb-8">
            <p className="text-[#c8f028] text-xs font-bold uppercase tracking-widest mb-2">
              Owner Program
            </p>
            <h1 className="text-white text-3xl font-bold leading-tight">
              Become a Turf Owner
            </h1>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Expand your business and reach more players. Fill in the details below to apply.
            </p>
            <div className="w-12 h-[3px] bg-[#c8f028] mt-4 rounded-full" />
          </div>

          {/* ── Form Card ── */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>

              {FIELDS.map(({ name, label, type, placeholder, icon: Icon }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-gray-400 text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <Icon size={13} className="text-[#c8f028]" />
                    {label}
                  </label>

                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className={`bg-[#121212] text-white text-sm w-full px-4 py-3 rounded-xl border 
                    focus:outline-none transition-colors duration-200 placeholder:text-gray-600
                    ${errors[name] && touched[name]
                      ? "border-red-500/60 focus:border-red-500"
                      : "border-white/10 focus:border-[#c8f028]/60"
                    }`}
                  />

                  <AnimatePresence>
                    {errors[name] && touched[name] && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="text-red-400 text-xs"
                      >
                        {errors[name]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={submitLoading}
                className="w-full mt-2 bg-[#c8f028] text-black font-bold py-3.5 rounded-xl
                hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                {submitLoading ? (
                  <><Spinner size={16} /> Submitting...</>
                ) : (
                  "Submit Application →"
                )}
              </motion.button>

            </form>
          </div>

          {/* ── What Happens Next ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 sm:p-8"
          >
            <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#c8f028] rounded-full inline-block" />
              What happens next?
            </h3>

            <div className="space-y-4">
              {NEXT_STEPS.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-4">
                  {/* Step number */}
                  <div className="w-7 h-7 rounded-full bg-[#c8f028]/10 border border-[#c8f028]/20
                    flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#c8f028] text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon size={16} className="text-[#c8f028] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Back link ── */}
          <div className="text-center pb-2">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 text-sm hover:text-[#c8f028] transition-colors duration-200"
            >
              ← Go back
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default ApplyForOwner;