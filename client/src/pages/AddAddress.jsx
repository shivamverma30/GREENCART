import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { isRequired, isValidEmail, isValidIndianMobile, sanitizeInput } from '../utils/validation';

const InputField = ({ type, placeholder, name, handleChange, address, onBlur, error, showError, ...rest }) => {
  return (
    <div>
      <input
        className={`w-full px-2 py-2.5 border rounded outline-none text-gray-500 focus:border-primary transition ${showError ? 'border-red-500 bg-red-50' : 'border-gray-500/30'}`}
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={onBlur}
        name={name}
        value={address[name]}
        required
        {...rest}
      />
      {showError && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  );
};

const AddAddress = () => {
  const { user, navigate, addUserAddress } = useAppContext();
  const [address, setAddresses] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = {
    ...(isRequired(address.firstName) ? {} : { firstName: 'First name is required' }),
    ...(isRequired(address.lastName) ? {} : { lastName: 'Last name is required' }),
    ...(isRequired(address.email) ? {} : { email: 'Email is required' }),
    ...(isRequired(address.email) && !isValidEmail(address.email)
      ? { email: 'Please enter a valid email address' }
      : {}),
    ...(isRequired(address.street) ? {} : { street: 'Street is required' }),
    ...(isRequired(address.city) ? {} : { city: 'City is required' }),
    ...(isRequired(address.state) ? {} : { state: 'State is required' }),
    ...(isRequired(address.zipCode) ? {} : { zipCode: 'Zip code is required' }),
    ...(isRequired(address.zipCode) && !/^\d{6}$/.test(String(address.zipCode))
      ? { zipCode: 'Zip code must be exactly 6 digits' }
      : {}),
    ...(isRequired(address.country) ? {} : { country: 'Country is required' }),
    ...(isRequired(address.phone) ? {} : { phone: 'Mobile number is required' }),
    ...(isRequired(address.phone) && !isValidIndianMobile(address.phone)
      ? { phone: 'Enter a valid 10-digit Indian mobile number starting with 6-9' }
      : {}),
  };
  const isFormValid = Object.keys(errors).length === 0;

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const normalizedValue = name === 'phone' || name === 'zipCode'
      ? value.replace(/\D/g, '')
      : value;

    setAddresses((prevAddress) => ({
      ...prevAddress, 
      [name]: normalizedValue,
    }));
  };

const onSubmitHandler = async (e) => {
  e.preventDefault();
  setSubmitAttempted(true);

  if (!isFormValid) {
    toast.error('Please fix form errors before submitting');
    return;
  }

  const sanitizedAddress = Object.fromEntries(
    Object.entries(address).map(([key, value]) => [key, sanitizeInput(value)])
  );

  const result = await addUserAddress(sanitizedAddress);

  if (result.success) {
    toast.success(result.message);
    navigate('/cart', {
      state: {
        selectedAddressId: result.address?._id,
      },
    });
  } else {
    toast.error(result.message);
  }
};

  useEffect(()=>{
    if(!user){
      navigate('/cart')
    }
  },[user, navigate])

  return (
    <div className='mt-16 pb-16'>
      <p className='text-2xl md:text-3xl text-gray-500'>
        Add Shipping <span className='font-semibold text-primary'>Address</span>
      </p>

      <div className='flex flex-col-reverse md:flex-row justify-between mt-10'>
        <div className='flex-1 max-w-md'>
          <form onSubmit={onSubmitHandler} className='space-y-3 mt-6 text-sm'>
            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                name='firstName'
                type='text'
                placeholder='First Name'
                onBlur={() => markTouched('firstName')}
                error={errors.firstName}
                showError={Boolean(errors.firstName) && (submitAttempted || touched.firstName)}
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name='lastName'
                type='text'
                placeholder='Last Name'
                onBlur={() => markTouched('lastName')}
                error={errors.lastName}
                showError={Boolean(errors.lastName) && (submitAttempted || touched.lastName)}
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name='email'
              type='email'
              placeholder='Email address'
              onBlur={() => markTouched('email')}
              error={errors.email}
              showError={Boolean(errors.email) && (submitAttempted || touched.email)}
            />
            <InputField
              handleChange={handleChange}
              address={address}
              name='street'
              type='text'
              placeholder='Street'
              onBlur={() => markTouched('street')}
              error={errors.street}
              showError={Boolean(errors.street) && (submitAttempted || touched.street)}
            />

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                name='city'
                type='text'
                placeholder='City'
                onBlur={() => markTouched('city')}
                error={errors.city}
                showError={Boolean(errors.city) && (submitAttempted || touched.city)}
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name='state'
                type='text'
                placeholder='State'
                onBlur={() => markTouched('state')}
                error={errors.state}
                showError={Boolean(errors.state) && (submitAttempted || touched.state)}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <InputField
                handleChange={handleChange}
                address={address}
                name='zipCode'
                type='text'
                placeholder='ZipCode'
                onBlur={() => markTouched('zipCode')}
                error={errors.zipCode}
                showError={Boolean(errors.zipCode) && (submitAttempted || touched.zipCode)}
                inputMode='numeric'
                maxLength={6}
              />
              <InputField
                handleChange={handleChange}
                address={address}
                name='country'
                type='text'
                placeholder='Country'
                onBlur={() => markTouched('country')}
                error={errors.country}
                showError={Boolean(errors.country) && (submitAttempted || touched.country)}
              />
            </div>

            <InputField
              handleChange={handleChange}
              address={address}
              name='phone'
              type='text'
              placeholder='Phone'
              onBlur={() => markTouched('phone')}
              error={errors.phone}
              showError={Boolean(errors.phone) && (submitAttempted || touched.phone)}
              inputMode='numeric'
              maxLength={10}
            />

            <button
              disabled={!isFormValid}
              className='w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase disabled:cursor-not-allowed disabled:opacity-60'
            >
              Save address
            </button>
          </form>
        </div>

        <img className='md:mr-16 mb-16 md:mt-0' src={assets.add_address_iamge} alt="add address" />
      </div>
    </div>
  );
};

export default AddAddress;
