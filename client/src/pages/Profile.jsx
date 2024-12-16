import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({ avatar: currentUser.avatar });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setFilePerc(progress);
        },
      });

      const downloadURL = response.data.fileUrl;
      setFormData((prev) => ({ ...prev, avatar: downloadURL }));
      setFilePerc(100);
    } catch (error) {
      console.error('Error uploading file:', error);
      setFileUploadError(true);
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log('Updated Profile Data:', formData);
    // Add further logic here to update user information in your application
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleUpdateProfile} className='flex flex-col gap-4'>
        {/* Avatar Image */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar}
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />

        {/* Upload Feedback */}
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error uploading image (image must be 2MB)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        {/* User Inputs */}
        <input
          type='text'
          placeholder='username'
          id='username'
          defaultValue={currentUser.username}
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          className='border p-3 rounded-lg'
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        {/* Update Button */}
        <button
          type='submit'
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
        >
          Update
        </button>
      </form>

      {/* Footer Actions */}
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}
