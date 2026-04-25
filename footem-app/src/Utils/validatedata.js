// validatedata.js - Utility functions for validating user data across signup, login, and profile updates

const validateEmail = (email) => {
    if(!email || email.trim().length === 0){
        return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'Invalid email format';
};

const validatePassword = (password) => {
    if (password.length < 6) return 'Password must be at least 6 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
    if (!/\d/.test(password)) return 'Password must contain at least one number';
    return null;
};

const validateName = (fullName) => {
    if (!fullName || fullName.trim().length < 2) return 'Name must be at least 2 characters long';
    if (!/^[a-zA-Z\s]+$/.test(fullName)) return 'Name can only contain letters and spaces';
    return null;
};

const validateSignup = (data) => {
    const errors = {};
    errors.email = validateEmail(data.email);
    errors.password = validatePassword(data.password);
    if (data.confirmPassword !== data.password) errors.confirmPassword = 'Passwords do not match';
    errors.fullName = validateName(data.fullName);
    // Remove null errors
    Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);
    return Object.keys(errors).length === 0 ? null : errors;
};

const validateLogin = (data) => {
    const errors = {};
    errors.email = validateEmail(data.email);
    errors.password = data.password ? null : 'Password is required';
    Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);
    return Object.keys(errors).length === 0 ? null : errors;
};

const validateUpdateProfile = (data, touched) => {
    const errors = {};
    if (touched.email && data.email) errors.email = validateEmail(data.email);
    if (touched.fullName && data.fullName) errors.fullName = validateName(data.fullName);
    if (touched.phone && data.phone !== "") errors.phone = /^\d{10}$/.test(data.phone) ? null : 'Phone number must be 10 digits';
    Object.keys(errors).forEach(key => errors[key] === null && delete errors[key]);
    return Object.keys(errors).length === 0 ? null : errors;
};

export { validateSignup, validateLogin, validateUpdateProfile };